
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Placeholder = () => {
  const { page } = useParams<{ page: string }>();
  
  const pageTitle = page?.charAt(0).toUpperCase() + page?.slice(1).replace(/-/g, " ") || "Page";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-6 py-20">
          <h1 className="text-3xl font-bold text-white mb-4">{pageTitle}</h1>
          <div className="w-20 h-1 bg-herb mx-auto mb-8"></div>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            This page is coming soon! We're working on building this feature and will launch it in the near future.
          </p>
          <Link to="/" className="herb-button">
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Placeholder;
