import React from 'react';
import Navbar from '@/components/Navbar';
import HerbalChatbot from '@/components/HerbalChatbot';

const HerbalChat: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#111] text-white">
      <Navbar />
      <main className="container mx-auto py-8 px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Herbal Skincare Expert</h1>
          <p className="text-gray-400 text-center mb-8">
            Chat with our friendly skincare expert for personalized advice and herbal remedies
          </p>
          
          <HerbalChatbot />
          
          <div className="mt-8 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
            <h2 className="text-xl font-semibold mb-2">About Our Herbal Expert</h2>
            <p className="text-gray-300">
              Our herbal skincare expert is here to provide you with personalized advice about natural remedies, 
              plant-based skincare, and traditional healing practices. Whether you're dealing with acne, dryness, 
              or just want to improve your skin's health, our expert can suggest plants from our virtual garden 
              and share insider tips for glowing skin.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HerbalChat; 