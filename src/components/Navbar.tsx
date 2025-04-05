
import { Link } from "react-router-dom";
import { SearchIcon } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 5C18 10 10 15 10 25C10 35 30 35 30 25C30 15 22 10 20 5Z" stroke="#4ADE80" strokeWidth="2" fill="#22C55E" fillOpacity="0.2" />
            <path d="M20 5C18 12 15 18 20 28" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 5C22 12 25 18 20 28" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-xl font-bold text-herb">Herb Sanctuary</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-white hover:text-herb transition-colors">Home</Link>
        <Link to="/explore" className="text-white hover:text-herb transition-colors">Explore Plants</Link>
        <Link to="/analyzer" className="text-white hover:text-herb transition-colors">AI Skin Analyzer</Link>
        <Link to="/remedies" className="text-white hover:text-herb transition-colors">Home Remedies</Link>
        <Link to="/chatbot" className="text-white hover:text-herb transition-colors">Chatbot</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/search" className="p-2 rounded-full hover:bg-[#222] transition-colors">
          <SearchIcon className="h-5 w-5 text-white" />
        </Link>
        <Link to="/get-started" className="herb-button">
          Get started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
