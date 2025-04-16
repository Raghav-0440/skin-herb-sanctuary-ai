const dotenv = require('dotenv');
const axios = require('axios');
const sharp = require('sharp');
const FormData = require('form-data');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Get API credentials
const apiKey = process.env.FACEPP_API_KEY;
const apiSecret = process.env.FACEPP_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error('API credentials not found in .env file');
    process.exit(1);
}

console.log('Testing Face++ API with credentials:');
console.log('API Key:', apiKey);
console.log('API Secret:', apiSecret);

async function testFacePPAPI() {
    try {
        // Create a simple test image (100x100 pixels, white background)
        const imageBuffer = await sharp({
            create: {
                width: 100,
                height: 100,
                channels: 3,
                background: { r: 255, g: 255, b: 255 }
            }
        })
        .jpeg()
        .toBuffer();

        console.log('Test image created, size:', imageBuffer.length, 'bytes');

        // Create form data
        const formData = new FormData();
        formData.append('api_key', apiKey);
        formData.append('api_secret', apiSecret);
        formData.append('image_file', imageBuffer, {
            filename: 'test.jpg',
            contentType: 'image/jpeg'
        });

        console.log('Sending test request to Face++ API...');

        // Send request to Face++ API
        const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/face/analyze', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        console.log('API Response:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('API Error Details:', error.response.data);
        }
    }
}

testFacePPAPI(); 