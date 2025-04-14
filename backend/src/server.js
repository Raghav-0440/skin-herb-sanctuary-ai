require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeSkin } = require('./controllers/skinAnalysisController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/analyze-skin', analyzeSkin);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 