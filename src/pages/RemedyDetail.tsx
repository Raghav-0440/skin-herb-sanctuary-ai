
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, Clock, Star, CheckCircle, Info, Printer, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Expanded mock data for home remedies
const remediesDetailData = [
  {
    id: "1",
    title: "Aloe Vera & Honey Face Mask",
    description: "This gentle, soothing face mask combines the healing properties of aloe vera with the antibacterial and humectant qualities of honey. Perfect for dry, irritated, or sunburned skin.",
    image: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?q=80&w=2070&auto=format&fit=crop",
    difficulty: "easy",
    time: "10 min",
    rating: 4.8,
    ingredients: [
      "2 tablespoons fresh Aloe Vera gel (straight from the plant or pure store-bought)",
      "1 tablespoon raw honey",
      "3 drops Vitamin E oil (optional, for added moisture)",
    ],
    instructions: [
      "In a small bowl, combine the aloe vera gel and raw honey. Mix well until smooth.",
      "If using, add the Vitamin E oil and stir to incorporate.",
      "Cleanse your face thoroughly before applying the mask.",
      "Using clean fingers or a brush, apply an even layer of the mask to your face, avoiding the eye area.",
      "Leave on for 15-20 minutes.",
      "Rinse off with lukewarm water and pat your skin dry.",
      "Follow with your regular moisturizer."
    ],
    benefits: [
      "Aloe vera soothes inflammation and redness",
      "Honey provides deep hydration and has antibacterial properties",
      "Vitamin E helps repair damaged skin cells",
      "Suitable for sensitive skin types",
      "Helps heal sunburn and minor skin irritations"
    ],
    tips: [
      "Use this mask 1-2 times per week for best results",
      "If using aloe directly from a plant, refrigerate the mixture for a cooling effect",
      "For extra hydration, use this mask before bedtime and leave a thin layer overnight",
      "Test on a small patch of skin before applying to your entire face if you have sensitive skin"
    ],
    tags: ["dry skin", "soothing", "hydrating", "sensitive skin"],
    relatedRemedies: ["2", "6"],
  },
  {
    id: "2",
    title: "Turmeric & Yogurt Brightening Mask",
    description: "An ancient remedy for brightening the skin, reducing hyperpigmentation, and fighting acne. The lactic acid in yogurt gently exfoliates while turmeric reduces inflammation and evens skin tone.",
    image: "https://images.unsplash.com/photo-1615485500780-211fa193a804?q=80&w=2070&auto=format&fit=crop",
    difficulty: "easy",
    time: "15 min",
    rating: 4.6,
    ingredients: [
      "1 tablespoon plain Greek yogurt",
      "1/4 teaspoon turmeric powder",
      "1/2 teaspoon honey",
      "2-3 drops lemon juice (optional, for extra brightening)"
    ],
    instructions: [
      "In a small bowl, combine all ingredients and mix until you have a smooth paste.",
      "Cleanse your face before application.",
      "Apply an even layer to your face, avoiding the eye area.",
      "Leave on for 10-15 minutes. Note: Turmeric can temporarily stain the skin yellow, so don't leave it on too long.",
      "Rinse thoroughly with warm water, using gentle circular motions to get the exfoliating benefit.",
      "Follow with toner and moisturizer."
    ],
    benefits: [
      "Turmeric has anti-inflammatory and antioxidant properties",
      "Yogurt contains lactic acid that gently exfoliates",
      "Helps brighten skin tone and reduce dark spots",
      "Can help reduce acne and prevent breakouts",
      "Honey adds antibacterial and hydrating properties"
    ],
    tips: [
      "Start with less turmeric if you're concerned about staining",
      "Use this mask once a week initially, then increase to twice weekly if your skin responds well",
      "If you get any yellow staining, use a gentle cleanser or toner to remove it",
      "For acne-prone skin, increase the turmeric slightly and add a drop of tea tree oil"
    ],
    tags: ["brightening", "dark spots", "anti-inflammatory", "acne"],
    relatedRemedies: ["3", "5"],
  },
  // Additional remedies data would be expanded similarly
];

const RemedyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [remedy, setRemedy] = useState<any>(null);
  const [relatedRemedies, setRelatedRemedies] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Find the selected remedy based on ID from URL
    const selectedRemedy = remediesDetailData.find(r => r.id === id);
    setRemedy(selectedRemedy);

    // Find related remedies if any
    if (selectedRemedy?.relatedRemedies?.length) {
      const related = remediesDetailData.filter(r => 
        selectedRemedy.relatedRemedies.includes(r.id)
      );
      setRelatedRemedies(related);
    }
  }, [id]);

  const handleBookmark = () => {
    toast({
      title: "Recipe saved",
      description: "This remedy has been added to your saved items.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: remedy?.title,
        text: remedy?.description,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Remedy link copied to clipboard",
      });
    }
  };

  if (!remedy) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Loading remedy...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              to="/remedies" 
              className="text-herb hover:underline inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Remedies
            </Link>
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="rounded-xl overflow-hidden h-80">
              <img 
                src={remedy.image} 
                alt={remedy.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{remedy.title}</h1>
              <p className="text-gray-300 mb-6">{remedy.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-[#222] px-4 py-2 rounded-lg border border-[#333] flex items-center">
                  <Clock className="h-4 w-4 text-herb mr-2" />
                  <span className="text-white">{remedy.time} prep</span>
                </div>
                
                <div className="bg-[#222] px-4 py-2 rounded-lg border border-[#333] flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-white">{remedy.rating} rating</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {remedy.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="bg-[#1a1a1a] text-gray-300 text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handlePrint} className="border-[#333] hover:bg-[#333] text-white">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={handleShare} className="border-[#333] hover:bg-[#333] text-white">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button onClick={handleBookmark} className="bg-herb hover:bg-herb-dark text-herb-foreground">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save Recipe
                </Button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-[#222] border-[#333] mb-6">
                <CardContent className="p-5">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Info className="h-5 w-5 text-herb mr-2" /> 
                    Ingredients
                  </h2>
                  <ul className="space-y-3">
                    {remedy.ingredients.map((ingredient: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <div className="h-5 w-5 rounded-full bg-herb/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-herb text-xs">•</span>
                        </div>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-[#222] border-[#333]">
                <CardContent className="p-5">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Info className="h-5 w-5 text-herb mr-2" />
                    Benefits
                  </h2>
                  <ul className="space-y-3">
                    {remedy.benefits.map((benefit: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="h-4 w-4 text-herb flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="bg-[#222] border-[#333] mb-8">
                <CardContent className="p-5">
                  <h2 className="text-2xl font-semibold text-white mb-6">Instructions</h2>
                  <ol className="space-y-5">
                    {remedy.instructions.map((instruction: string, i: number) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-herb flex items-center justify-center flex-shrink-0">
                          <span className="text-herb-foreground font-semibold">{i + 1}</span>
                        </div>
                        <div className="pt-1">
                          <p className="text-gray-300">{instruction}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
              
              <Card className="bg-[#222] border-[#333] mb-8">
                <CardContent className="p-5">
                  <h2 className="text-xl font-semibold text-white mb-4">Tips for Best Results</h2>
                  <ul className="space-y-3">
                    {remedy.tips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <div className="h-5 w-5 rounded-full bg-herb/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-herb text-xs">✓</span>
                        </div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Related Remedies Section */}
              {relatedRemedies.length > 0 && (
                <>
                  <Separator className="my-8 bg-[#333]" />
                  <h2 className="text-2xl font-semibold text-white mb-6">You Might Also Like</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedRemedies.map(related => (
                      <Link
                        key={related.id}
                        to={`/remedies/${related.id}`}
                        className="transition-transform hover:scale-[1.02] focus:outline-none"
                      >
                        <Card className="bg-[#222] border-[#333] overflow-hidden h-full">
                          <div className="h-36 overflow-hidden">
                            <img
                              src={related.image}
                              alt={related.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {related.title}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2">
                              {related.description}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RemedyDetail;
