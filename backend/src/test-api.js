const axios = require('axios');
require('dotenv').config();

async function testFacePPAPI() {
    try {
        console.log('🔍 Testing Face++ API Integration...');
        
        // Get API credentials
        const apiKey = process.env.FACEPP_API_KEY;
        const apiSecret = process.env.FACEPP_API_SECRET;
        
        if (!apiKey || !apiSecret) {
            console.error('❌ Missing API credentials in .env file');
            return;
        }
        
        console.log('🔑 Using API Key:', apiKey);
        console.log('🔒 Using API Secret:', apiSecret);
        
        // Create request parameters
        const params = new URLSearchParams();
        params.append('api_key', apiKey);
        params.append('api_secret', apiSecret);
        params.append('image_url', 'https://raw.githubusercontent.com/ShiqiYu/facenet/master/sample/sample1.jpg');
        params.append('return_attributes', 'gender,age,skinstatus');
        
        console.log('🚀 Sending test request to Face++ API...');
        
        // Make API request
        const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        if (response.data.faces && response.data.faces.length > 0) {
            console.log('✅ Face detected successfully!');
            console.log('Face attributes:', response.data.faces[0].attributes);
        } else {
            console.log('⚠️ No face detected in the image');
        }
        
    } catch (error) {
        console.error('❌ Error testing Face++ API:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            
            // Handle specific error cases
            if (error.response.status === 400) {
                console.error('❌ Bad Request: Check image format and parameters');
                console.error('Error message:', error.response.data.error_message);
            } else if (error.response.status === 401) {
                console.error('❌ Unauthorized: Check API credentials');
                console.error('Please verify your API key and secret are correct');
                console.error('Current API Key:', process.env.FACEPP_API_KEY);
                console.error('Current API Secret:', process.env.FACEPP_API_SECRET);
            } else if (error.response.status === 429) {
                console.error('❌ Rate Limit Exceeded: Try again later');
            }
        } else if (error.request) {
            console.error('❌ No response received from API');
            console.error('Please check your internet connection');
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Run the test
testFacePPAPI(); 