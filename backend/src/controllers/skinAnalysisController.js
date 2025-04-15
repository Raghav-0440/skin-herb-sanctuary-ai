const axios = require('axios');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const os = require('os');

// Face++ API credentials
const FACEPP_API_KEY = 'VcIBXtOIMJQw_klqejOmRwxCcvD79HVi';
const FACEPP_API_SECRET = '4CLhLB_ox3ZKkFPnDXMd_65ys-ERnIFl';

// Helper function to analyze face attributes
const analyzeFaceAttributes = (faceData) => {
  console.log('Raw Face++ data:', JSON.stringify(faceData.skinstatus));
  
  if (!faceData.skinstatus) {
    console.error('Missing skinstatus data from Face++ API');
    return {
      error: 'Incomplete analysis data received'
    };
  }
  
  return {
    skinStatus: faceData.skinstatus,
    gender: faceData.gender.value,
    age: faceData.age.value
  };
};

// Enhanced freckle detection
const isFrecklePattern = (skinStatus) => {
  const hasScatteredPattern = skinStatus.stain_distribution === 'scattered';
  const hasEvenDistribution = skinStatus.stain_evenness > 0.6;
  const hasManySmallSpots = skinStatus.stain_count > 10 && skinStatus.stain_size < 0.3;
  
  return (hasScatteredPattern || hasManySmallSpots) && hasEvenDistribution;
};

// Improved skin type determination
const determineSkinType = (skinStatus) => {
  const oiliness = skinStatus.oiliness || 0.5;
  const stain = skinStatus.stain || 0.3;
  const health = skinStatus.health || 0.5;
  
  const hasFreckles = stain > 0.4 && isFrecklePattern(skinStatus);
  
  let skinType;
  
  if (oiliness > 0.7) {
    skinType = 'Oily';
  } else if (oiliness < 0.3) {
    skinType = 'Dry';
  } else if (health > 0.7) {
    skinType = 'Normal';
  } else {
    skinType = 'Combination';
  }
  
  if (hasFreckles) {
    return `${skinType} with Natural Freckles`;
  } else if (stain > 0.5) {
    return `${skinType} with Pigmentation`;
  }
  
  return skinType;
};

// Enhanced concern identification
const identifyConcerns = (skinStatus) => {
  const concerns = [];
  
  if (skinStatus.stain > 0.4 && isFrecklePattern(skinStatus)) {
    console.log('Detected natural freckles');
  } else if (skinStatus.stain > 0.5) {
    concerns.push('Hyperpigmentation');
  }
  
  if (skinStatus.dark_circle > 0.6) {
    concerns.push('Dark Circles');
  } else if (skinStatus.dark_circle > 0.4 && skinStatus.dark_circle <= 0.6) {
    if (Math.random() > 0.5) {
      concerns.push('Mild Dark Circles');
    }
  }
  
  if (skinStatus.acne > 0.6) {
    concerns.push('Acne');
  } else if (skinStatus.acne > 0.3 && skinStatus.acne <= 0.6) {
    if (Math.random() > 0.5) {
      concerns.push('Mild Acne');
    }
  }
  
  if (skinStatus.oiliness > 0.7) concerns.push('Excess Oil');
  if (skinStatus.oiliness < 0.3) concerns.push('Dryness');
  
  return concerns;
};

// Dynamic plant recommendations
const getPlantRecommendations = (concerns) => {
  const allRecommendations = {
    'Hyperpigmentation': [
      { plant: 'Indian Madder', benefit: 'Inhibits melanin production to lighten hyperpigmentation and even skin tone' },
      { plant: 'Turmeric', benefit: 'Reduces pigmentation and brightens skin tone' },
      { plant: 'Sandalwood', benefit: 'Naturally lightens skin and reduces dark spots' }
    ],
    'Dark Circles': [
      { plant: 'Holy Basil', benefit: 'Improves circulation and reduces undereye darkness' },
      { plant: 'Sacred Fig', benefit: 'Treats dark circles with regular application' }
    ],
    'Acne': [
      { plant: 'Neem', benefit: 'Contains antibacterial properties that fight acne-causing bacteria' },
      { plant: 'Holy Basil', benefit: 'Purifies skin and reduces inflammation associated with acne' },
      { plant: 'Mexican Poppy', benefit: 'Treats skin problems including acne and inflammation' }
    ],
    'Excess Oil': [
      { plant: 'Sandalwood', benefit: 'Controls excess sebum production and balances oily skin' },
      { plant: 'Nettles', benefit: 'Natural astringent that regulates oil production' }
    ],
    'Dryness': [
      { plant: 'Aloe Vera', benefit: 'Provides deep hydration and soothes dry skin' },
      { plant: 'Hemp Seed Oil', benefit: 'Rich in essential fatty acids that nourish dry skin' },
      { plant: 'Comfrey', benefit: 'Makes sensitive skin more resilient while counteracting dryness' }
    ],
    'default': [
      { plant: 'Aloe Vera', benefit: 'General skin health maintenance and hydration' },
      { plant: 'Gotu Kola', benefit: 'Maintains skin health and strengthens skin barrier' }
    ]
  };
  
  let recommendations = [];
  
  concerns.forEach(concern => {
    const options = allRecommendations[concern] || [];
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      recommendations.push(options[randomIndex]);
    }
  });
  
  if (recommendations.length === 0) {
    recommendations = allRecommendations.default;
  }
  
  while (recommendations.length < 2 && concerns.length > 0) {
    const randomConcern = concerns[Math.floor(Math.random() * concerns.length)];
    const options = allRecommendations[randomConcern] || [];
    if (options.length > 0) {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      if (!recommendations.some(r => r.plant === randomOption.plant)) {
        recommendations.push(randomOption);
      }
    }
  }
  
  return recommendations.slice(0, 3);
};

// Dynamic home remedy recommendations
const getHomeRemedyRecommendations = (concerns) => {
  const allRemedies = {
    'Hyperpigmentation': [
      { remedy: 'Turmeric and Milk Face Pack', benefit: 'Lightens dark spots and evens skin tone' },
      { remedy: 'Saffron and Honey Face Pack', benefit: 'Brightens complexion and reduces pigmentation' },
      { remedy: 'Papaya and Honey Face Pack', benefit: 'Natural exfoliant that reduces discoloration' }
    ],
    'Dark Circles': [
      { remedy: 'Cucumber and Mint Face Mask', benefit: 'Reduces puffiness and darkness around eyes' },
      { remedy: 'Aloe Vera Gel with Rose Water', benefit: 'Soothes and brightens the undereye area' }
    ],
    'Acne': [
      { remedy: 'Neem and Turmeric Face Pack', benefit: 'Fights bacteria and reduces inflammation' },
      { remedy: 'Green Tea and Honey Mask', benefit: 'Reduces sebum production and calms inflamed skin' }
    ],
    'Excess Oil': [
      { remedy: 'Turmeric and Gram Flour Face Pack', benefit: 'Absorbs excess oil and purifies skin' },
      { remedy: 'Rice Water Toner', benefit: 'Balances skin pH and controls oiliness' }
    ],
    'Dryness': [
      { remedy: 'Honey Aloe Face Mask', benefit: 'Provides intense hydration for dry skin' },
      { remedy: 'Oatmeal and Honey Face Mask', benefit: 'Gently exfoliates while deeply moisturizing' }
    ],
    'default': [
      { remedy: 'Rose Water and Aloe Vera Mask', benefit: 'Soothes and hydrates all skin types' },
      { remedy: 'Cucumber Face Mask', benefit: 'Refreshes and rejuvenates skin' }
    ]
  };
  
  let recommendations = [];
  
  concerns.forEach(concern => {
    const options = allRemedies[concern] || [];
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      recommendations.push(options[randomIndex]);
    }
  });
  
  if (recommendations.length === 0) {
    recommendations = allRemedies.default;
  }
  
  while (recommendations.length < 2 && concerns.length > 0) {
    const randomConcern = concerns[Math.floor(Math.random() * concerns.length)];
    const options = allRemedies[randomConcern] || [];
    if (options.length > 0) {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      if (!recommendations.some(r => r.remedy === randomOption.remedy)) {
        recommendations.push(randomOption);
      }
    }
  }
  
  return recommendations.slice(0, 2);
};

const analyzeSkin = async (req, res) => {
  try {
    const tempDir = os.tmpdir();
    try {
      fs.accessSync(tempDir, fs.constants.R_OK | fs.constants.W_OK);
      console.log('Temp directory permissions OK:', tempDir);
    } catch (err) {
      console.error('Temp directory permissions error:', err);
      return res.status(500).json({ error: 'Server storage configuration issue' });
    }

    const form = new formidable.IncomingForm({
      maxFileSize: 2 * 1024 * 1024,
      keepExtensions: true,
      multiples: false,
      maxFields: 1,
      uploadDir: tempDir,
      filename: (name, ext, part) => {
        return `${Date.now()}-${name}${ext}`;
      }
    });

    let uploadedFile = null;
    let formError = null;

    form
      .on('file', (name, file) => {
        console.log('File received:', {
          name: file.originalFilename,
          path: file.filepath,
          size: file.size
        });
        uploadedFile = file;
      })
      .on('error', (err) => {
        console.error('Upload error:', err);
        formError = err;
      });

    await new Promise((resolve) => {
      form.on('end', () => resolve());
    });

    if (formError) {
      return res.status(400).json({ error: 'Error processing upload' });
    }

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const normalizedPath = path.normalize(uploadedFile.filepath);
      console.log('Normalized file path:', normalizedPath);

      if (!fs.existsSync(normalizedPath)) {
        console.error('File not found at path:', normalizedPath);
        return res.status(400).json({ error: 'Failed to process uploaded file' });
      }

      console.log('Processing file:', {
        mimetype: uploadedFile.mimetype,
        originalFilename: uploadedFile.originalFilename,
        size: uploadedFile.size,
        path: normalizedPath
      });

      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const allowedExtensions = ['.jpg', '.jpeg', '.png'];
      const ext = path.extname(uploadedFile.originalFilename).toLowerCase();

      if (!allowedExtensions.includes(ext)) {
        console.log('Invalid file extension:', ext);
        return res.status(400).json({ error: 'Only JPG/PNG images allowed' });
      }

      if (!allowedMimeTypes.includes(uploadedFile.mimetype)) {
        console.log('Invalid MIME type:', uploadedFile.mimetype);
        return res.status(400).json({ error: 'Only JPG/PNG images allowed' });
      }

      if (uploadedFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ error: 'Max file size 2MB' });
      }

      const fileStream = fs.createReadStream(normalizedPath);
      fileStream.on('error', (err) => {
        console.error('File stream error:', err);
        return res.status(500).json({ error: 'File read failed' });
      });

      const formData = new FormData();
      formData.append('api_key', FACEPP_API_KEY);
      formData.append('api_secret', FACEPP_API_SECRET);
      formData.append('image_file', fileStream);
      formData.append('return_attributes', 'skinstatus,gender,age,beauty');

      const response = await axios.post(
        'https://api-us.faceplusplus.com/facepp/v3/detect',
        formData,
        { headers: formData.getHeaders() }
      );

      if (response.data.error_message) {
        throw new Error(response.data.error_message);
      }

      if (!response.data.faces || response.data.faces.length === 0) {
        return res.status(400).json({ error: 'No face detected in image' });
      }
      
      const faceData = response.data.faces[0].attributes;
      const processedData = analyzeFaceAttributes(faceData);
      
      if (processedData.error) {
        return res.status(400).json({ error: processedData.error });
      }
      
      const skinStatus = faceData.skinstatus;
      const skinType = determineSkinType(skinStatus);
      const concerns = identifyConcerns(skinStatus);
      
      const plantRecommendations = getPlantRecommendations(concerns);
      const remedyRecommendations = getHomeRemedyRecommendations(concerns);
      
      const hasFreckles = skinStatus.stain > 0.4 && isFrecklePattern(skinStatus);
      
      const analysisResult = {
        skinType: skinType,
        concerns: concerns,
        specialFeatures: hasFreckles ? ['Natural Freckles'] : [],
        recommendations: {
          plants: plantRecommendations,
          homeRemedies: remedyRecommendations
        },
        basicInfo: {
          gender: faceData.gender.value,
          age: faceData.age.value
        }
      };
      
      res.json(analysisResult);
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error.response?.data?.error_message || error.message;
      res.status(500).json({ error: `Analysis failed: ${errorMessage}` });
    } finally {
      if (uploadedFile?.filepath && fs.existsSync(uploadedFile.filepath)) {
        try {
          fs.unlinkSync(uploadedFile.filepath);
          console.log('Temporary file cleaned up successfully');
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  analyzeSkin
}; 