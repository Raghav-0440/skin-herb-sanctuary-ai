import ChatBot from "../components/chatbot";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#111]">
      <Navbar />
      <main className="flex-1 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4 text-white">
              Herbal <span className="text-green-500">SkinCare</span> Assistant
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get personalized advice using our curated collection of medicinal plants and remedies.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <ChatBot />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}