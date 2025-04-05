
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Camera, Upload, Scan, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AISkinAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [results, setResults] = useState<null | {
    issues: Array<{
      type: string;
      severity: "mild" | "moderate" | "severe";
      description: string;
      recommendation: string;
    }>;
  }>(null);
  const { toast } = useToast();

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 } 
        } 
      });
      
      const videoElement = document.getElementById('camera-preview') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
      }
      
      setHasCamera(true);
      toast({
        title: "Camera accessed successfully",
        description: "Position your face in the frame for analysis",
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera access to use the skin analyzer",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload processing here
      toast({
        title: "Image uploaded",
        description: "Your image is ready for analysis",
      });
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      // Mock results - in a real app, these would come from an AI model
      setResults({
        issues: [
          {
            type: "Acne",
            severity: "moderate",
            description: "Inflammatory acne detected on the T-zone area",
            recommendation: "Consider using products with salicylic acid or benzoyl peroxide. Check our recommended herbs like Tea Tree and Neem."
          },
          {
            type: "Dryness",
            severity: "mild",
            description: "Mild skin dryness detected on the cheek area",
            recommendation: "Increase hydration with aloe vera or hyaluronic acid serums. Consider Aloe Vera and Calendula from our herbal collection."
          }
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const resetAnalysis = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">
              AI Skin <span className="text-herb">Analyzer</span>
            </h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Our advanced AI technology analyzes your skin in real-time, detecting common skin concerns
              and suggesting natural herbal remedies tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left side - Camera/Upload Section */}
            <div className="lg:col-span-3">
              <Card className="bg-[#222] border-[#333] shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Skin Analysis</CardTitle>
                  <CardDescription>Scan your skin for personalized recommendations</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  {!hasCamera ? (
                    <div className="h-[400px] flex items-center justify-center bg-[#1a1a1a] rounded-lg w-full">
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-herb mb-4 mx-auto" />
                        <p className="text-gray-300 mb-4">Allow camera access to begin skin analysis</p>
                        <Button onClick={handleCameraAccess} variant="default" className="bg-herb hover:bg-herb-dark text-herb-foreground mr-4">
                          <Camera className="mr-2 h-4 w-4" />
                          Access Camera
                        </Button>
                        <label className="cursor-pointer bg-[#333] hover:bg-[#444] text-white font-medium px-4 py-2 rounded-full transition-colors duration-300 ease-in-out inline-flex items-center">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <video
                        id="camera-preview"
                        autoPlay
                        playsInline
                        className="w-full h-[400px] object-cover rounded-lg"
                      ></video>
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <div className="text-center">
                            <Scan className="h-12 w-12 text-herb mb-4 mx-auto animate-pulse" />
                            <p className="text-white">Analyzing your skin...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center">
                  {hasCamera && !isAnalyzing && !results && (
                    <Button 
                      onClick={startAnalysis} 
                      className="bg-herb hover:bg-herb-dark text-herb-foreground"
                    >
                      <Scan className="mr-2 h-4 w-4" />
                      Analyze Skin
                    </Button>
                  )}
                  {results && (
                    <Button 
                      onClick={resetAnalysis} 
                      variant="outline"
                      className="border-herb text-herb hover:bg-herb hover:text-herb-foreground"
                    >
                      Start New Analysis
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            {/* Right side - Results/Information Section */}
            <div className="lg:col-span-2">
              <Card className="bg-[#222] border-[#333] h-full">
                <CardHeader>
                  <CardTitle className="text-white">
                    {results ? "Analysis Results" : "How It Works"}
                  </CardTitle>
                  <CardDescription>
                    {results 
                      ? "Based on your skin's condition" 
                      : "Our AI analyzes multiple factors of your skin"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!results ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-herb-dark/20 p-2 rounded-full">
                          <Camera className="h-5 w-5 text-herb" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Capture</h3>
                          <p className="text-gray-400 text-sm">
                            Position your face within the frame or upload a clear image of your skin
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-herb-dark/20 p-2 rounded-full">
                          <Scan className="h-5 w-5 text-herb" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Analyze</h3>
                          <p className="text-gray-400 text-sm">
                            Our AI examines your skin for common concerns like acne, dryness, dark spots and more
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-herb-dark/20 p-2 rounded-full">
                          <AlertCircle className="h-5 w-5 text-herb" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Recommend</h3>
                          <p className="text-gray-400 text-sm">
                            Get personalized herbal remedy suggestions based on your skin's specific needs
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                        <p className="text-amber-300 text-sm mb-2">Important Note:</p>
                        <p className="text-gray-400 text-xs">
                          This analyzer is designed for educational purposes only and does not replace professional medical advice. 
                          Please consult a dermatologist for serious skin conditions.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.issues.map((issue, index) => (
                        <div key={index} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-white">{issue.type}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${
                              issue.severity === 'mild' ? 'bg-yellow-500/20 text-yellow-300' :
                              issue.severity === 'moderate' ? 'bg-orange-500/20 text-orange-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{issue.description}</p>
                          <div className="bg-herb-dark/10 p-3 rounded border border-herb-dark/20">
                            <p className="text-herb text-sm">{issue.recommendation}</p>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-center mt-4">
                        <Button variant="outline" className="border-herb text-herb hover:bg-herb hover:text-herb-foreground mr-2">
                          View Recommended Herbs
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AISkinAnalyzer;
