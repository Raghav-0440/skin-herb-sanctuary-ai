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
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysisResult({
        skinType: "Combination",
        concerns: ["Acne", "Hyperpigmentation"],
        recommendations: [
          "Use gentle cleansers",
          "Apply non-comedogenic moisturizers",
          "Consider using products with salicylic acid",
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
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
                      onClick={() => setSelectedImage(null)}
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

            {analysisResult && (
              <div className="mt-8 bg-[#222] rounded-xl p-8 border border-[#333]">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Analysis Results
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
                    <ul className="list-disc list-inside text-gray-300">
                      {analysisResult.concerns.map((concern: string) => (
                        <li key={concern}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-herb">
                      Recommendations
                    </h3>
                    <ul className="list-disc list-inside text-gray-300">
                      {analysisResult.recommendations.map(
                        (recommendation: string) => (
                          <li key={recommendation}>{recommendation}</li>
                        )
                      )}
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
