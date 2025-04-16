require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Configure CORS
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Simple HTML form for testing
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Skin Analysis Test</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                .container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
                .result { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                img { max-width: 100%; margin-top: 10px; }
                button { padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
                button:disabled { background: #cccccc; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Skin Analysis Test</h1>
                <form id="uploadForm" enctype="multipart/form-data">
                    <input type="file" name="image" accept="image/*" required>
                    <button type="submit">Analyze Skin</button>
                </form>
                <div id="result" class="result" style="display: none;">
                    <h2>Results</h2>
                    <div id="imagePreview"></div>
                    <div id="analysisResult"></div>
                </div>
            </div>
            <script>
                document.getElementById('uploadForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const resultDiv = document.getElementById('result');
                    const imagePreview = document.getElementById('imagePreview');
                    const analysisResult = document.getElementById('analysisResult');
                    
                    try {
                        const response = await fetch('/analyze', {
                            method: 'POST',
                            body: formData
                        });
                        const data = await response.json();
                        
                        if (response.ok) {
                            // Show image preview
                            const file = e.target.image.files[0];
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                            };
                            reader.readAsDataURL(file);
                            
                            // Show results
                            analysisResult.innerHTML = `
                                <h3>Skin Type: ${data.skinType}</h3>
                                <h3>Concerns:</h3>
                                <ul>${data.concerns.map(c => `<li>${c}</li>`).join('')}</ul>
                                <h3>Recommendations:</h3>
                                <ul>${data.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
                            `;
                            resultDiv.style.display = 'block';
                        } else {
                            analysisResult.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                            resultDiv.style.display = 'block';
                        }
                    } catch (error) {
                        analysisResult.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
                        resultDiv.style.display = 'block';
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Skin analysis endpoint
app.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Process image with sharp
        const processedImage = await sharp(req.file.buffer)
            .resize(800, 800, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toBuffer();

        const imageBase64 = processedImage.toString('base64');

        // Send to Face++ API
        const formData = new FormData();
        formData.append('api_key', process.env.FACEPP_API_KEY);
        formData.append('api_secret', process.env.FACEPP_API_SECRET);
        formData.append('image_base64', imageBase64);
        formData.append('return_attributes', 'skinstatus');

        const response = await axios.post(
            'https://api-us.faceplusplus.com/facepp/v3/detect',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
            }
        );

        if (!response.data.faces || response.data.faces.length === 0) {
            return res.status(400).json({ error: 'No face detected in the image' });
        }

        const face = response.data.faces[0];
        const skinStatus = face.attributes.skinstatus;

        // Process results
        const skinType = determineSkinType(skinStatus);
        const concerns = identifySkinConcerns(skinStatus);
        const recommendations = generateRecommendations(skinType, concerns);

        res.json({
            skinType,
            concerns,
            recommendations,
            detailedAnalysis: skinStatus
        });

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('API Error:', error.response.data);
            return res.status(error.response.status).json({ 
                error: error.response.data.error_message || 'API request failed' 
            });
        }
        res.status(500).json({ error: 'Failed to analyze skin' });
    }
});

// Helper functions
function determineSkinType(skinStatus) {
    const { dark_circle, stain, acne, health } = skinStatus;
    
    if (health.value > 80) {
        return 'Normal';
    } else if (acne.value > 60) {
        return 'Oily';
    } else if (dark_circle.value > 60 || stain.value > 60) {
        return 'Dry';
    } else {
        return 'Combination';
    }
}

function identifySkinConcerns(skinStatus) {
    const concerns = [];
    const { dark_circle, stain, acne, health } = skinStatus;

    if (dark_circle.value > 40) concerns.push('Dark Circles');
    if (stain.value > 40) concerns.push('Hyperpigmentation');
    if (acne.value > 40) concerns.push('Acne');
    if (health.value < 60) concerns.push('Dullness');

    return concerns;
}

function generateRecommendations(skinType, concerns) {
    const recommendations = [];

    // Skin type specific recommendations
    switch (skinType) {
        case 'Normal':
            recommendations.push('Maintain your current skincare routine');
            recommendations.push('Use a gentle cleanser and moisturizer');
            break;
        case 'Oily':
            recommendations.push('Use oil-free moisturizers');
            recommendations.push('Consider using a gentle cleanser twice daily');
            recommendations.push('Look for non-comedogenic products');
            break;
        case 'Dry':
            recommendations.push('Use a rich moisturizer');
            recommendations.push('Consider adding a hydrating serum');
            recommendations.push('Avoid hot water when washing your face');
            break;
        case 'Combination':
            recommendations.push('Use different products for different areas');
            recommendations.push('Consider using a balancing toner');
            break;
    }

    // Concern specific recommendations
    if (concerns.includes('Dark Circles')) {
        recommendations.push('Get adequate sleep');
        recommendations.push('Use an eye cream with vitamin K or caffeine');
    }
    if (concerns.includes('Hyperpigmentation')) {
        recommendations.push('Use sunscreen daily');
        recommendations.push('Consider products with vitamin C or niacinamide');
    }
    if (concerns.includes('Acne')) {
        recommendations.push('Use products with salicylic acid or benzoyl peroxide');
        recommendations.push('Keep your face clean and avoid touching it frequently');
    }
    if (concerns.includes('Dullness')) {
        recommendations.push('Exfoliate 2-3 times per week');
        recommendations.push('Use brightening products with vitamin C');
    }

    return recommendations;
}

app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log('Face++ API Key:', process.env.FACEPP_API_KEY ? 'Set' : 'Not Set');
}); 