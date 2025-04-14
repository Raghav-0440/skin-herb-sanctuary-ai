import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { getSkinAssessment } from '../src/services/mistralService';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Skin analysis endpoint
app.post('/api/analyze-skin', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    // Get skin assessment using the existing service
    const assessment = await getSkinAssessment({
      image: imageUrl,
      // Add any additional parameters needed for assessment
    });

    res.json(assessment);
  } catch (error) {
    console.error('Error analyzing skin:', error);
    res.status(500).json({ 
      message: 'Failed to analyze skin image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 