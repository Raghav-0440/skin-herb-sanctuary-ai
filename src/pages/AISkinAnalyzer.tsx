import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Camera, Upload, Scan, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
const AISkinAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file (JPG/PNG only).",
        variant: "destructive",
      });
      return;
    }
  
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 2MB.",
        variant: "destructive",
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const response = await fetch('http://localhost:3001/api/analyze-skin', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }
  
      const data = await response.json();
      console.log('Skin analysis result:', data);
      // Display results to the user
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  async function handleAnalyze() {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      // Convert base64 to blob
      const base64Data = selectedImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }

      // Get and normalize file type
      const fileTypePart = selectedImage.split(';')[0].split('/')[1].toLowerCase();
      let fileType = fileTypePart === 'jpg' ? 'jpeg' : fileTypePart;
      const mimeType = `image/${fileType}`;

      // Create Blob with normalized MIME type
      const blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType });

      const formData = new FormData();
      formData.append('image', blob, `skin-image.${fileType}`);

      // Make the API call to submit the image
      const response = await fetch('http://localhost:3001/api/analyze-skin', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const data = await response.json();
      console.log('Raw analysis result:', data);
      
      // Format the response data to match the expected structure
      const formattedResult = {
        predicted_class: data.result.predicted_class || data.predicted_class,
        confidence: data.result.confidence || data.confidence,
        top3_predictions: data.result.top3_predictions || data.top3_predictions || [
          { class: data.result.predicted_class || data.predicted_class, probability: data.result.confidence || data.confidence }
        ]
      };
      
      console.log('Formatted result:', formattedResult);
      setAnalysisResult(formattedResult);
      setIsAnalyzing(false);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || 'Error analyzing skin. Please try again.',
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  }

  // Function to poll for results
  const pollForResults = async (requestId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds max wait time
    
    const pollInterval = setInterval(async () => {
      try {
        attempts++;
        console.log(`Polling for results (attempt ${attempts}/${maxAttempts})...`);
        
        const response = await fetch(`http://127.0.0.1:3001/api/analysis-result/${requestId}`);
        
        if (!response.ok) {
          throw new Error('Failed to get analysis results');
        }
        
        const data = await response.json();
        console.log('Poll response:', data);
        
        if (data.status === 'success') {
          // We got a successful result
          clearInterval(pollInterval);
          setAnalysisResult(data);
          setIsAnalyzing(false);
        } else if (data.status === 'error') {
          // We got an error
          clearInterval(pollInterval);
          setError(data.error || 'Error analyzing skin');
          toast({
            title: "Error",
            description: data.error || 'Error analyzing skin. Please try again.',
            variant: "destructive",
          });
          setIsAnalyzing(false);
        } else if (attempts >= maxAttempts) {
          // We've reached the maximum number of attempts
          clearInterval(pollInterval);
          setError('Analysis timed out. Please try again.');
          toast({
            title: "Timeout",
            description: 'Analysis timed out. Please try again.',
            variant: "destructive",
          });
          setIsAnalyzing(false);
        }
        // If status is 'pending' or 'processing', continue polling
      } catch (error) {
        console.error('Error polling for results:', error);
        clearInterval(pollInterval);
        setError('Error checking analysis results. Please try again.');
        toast({
          title: "Error",
          description: 'Error checking analysis results. Please try again.',
          variant: "destructive",
        });
        setIsAnalyzing(false);
      }
    }, 2000); // Poll every 2 seconds
  };

  const get_recommendations = (condition: string) => {
    const recommendations = {
      'Acne': {
        plants: [
          { plant: 'Tea Tree', benefit: 'Natural antiseptic properties help reduce inflammation and bacteria' },
          { plant: 'Aloe Vera', benefit: 'Soothes inflammation and promotes healing' },
          { plant: 'Neem', benefit: 'Antibacterial and anti-inflammatory properties' }
        ],
        homeRemedies: [
          { remedy: 'Honey Mask', benefit: 'Natural antibacterial properties help fight acne' },
          { remedy: 'Green Tea Compress', benefit: 'Reduces inflammation and soothes skin' },
          { remedy: 'Apple Cider Vinegar', benefit: 'Helps balance skin pH and reduce bacteria' }
        ]
      },
      'Eczema': {
        plants: [
          { plant: 'Chamomile', benefit: 'Calming properties help reduce inflammation' },
          { plant: 'Oatmeal', benefit: 'Soothes itching and irritation' },
          { plant: 'Calendula', benefit: 'Anti-inflammatory and healing properties' }
        ],
        homeRemedies: [
          { remedy: 'Coconut Oil', benefit: 'Natural moisturizer with anti-inflammatory properties' },
          { remedy: 'Oatmeal Bath', benefit: 'Soothes itching and irritation' },
          { remedy: 'Aloe Vera Gel', benefit: 'Cooling and healing properties' }
        ]
      },
      'Rosacea': {
        plants: [
          { plant: 'Green Tea', benefit: 'Anti-inflammatory properties help reduce redness' },
          { plant: 'Chamomile', benefit: 'Calming properties help reduce inflammation' },
          { plant: 'Licorice Root', benefit: 'Helps reduce redness and inflammation' }
        ],
        homeRemedies: [
          { remedy: 'Green Tea Compress', benefit: 'Reduces inflammation and redness' },
          { remedy: 'Honey Mask', benefit: 'Natural anti-inflammatory properties' },
          { remedy: 'Aloe Vera Gel', benefit: 'Cooling and soothing properties' }
        ]
      },
      'Keratosis': {
        plants: [
          { plant: 'Tea Tree Oil', benefit: 'Natural exfoliating properties' },
          { plant: 'Apple Cider Vinegar', benefit: 'Helps soften and remove keratosis' },
          { plant: 'Aloe Vera', benefit: 'Promotes skin healing and regeneration' }
        ],
        homeRemedies: [
          { remedy: 'Apple Cider Vinegar', benefit: 'Natural exfoliant that helps remove keratosis' },
          { remedy: 'Coconut Oil', benefit: 'Moisturizes and softens skin' },
          { remedy: 'Salicylic Acid', benefit: 'Helps remove keratosis gently' }
        ]
      },
      'Milia': {
        plants: [
          { plant: 'Tea Tree Oil', benefit: 'Natural astringent properties' },
          { plant: 'Witch Hazel', benefit: 'Helps tighten pores and reduce milia' },
          { plant: 'Aloe Vera', benefit: 'Promotes skin healing' }
        ],
        homeRemedies: [
          { remedy: 'Steam Treatment', benefit: 'Opens pores and helps remove milia' },
          { remedy: 'Honey Mask', benefit: 'Natural exfoliant and antibacterial properties' },
          { remedy: 'Retinol', benefit: 'Promotes skin cell turnover' }
        ]
      },
      'Carcinoma': {
        plants: [
          { plant: 'Green Tea', benefit: 'Antioxidant properties may help protect skin' },
          { plant: 'Turmeric', benefit: 'Anti-inflammatory properties' },
          { plant: 'Aloe Vera', benefit: 'Promotes skin healing' }
        ],
        homeRemedies: [
          { remedy: 'Regular Skin Checks', benefit: 'Early detection is crucial' },
          { remedy: 'Sun Protection', benefit: 'Use SPF and protective clothing' },
          { remedy: 'Consult Dermatologist', benefit: 'Professional medical advice is essential' }
        ]
      }
    };

    return recommendations[condition] || {
      plants: [
        { plant: 'Aloe Vera', benefit: 'General skin healing and soothing properties' },
        { plant: 'Green Tea', benefit: 'Antioxidant properties for skin health' },
        { plant: 'Chamomile', benefit: 'Calming and anti-inflammatory properties' }
      ],
      homeRemedies: [
        { remedy: 'Regular Moisturizing', benefit: 'Maintains skin health' },
        { remedy: 'Sun Protection', benefit: 'Prevents skin damage' },
        { remedy: 'Healthy Diet', benefit: 'Supports skin health from within' }
      ]
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 section-spacing pt-24">
        <div className="container-width">
          <div className="text-center mb-16">
            <h1 className="section-title">
              AI <span className="text-herb">Skin Analyzer</span>
            </h1>
            <p className="section-description">
              Upload a photo of your skin to get personalized herbal recommendations
              and treatment suggestions.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-[#222] rounded-xl p-8 border border-[#333]">
              {!selectedImage ? (
                <div className="text-center">
                  <div className="mb-6">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-block"
                    >
                      <div className="w-32 h-32 mx-auto bg-[#333] rounded-full flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-herb transition-colors">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <p className="text-gray-400 mb-4">
                    Upload a clear photo of your skin
                  </p>
                  <button className="herb-button-outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </button>
                </div>
              ) : (
                <div>
                  <div className="relative mb-6">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setAnalysisResult(null);
                        setError(null);
                      }}
                      className="absolute top-2 right-2 bg-[#333] p-2 rounded-full hover:bg-[#444] transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <button
                    className="herb-button w-full"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Skin"}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-8 bg-red-900/20 rounded-xl p-8 border border-red-900/50">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Error</h2>
                </div>
                <p className="mt-2 text-red-300">{error}</p>
              </div>
            )}

            {analysisResult && !error && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">
                    Skin Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-herb">
                      Predicted Condition
                    </h3>
                    <p className="text-gray-300">{analysisResult.predicted_class}</p>
                    <p className="text-gray-300">Confidence: {(analysisResult.confidence * 100).toFixed(2)}%</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-herb">
                      Top Predictions
                    </h3>
                    <ul className="list-disc list-inside text-gray-300">
                      {analysisResult.top3_predictions.map((pred, index) => (
                        <li key={index}>
                          {pred.class}: {(pred.probability * 100).toFixed(2)}%
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-herb">
                      Recommended Medicinal Plants
                    </h3>
                    {get_recommendations(analysisResult.predicted_class).plants.map((rec) => (
                      <div key={rec.plant} className="mb-2">
                        <p className="font-medium text-gray-200">{rec.plant}</p>
                        <p className="text-gray-300">{rec.benefit}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-herb">
                      Recommended Home Remedies
                    </h3>
                    {get_recommendations(analysisResult.predicted_class).homeRemedies.map((rec) => (
                      <div key={rec.remedy} className="mb-2">
                        <p className="font-medium text-gray-200">{rec.remedy}</p>
                        <p className="text-gray-300">{rec.benefit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AISkinAnalyzer;
