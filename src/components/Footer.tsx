
import { Facebook, Twitter, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5C18 10 10 15 10 25C10 35 30 35 30 25C30 15 22 10 20 5Z" stroke="#4ADE80" strokeWidth="2" fill="#22C55E" fillOpacity="0.2" />
                <path d="M20 5C18 12 15 18 20 28" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 5C22 12 25 18 20 28" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h3 className="text-xl font-bold text-herb">Herb Sanctuary</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Discover the healing power of natural herbs for skin health and overall wellness.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-[#222] p-2 rounded-full text-herb hover:bg-herb hover:text-herb-foreground transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-[#222] p-2 rounded-full text-herb hover:bg-herb hover:text-herb-foreground transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-[#222] p-2 rounded-full text-herb hover:bg-herb hover:text-herb-foreground transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-[#222] p-2 rounded-full text-herb hover:bg-herb hover:text-herb-foreground transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-herb">Home</Link></li>
              <li><Link to="/explore" className="text-gray-400 hover:text-herb">Explore Plants</Link></li>
              <li><Link to="/analyzer" className="text-gray-400 hover:text-herb">AI Skin Analyzer</Link></li>
              <li><Link to="/remedies" className="text-gray-400 hover:text-herb">Home Remedies</Link></li>
              <li><Link to="/chatbot" className="text-gray-400 hover:text-herb">Chatbot</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-herb">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-herb">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-herb">Newsletter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-herb">Research Papers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-herb">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Subscribe</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-[#222] border border-[#333] rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-herb focus:border-transparent" 
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-herb">
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#333] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Herb Sanctuary. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 text-sm hover:text-herb">Privacy Policy</a>
            <a href="#" className="text-gray-400 text-sm hover:text-herb">Terms of Service</a>
            <a href="#" className="text-gray-400 text-sm hover:text-herb">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
