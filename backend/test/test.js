const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testSkinAnalysis() {
    try {
        // Create form data
        const form = new FormData();
        form.append('image', fs.createReadStream(path.join(__dirname, 'test-image.jpg')));

        // Make the request
        const response = await axios.post('http://localhost:3000/api/skin-analysis', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Skin Analysis Results:', response.data);
    } catch (error) {
        console.error('Error testing skin analysis:', error.response?.data || error.message);
    }
}

testSkinAnalysis(); 