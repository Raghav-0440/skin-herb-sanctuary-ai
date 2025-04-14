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
      title: "Herbal Expert",
      description:
        "Chat with our AI assistant to get instant answers to your questions about herbal remedies.",
      link: "/herbal-chat",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <Navbar />
      <Hero />
      
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">Our Features</h2>
          <div className="w-20 h-1 bg-herb mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link 
                key={index} 
                to={feature.link}
                className="group bg-[#1a1a1a] rounded-lg p-6 border border-[#333] hover:border-herb transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-herb transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-10 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">Why Choose Us</h2>
          <div className="w-20 h-1 bg-herb mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#222] rounded-lg p-6 border border-[#333]">
              <h3 className="text-xl font-semibold mb-4 text-herb">Natural Solutions</h3>
              <p className="text-gray-400">
                We focus on natural, plant-based remedies that have been used for centuries to promote healthy skin.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-lg p-6 border border-[#333]">
              <h3 className="text-xl font-semibold mb-4 text-herb">Expert Knowledge</h3>
              <p className="text-gray-400">
                Our platform combines traditional herbal wisdom with modern skincare science for the best results.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-lg p-6 border border-[#333]">
              <h3 className="text-xl font-semibold mb-4 text-herb">Personalized Care</h3>
              <p className="text-gray-400">
                Get tailored recommendations based on your specific skin type and concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Skin?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our community of skin health enthusiasts and discover the power of natural remedies.
          </p>
          <Link to="/explore" className="herb-button">
            Get Started
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
