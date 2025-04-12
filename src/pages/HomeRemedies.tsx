import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Filter, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for home remedies
export const remediesData = [
  {
    id: "1",
    title: "Turmeric and Gram Flour Face Pack",
    description: "Brightens skin, removes tan, exfoliates dead cells, and prevents acne",
    image: "https://images.unsplash.com/photo-1584463623578-583f6a2e5b5d?q=80&w=600&auto=format&fit=crop",
    difficulty: "easy",
    time: "2 min",
    rating: 4.8,
    ingredients: ["2 teaspoons gram flour", "½ teaspoon turmeric powder", "½ teaspoon lemon juice", "water"],
    instructions: "Mix all ingredients into a paste. Apply to clean skin and leave for 15 minutes. Rinse with lukewarm water.",
    tips: [
      "Consistency is Key: Use this pack twice a week for noticeable results.",
      "Customize for Skin Type: Add yogurt for dry skin or lemon juice for oily skin.",
      "Avoid Eye Area: Be cautious not to apply near the eyes due to turmeric's potential to stain."
    ],
    tags: ["brightening", "exfoliation", "acne prevention"],
  },
  {
    id: "2",
    title: "Saffron and Honey Face Pack",
    description: "Improves complexion, reduces pigmentation, and provides a radiant glow",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    difficulty: "easy",
    time: "15 min",
    rating: 4.9,
    ingredients: ["A few strands of saffron", "1 tablespoon honey", "warm water"],
    instructions: "Soak saffron in warm water for 10–15 minutes. Mix with honey to form a paste. Apply on clean skin for 20 minutes. Rinse with lukewarm water.",
    tips: [
      "Use Raw Honey: Enhances moisturizing properties.",
      "Soak Saffron Properly: Ensure saffron is fully infused for maximum benefits.",
      "Apply Before Bed: Helps in overnight skin rejuvenation."
    ],
    tags: ["brightening", "pigmentation", "radiant glow"],
  },
  {
    id: "3",
    title: "Besan (Gram Flour) Body Scrub",
    description: "Exfoliates dead skin cells, brightens skin tone, removes tan",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    difficulty: "easy",
    time: "5 min",
    rating: 4.7,
    ingredients: ["½ cup gram flour", "¼ cup moong dal powder", "½ tablespoon turmeric powder", "water/milk"],
    instructions: "Mix ingredients into a paste. Scrub gently during your bath once a week.",
    tips: [
      "Use Circular Motions: Gently scrub to avoid irritation.",
      "Add Rose Water: Enhances hydration and fragrance.",
      "Avoid Over-Exfoliation: Limit use to once a week."
    ],
    tags: ["exfoliation", "brightening", "body care"],
  },
  {
    id: "4",
    title: "Cucumber Face Mask",
    description: "Hydrates skin, reduces puffiness, soothes sunburn",
    image: "https://images.unsplash.com/photo-1622169734867-dcc79fb09720?q=80&w=2070&auto=format&fit=crop",
    difficulty: "easy",
    time: "5 min",
    rating: 4.6,
    ingredients: ["½ cucumber (peeled and blended)", "1 tablespoon yogurt", "1 teaspoon honey"],
    instructions: "Blend cucumber with yogurt and honey. Apply to clean skin for 15 minutes. Rinse with cool water.",
    tips: [
      "Store in Refrigerator: Keeps mixture fresh for up to three days.",
      "Use Fresh Cucumber: Ensures maximum hydration benefits.",
      "Avoid Over-Chilling: Room temperature is ideal for application."
    ],
    tags: ["hydration", "soothing", "cooling"],
  },
  {
    id: "5",
    title: "Oatmeal and Honey Face Mask",
    description: "Moisturizes skin, exfoliates dead cells, brightens complexion",
    image: "https://images.unsplash.com/photo-1621224525307-324acc1b1df0?q=80&w=2071&auto=format&fit=crop",
    difficulty: "easy",
    time: "5 min",
    rating: 4.8,
    ingredients: ["½ cup oatmeal", "1 tablespoon honey"],
    instructions: "Mix oatmeal and honey into a paste. Apply to face for 20 minutes before rinsing with warm water.",
    tips: [
      "Grind Oatmeal Finely: Ensures smooth application.",
      "Use Raw Honey: Enhances moisturizing properties.",
      "Avoid Over-Exfoliation: Use once a week for sensitive skin."
    ],
    tags: ["moisturizing", "exfoliation", "brightening"],
  },
  {
    id: "6",
    title: "Coconut-Lemon Body Scrub",
    description: "Moisturizes skin while exfoliating; brightens dull skin",
    image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?q=80&w=2075&auto=format&fit=crop",
    difficulty: "easy",
    time: "10 min",
    rating: 4.7,
    ingredients: ["½ cup coconut oil", "1 cup sugar", "juice of one lemon"],
    instructions: "Mix ingredients into a scrub. Apply on damp skin during a shower in circular motions; rinse off with warm water.",
    tips: [
      "Softening Coconut Oil: Ensure it's not too hard or melted.",
      "Avoid Over-Scrubbing: Be gentle to prevent irritation.",
      "Store Properly: Keep in an airtight container to maintain consistency."
    ],
    tags: ["moisturizing", "exfoliation", "body care"],
  },
  {
    id: "7",
    title: "Aloe Vera Gel with Rose Water",
    description: "Hydrates skin, reduces inflammation, improves elasticity",
    image: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?q=80&w=2070&auto=format&fit=crop",
    difficulty: "easy",
    time: "2 min",
    rating: 4.9,
    ingredients: ["Fresh aloe vera gel", "rose water"],
    instructions: "Mix aloe vera gel with rose water. Apply on face for 10–15 minutes; rinse off with lukewarm water.",
    tips: [
      "Use Fresh Aloe Vera: Ensures maximum benefits.",
      "Avoid Eye Area: Be cautious not to apply near the eyes.",
      "Combine with Other Masks: Enhances hydration when used with other face packs."
    ],
    tags: ["hydration", "anti-inflammatory", "elasticity"],
  },
  {
    id: "8",
    title: "Papaya and Honey Face Pack",
    description: "Moisturizes skin, brightens complexion, combats aging signs",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    difficulty: "easy",
    time: "5 min",
    rating: 4.7,
    ingredients: ["Mashed papaya (2 tablespoons)", "honey (1 tablespoon)"],
    instructions: "Mix papaya and honey into a paste. Massage onto face; leave for 15–20 minutes before rinsing.",
    tips: [
      "Use Ripe Papaya: Ensures smoother application.",
      "Massage Gently: Helps in better absorption.",
      "Avoid Over-Application: Use once or twice a week for best results."
    ],
    tags: ["moisturizing", "brightening", "anti-aging"],
  },
  {
    id: "9",
    title: "Rice Water Toner",
    description: "Controls oiliness, minimizes pores, hydrates dry skin",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    difficulty: "easy",
    time: "30 min",
    rating: 4.6,
    ingredients: ["½ cup rice", "2 cups water"],
    instructions: "Soak rice in water for 30 minutes; strain the liquid into a container. Use as a toner daily after cleansing.",
    tips: [
      "Store in Refrigerator: Keeps rice water fresh for up to five days.",
      "Use Daily: Consistency enhances benefits.",
      "Combine with Other Toners: Mix with rose water for added hydration."
    ],
    tags: ["toner", "oil control", "hydration"],
  },
  {
    id: "10",
    title: "Honey Aloe Face Mask",
    description: "Soothes sunburns, moisturizes skin deeply",
    image: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?q=80&w=2070&auto=format&fit=crop",
    difficulty: "easy",
    time: "2 min",
    rating: 4.8,
    ingredients: ["Honey (2 teaspoons)", "aloe vera gel (1 teaspoon)", "cinnamon (¼ teaspoon)"],
    instructions: "Mix all ingredients into a smooth paste. Apply evenly; leave on for 15–20 minutes before washing off.",
    tips: [
      "Avoid Cinnamon on Sensitive Skin: May cause irritation.",
      "Use Raw Honey: Enhances moisturizing properties.",
      "Apply Before Bed: Helps in overnight skin rejuvenation."
    ],
    tags: ["soothing", "moisturizing", "sunburn"],
  },
  {
    id: "11",
    title: "Turmeric and Milk Face Pack",
    description: "Lightens pigmentation and tanning; nourishes skin",
    image: "https://images.unsplash.com/photo-1584463623578-583f6a2e5b5d?q=80&w=600&auto=format&fit=crop",
    difficulty: "easy",
    time: "2 min",
    rating: 4.7,
    ingredients: ["Turmeric powder (½ teaspoon)", "milk (1 teaspoon)"],
    instructions: "Mix ingredients into a paste; apply on face for 10 minutes before rinsing.",
    tips: [
      "Use Cold Milk: Helps in soothing the skin.",
      "Avoid Over-Application: Use once or twice a week.",
      "Combine with Other Ingredients: Add honey for moisturizing benefits."
    ],
    tags: ["brightening", "pigmentation", "nourishing"],
  },
  {
    id: "12",
    title: "Green Tea and Honey Mask",
    description: "Detoxifies skin; reduces signs of aging",
    image: "https://images.unsplash.com/photo-1621224525307-324acc1b1df0?q=80&w=2071&auto=format&fit=crop",
    difficulty: "easy",
    time: "2 min",
    rating: 4.6,
    ingredients: ["Green tea leaves (from one tea bag)", "honey (2 teaspoons)"],
    instructions: "Steep tea bag in hot water; mix leaves with honey to form a paste. Apply to face; leave for 15–30 minutes before rinsing.",
    tips: [
      "Use Fresh Green Tea: Ensures maximum antioxidant benefits.",
      "Avoid Over-Steeping: May cause bitterness.",
      "Add Coconut Oil: Enhances moisturizing properties."
    ],
    tags: ["detoxifying", "anti-aging", "antioxidant"],
  },
  {
    id: "13",
    title: "Neem and Turmeric Face Pack",
    description: "Treats acne, reduces inflammation, and brightens skin",
    image: "https://images.unsplash.com/photo-1584559582128-5a0b0f9c5c5c?q=80&w=600&auto=format&fit=crop",
    difficulty: "easy",
    time: "2 min",
    rating: 4.8,
    ingredients: ["Neem oil (½ teaspoon)", "turmeric powder (1 teaspoon)"],
    instructions: "Mix ingredients into a paste; apply on face for 10–15 minutes; rinse off normally.",
    tips: [
      "Use Neem Oil Sparingly: May cause dryness if overused.",
      "Combine with Yogurt: Adds moisturizing benefits.",
      "Avoid Eye Area: Be cautious not to apply near the eyes."
    ],
    tags: ["acne", "anti-inflammatory", "brightening"],
  },
  {
    id: "14",
    title: "Cucumber and Mint Face Mask",
    description: "Hydrates skin, reduces puffiness, soothes sunburn, and balances skin pH",
    image: "https://images.unsplash.com/photo-1622169734867-dcc79fb09720?q=80&w=2070&auto=format&fit=crop",
    difficulty: "easy",
    time: "10 min",
    rating: 4.7,
    ingredients: ["1 large cucumber (peeled and grated)", "¼ cup fresh mint leaves", "2 tablespoons yogurt (optional)", "1 tablespoon honey (optional)"],
    instructions: "Blend cucumber and mint. Strain the mixture and add yogurt and honey if desired. Apply to face for 15–20 minutes; rinse with warm water.",
    tips: [
      "Use Fresh Mint: Ensures maximum cooling benefits.",
      "Store in Refrigerator: Keeps mixture fresh for up to three days.",
      "Avoid Over-Chilling: Room temperature is ideal for application."
    ],
    tags: ["hydration", "cooling", "soothing"],
  },
  {
    id: "15",
    title: "Rose Water and Aloe Vera Mask",
    description: "Hydrates skin, reduces inflammation, and brightens complexion",
    image: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?q=80&w=2070&auto=format&fit=crop",
    difficulty: "easy",
    time: "2 min",
    rating: 4.9,
    ingredients: ["Equal parts rose water and aloe vera gel"],
    instructions: "Mix rose water and aloe vera gel. Apply to face for 15–20 minutes; rinse off with lukewarm water.",
    tips: [
      "Use Fresh Aloe Vera: Ensures maximum benefits.",
      "Combine with Witch Hazel: Helps control oiliness.",
      "Apply Regularly: Consistency enhances hydration and brightening effects."
    ],
    tags: ["hydration", "anti-inflammatory", "brightening"],
  },
];

// Available filter categories
const categories = [
  "All",
  "Brightening",
  "Hydration",
  "Exfoliation",
  "Anti-inflammatory",
  "Acne",
  "Anti-aging",
  "Body Care",
  "Soothing",
  "Toner",
];

const HomeRemedies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredRemedies = remediesData.filter((remedy) => {
    const matchesSearch = remedy.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      remedy.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      remedy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = 
      activeCategory === "All" || 
      remedy.tags.some(tag => 
        tag.toLowerCase() === activeCategory.toLowerCase() ||
        (activeCategory === "Anti-aging" && tag.includes("anti"))
      );
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with background */}
          <div className="relative mb-12 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2064&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#151d29]/90 to-[#151d29]/70"></div>
            <div className="relative z-10 py-12 px-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Natural <span className="text-herb">Home Remedies</span>
              </h1>
              <div className="w-20 h-1 bg-herb mb-6"></div>
              <p className="text-gray-300 mb-0 max-w-2xl">
                Discover DIY herbal remedies you can make at home using simple, natural ingredients. 
                These recipes harness the power of plants to address various skin concerns safely and effectively.
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search for remedies..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-5 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-herb focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-herb">
                <Search size={20} />
              </div>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2">
              <Filter className="text-herb mr-1 h-4 w-4 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                    activeCategory === category
                      ? "bg-herb text-herb-foreground shadow-lg shadow-herb/20"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Remedies Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/5 rounded-xl overflow-hidden h-96 animate-pulse">
                  <div className="h-48 bg-white/10"></div>
                  <div className="p-5">
                    <div className="h-6 bg-white/10 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-white/10 rounded mb-4 w-2/3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-white/10 rounded w-1/4"></div>
                      <div className="h-4 bg-white/10 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRemedies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRemedies.map((remedy) => (
                <Link
                  key={remedy.id}
                  to={`/remedies/${remedy.id}`}
                  className="transition-all duration-300 hover:scale-[1.02] focus:outline-none group"
                >
                  <Card className="bg-white/5 border-white/10 overflow-hidden h-full">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={remedy.image}
                        alt={remedy.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-herb transition-colors">
                        {remedy.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {remedy.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock className="h-3 w-3 text-herb" />
                          <span>{remedy.time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{remedy.rating}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {remedy.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {remedy.instructions && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <p className="text-gray-300 text-xs font-medium mb-1">Instructions:</p>
                          <p className="text-gray-400 text-xs line-clamp-2">{remedy.instructions}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-xl text-white font-medium mb-2">
                No remedies found
              </h3>
              <p className="text-gray-400">
                Try searching with a different term or filter
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomeRemedies;
