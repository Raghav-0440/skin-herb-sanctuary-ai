const axios = require('axios');
const formidable = require('formidable');
const fs = require('fs');

const analyzeSkin = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Error parsing form data' });
      }

      if (!files.image) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const imagePath = files.image.filepath;
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      // Call Face++ API
      const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', {
        api_key: process.env.FACEPP_API_KEY,
        api_secret: process.env.FACEPP_API_SECRET,
        image_base64: base64Image,
        return_attributes: 'skinstatus'
      });

      // Process the response
      const faceData = response.data.faces[0];
      if (!faceData) {
        return res.status(400).json({ error: 'No face detected in the image' });
      }

      const skinStatus = faceData.attributes.skinstatus;
      
      // Format the response
      const analysisResult = {
        skinType: determineSkinType(skinStatus),
        concerns: identifyConcerns(skinStatus),
        recommendations: generateRecommendations(skinStatus)
      };

      res.json(analysisResult);
    });
  } catch (error) {
    console.error('Error analyzing skin:', error);
    res.status(500).json({ error: 'Error analyzing skin' });
  }
};

const determineSkinType = (skinStatus) => {
  const oiliness = skinStatus.oiliness;
  const darkCircle = skinStatus.dark_circle;
  
  if (oiliness > 0.7) return 'Oily';
  if (oiliness < 0.3) return 'Dry';
  return 'Combination';
};

const identifyConcerns = (skinStatus) => {
  const concerns = [];
  
  if (skinStatus.dark_circle > 0.5) concerns.push('Dark Circles');
  if (skinStatus.stain > 0.5) concerns.push('Hyperpigmentation');
  if (skinStatus.acne > 0.5) concerns.push('Acne');
  if (skinStatus.health > 0.7) concerns.push('Healthy Skin');
  
  return concerns;
};

const generateRecommendations = (skinStatus) => {
  const recommendations = [];
  
  if (skinStatus.dark_circle > 0.5) {
    recommendations.push('Use cucumber slices or cold tea bags to reduce dark circles');
    recommendations.push('Apply aloe vera gel before bedtime');
  }
  
  if (skinStatus.stain > 0.5) {
    recommendations.push('Use turmeric and honey mask twice a week');
    recommendations.push('Apply lemon juice diluted with water for brightening');
  }
  
  if (skinStatus.acne > 0.5) {
    recommendations.push('Apply neem paste on affected areas');
    recommendations.push('Use tea tree oil diluted with coconut oil');
  }
  
  if (skinStatus.health > 0.7) {
    recommendations.push('Maintain your current skincare routine');
    recommendations.push('Use rose water as a natural toner');
  }
  
  return recommendations;
};

module.exports = {
  analyzeSkin
}; 