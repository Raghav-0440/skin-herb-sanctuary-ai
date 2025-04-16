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
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null); // Clear previous results
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      const blob = await fetch(selectedImage!).then(r => r.blob());
      formData.append('image', blob, 'face.jpg');

      const response = await fetch('http://localhost:3001/api/analyze-skin', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze skin');
      }

      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Your skin analysis results are ready!",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze skin. Please try again.",
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
            <p className="section-description max-w-2xl mx-auto">
              Get personalized skincare recommendations based on AI analysis. For best results:
              <br />
              • Upload a clear, well-lit photo of your face
              <br />
              • Ensure your face is clearly visible and centered
              <br />
              • Avoid heavy makeup or filters
              <br />
              • Maximum file size: 5MB
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
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-[#333] p-2 rounded-full hover:bg-[#444] transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <button
                    className={`herb-button w-full ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center">
                        <Scan className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing your skin...
                      </div>
                    ) : (
                      "Analyze Skin"
                    )}
                  </button>
                </div>
              )}
            </div>

            {analysisResult && (
              <div className="mt-8 bg-[#222] rounded-xl p-8 border border-[#333]">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                  Analysis Results
                  <span className="ml-2 text-herb">✓</span>
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-herb">
                      Skin Type
                    </h3>
                    <p className="text-gray-300">{analysisResult.skinType}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-herb">
                      Concerns
                    </h3>
                    {Array.isArray(analysisResult.concerns) ? (
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        {analysisResult.concerns.map((concern, index) => (
                          <li key={index}>{concern}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300">No concerns detected</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-herb">
                      Herbal Recommendations
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AISkinAnalyzer;
