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

  const handleAnalyze = async () => {
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
      let fileType = fileTypePart === 'jpg' ? 'jpeg' : fileTypePart; // Normalize jpg to jpeg
      const mimeType = `image/${fileType}`;

      // Log file details for debugging
      console.log('File processing details:', {
        originalBase64Header: selectedImage.split(';')[0],
        processedMimeType: mimeType,
        processedFileType: fileType
      });
      
      // Create Blob with normalized MIME type
      const blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType });

      // Verify Blob creation
      if (blob.size === 0) {
        throw new Error('Failed to create valid file blob');
      }

      const formData = new FormData();
      formData.append('image', blob, `skin-image.${fileType}`);

      // First check if backend is available
      const healthCheck = await fetch('http://127.0.0.1:3001/health');
      if (!healthCheck.ok) {
        throw new Error('Backend server is not available. Please make sure the server is running.');
      }

      // Make the API call
      const response = await fetch('http://127.0.0.1:3001/api/analyze-skin', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image. Please try again with a different image.');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || 'Error analyzing skin. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
                    Natural Skin Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-herb">
                      Skin Type
                    </h3>
                    <p className="text-gray-300">{analysisResult.skinType}</p>
                    
                    {analysisResult.specialFeatures && analysisResult.specialFeatures.length > 0 && (
                      <p className="text-gray-300 mt-1">
                        <span className="font-medium">Special Features:</span> {analysisResult.specialFeatures.join(', ')}
                      </p>
                    )}
                  </div>
                  
                  {analysisResult.concerns.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-herb">
                        Areas to Address
                      </h3>
                      <ul className="list-disc list-inside text-gray-300">
                        {analysisResult.concerns.map((concern) => (
                          <li key={concern}>{concern}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-herb">
                        Skin Analysis
                      </h3>
                      <p className="text-gray-300">Your skin appears healthy with no significant concerns.</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-herb">
                      Recommended Medicinal Plants
                    </h3>
                    {analysisResult.recommendations.plants.map((rec) => (
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
                    {analysisResult.recommendations.homeRemedies.map((rec) => (
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
