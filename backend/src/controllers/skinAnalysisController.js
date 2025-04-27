const formidable = require('formidable');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const os = require('os');

// Helper to send error responses
const sendErrorResponse = (res, statusCode, message) => {
  console.error(message);
  res.status(statusCode).json({ error: message });
};

// Main function to analyze skin using Python Flask ML service
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

    const formData = new FormData();
    formData.append('image', fs.createReadStream(uploadedFile.filepath), uploadedFile.originalFilename);

    const response = await axios.post('http://localhost:5000/analyze', formData, {
      headers: formData.getHeaders(),
      timeout: 90000
    });

    res.json(response.data);
  } catch (error) {
    console.error('Skin analysis error:', error.message);
    const message = error.response?.data?.error || 'Internal server error';
    res.status(500).json({ error: message });
  } finally {
    if (uploadedFile?.filepath && fs.existsSync(uploadedFile.filepath)) {
      try {
        fs.unlinkSync(uploadedFile.filepath);
      } catch (cleanupErr) {
        console.warn('Error deleting temp file:', cleanupErr.message);
      }
    }
  }
};

module.exports = {
  analyzeSkin
};
