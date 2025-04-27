const formidable = require('formidable');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const fsPromises = require('fs').promises;

// Helper to send error responses
const sendErrorResponse = (res, statusCode, message) => {
  console.error(message);
  res.status(statusCode).json({ error: message });
};

// Helper function to clean up temporary files
const cleanupFile = async (filePath) => {
    try {
        await fsPromises.unlink(filePath);
    } catch (error) {
        console.error('Error cleaning up file:', error);
    }
};

// Helper function to format prediction results
const formatPredictionResults = (rawResults) => {
    try {
        const results = JSON.parse(rawResults);
        return {
            skinType: results.skinType || 'Unknown',
            confidence: results.confidence || 0,
            concerns: results.concerns || [],
            recommendations: results.recommendations || [],
            topPredictions: results.topPredictions || []
        };
    } catch (error) {
        console.error('Error formatting prediction results:', error);
        return {
            skinType: 'Unknown',
            confidence: 0,
            concerns: [],
            recommendations: [],
            topPredictions: []
        };
    }
};

// Main function to analyze skin using Python ML service
const analyzeSkin = async (req, res) => {
  let uploadedFile;
  try {
    const tempDir = os.tmpdir();
    const form = formidable({
      uploadDir: tempDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
      multiples: false,
      filter: ({ mimetype }) => mimetype && mimetype.includes('image'),
      filename: (name, ext) => `skin-image-${Date.now()}${ext}`
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    uploadedFile = files.image?.[0] || files.image || Object.values(files)[0];
    if (!uploadedFile) {
      return sendErrorResponse(res, 400, 'No image uploaded');
    }

    const ext = path.extname(uploadedFile.originalFilename).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return sendErrorResponse(res, 400, 'Only JPG/PNG images are allowed');
    }

    const fileBuffer = fs.readFileSync(uploadedFile.filepath);
    if (!fileBuffer || fileBuffer.length === 0) {
      return sendErrorResponse(res, 400, 'Uploaded image is empty');
    }

    // Generate a unique request ID
    const requestId = uuidv4();
    
    // Save the file to a permanent location
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const savedFilePath = path.join(uploadsDir, `${requestId}${ext}`);
    fs.copyFileSync(uploadedFile.filepath, savedFilePath);
    
    // Send the request to the ML service
    try {
      // First check if ML service is available
      const healthCheck = await axios.get('http://localhost:5001/health');
      if (healthCheck.status !== 200) {
        throw new Error('ML service is not available');
      }
      
      // Spawn Python process for analysis
      const pythonProcess = spawn('python', [
        path.join(__dirname, '..', 'ml_service.py'),
        savedFilePath,
        requestId
      ]);

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', async (code) => {
        // Clean up the uploaded file
        await cleanupFile(savedFilePath);

        if (code !== 0) {
          console.error('Python process error:', errorData);
          return res.status(500).json({
            status: 'error',
            message: 'Error processing image',
            details: errorData
          });
        }

        // Store the results
        global.predictionResults[requestId] = formatPredictionResults(outputData);

        // Return the results
        res.json({
          status: 'success',
          requestId,
          ...global.predictionResults[requestId]
        });
      });
      
    } catch (error) {
      // Clean up the uploaded file in case of error
      await cleanupFile(savedFilePath);

      console.error('Error in skin analysis:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        details: error.message
      });
    }
    
  } catch (error) {
    console.error('Skin analysis error:', error.message);
    const message = error.response?.data?.error || 'Internal server error';
    res.status(500).json({ error: message });
  }
};

// Get the result of a skin analysis
const getAnalysisResult = (req, res) => {
  const { requestId } = req.params;
  
  if (!requestId) {
    return sendErrorResponse(res, 400, 'Missing request ID');
  }
  
  const result = global.predictionResults[requestId];

  if (!result) {
    return res.status(404).json({
      status: 'error',
      message: 'Analysis result not found'
    });
  }

  res.json({
    status: 'success',
    requestId,
    ...result
  });
};

module.exports = {
  analyzeSkin,
  getAnalysisResult
};
