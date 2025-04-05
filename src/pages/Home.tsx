
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Leaf, ShieldPlus, MessageSquare, HeartPulse } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-herb" />,
      title: "Explore Plants",
      description:
        "Discover a wide variety of medicinal herbs with detailed information about their properties and uses for skin health.",
      link: "/explore",
    },
    {
      icon: <ShieldPlus className="h-8 w-8 text-herb" />,
      title: "AI Skin Analyzer",
      description:
        "Analyze your skin condition with our AI-powered tool and get personalized herbal recommendations.",
      link: "/analyzer",
    },
    {
      icon: <HeartPulse className="h-8 w-8 text-herb" />,
      title: "Home Remedies",
      description:
        "Learn how to create effective home remedies using natural herbs for various skin issues.",
      link: "/remedies",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-herb" />,
      title: "Herbal Chatbot",
      description:
        "Chat with our AI assistant to get instant answers to your questions about herbal remedies.",
      link: "/chatbot",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        <section className="py-16 px-6 md:px-10 bg-[#161616]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Explore the Virtual Herbal Garden
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Discover the amazing properties of medicinal herbs and their benefits for skin health. Our virtual garden provides detailed information about each plant and its traditional uses.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#1d1d1d] rounded-xl p-6 border border-[#333] hover:border-herb transition-colors"
                >
                  <div className="h-14 w-14 rounded-full bg-[#222] flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <Link
                    to={feature.link}
                    className="text-herb hover:underline flex items-center gap-1"
                  >
                    Learn more{" "}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Learn About Natural <span className="text-herb">Skin Care Solutions</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Our virtual herbal garden provides comprehensive knowledge about plants that have been used for centuries to address various skin concerns. From acne and eczema to aging and hyperpigmentation, discover nature's remedies.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-herb flex items-center justify-center text-herb-foreground font-bold">✓</div>
                  <span className="text-gray-300">Backed by traditional knowledge</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-herb flex items-center justify-center text-herb-foreground font-bold">✓</div>
                  <span className="text-gray-300">Scientific research insights</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-herb flex items-center justify-center text-herb-foreground font-bold">✓</div>
                  <span className="text-gray-300">Sustainable sourcing information</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-herb flex items-center justify-center text-herb-foreground font-bold">✓</div>
                  <span className="text-gray-300">DIY preparation methods</span>
                </div>
              </div>
              <Link to="/remedies" className="herb-button inline-block">
                Explore Remedies
              </Link>
            </div>
            
            <div className="flex-1 h-80 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-herb/30 to-transparent rounded-xl" />
              <img 
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop"
                alt="Herbal Garden" 
                className="w-full h-full object-cover rounded-xl" 
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
