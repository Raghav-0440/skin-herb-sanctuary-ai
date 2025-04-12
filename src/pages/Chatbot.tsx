import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Send, Leaf, Search, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

// Mock suggested questions
const suggestedQuestions = [
  "What herbs are good for acne treatment?",
  "How can I reduce skin inflammation naturally?",
  "Best herbs for dry skin?",
  "Natural remedies for eczema",
  "How to treat dark circles with herbs?",
];

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your virtual herbal assistant. How can I help you with your skin concerns today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(text.trim());
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple mock response generator
  const generateBotResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();
    let response = "";

    if (lowerQuery.includes("acne")) {
      response = "For acne treatment, herbs like Tea Tree, Neem, and Turmeric can be very effective. Tea tree oil has antimicrobial properties that help fight bacteria causing acne, while Neem helps reduce inflammation and Turmeric is known for its antiseptic qualities. Would you like to learn more about any of these herbs?";
    } else if (lowerQuery.includes("dark circles") || lowerQuery.includes("under eye")) {
      response = "For dark circles, consider herbs like Cucumber, Chamomile, and Green Tea. These herbs have cooling properties that help reduce puffiness and brighten the under-eye area. Regular application of cold Chamomile tea bags can also help reduce dark circles over time.";
    } else if (lowerQuery.includes("dry skin") || lowerQuery.includes("dryness")) {
      response = "For dry skin, Aloe Vera, Calendula, and Evening Primrose are excellent herbs. Aloe provides deep hydration, Calendula helps repair the skin barrier, and Evening Primrose oil is rich in essential fatty acids that nourish dry skin. I recommend creating a hydrating mask with Aloe Vera gel mixed with a few drops of Jojoba oil for deep moisturizing.";
    } else if (lowerQuery.includes("eczema") || lowerQuery.includes("psoriasis")) {
      response = "For conditions like eczema and psoriasis, gentle herbs like Oatmeal, Calendula, and Chamomile can provide relief. These herbs have anti-inflammatory properties that soothe irritated skin. A bath with colloidal oatmeal can be particularly soothing during flare-ups.";
    } else {
      response = "Thank you for your question about skincare. To provide you with the most helpful information, could you share more details about your specific skin concern or the type of remedy you're looking for? I can suggest herbs for various conditions like acne, dry skin, aging, or specific issues like dark spots.";
    }

    return {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: "bot",
      timestamp: new Date(),
    };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 section-spacing pt-24">
        <div className="container-width">
          <div className="text-center mb-16">
            <h1 className="section-title">
              Herbal <span className="text-herb">Chatbot</span>
            </h1>
            <p className="section-description">
              Chat with our AI assistant to get personalized advice about herbal
              remedies and skincare.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-[#222] rounded-xl p-6 border border-[#333] h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex items-start gap-2 max-w-[80%]">
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8 bg-herb text-herb-foreground">
                          <div className="flex items-center justify-center h-full">
                            <Leaf className="h-4 w-4" />
                          </div>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`rounded-2xl px-4 py-2 text-sm ${
                            message.sender === "user"
                              ? "bg-herb text-herb-foreground"
                              : "bg-[#1a1a1a] text-white border border-[#333]"
                          }`}
                        >
                          <p>{message.text}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-2">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8 bg-[#333]">
                          <div className="flex items-center justify-center h-full">
                            <MessageCircle className="h-4 w-4 text-white" />
                          </div>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <Avatar className="h-8 w-8 bg-herb text-herb-foreground">
                        <div className="flex items-center justify-center h-full">
                          <Leaf className="h-4 w-4" />
                        </div>
                      </Avatar>
                      <div className="rounded-2xl px-4 py-2 bg-[#1a1a1a] text-white border border-[#333]">
                        <div className="flex gap-1">
                          <span className="animate-bounce">•</span>
                          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                            •
                          </span>
                          <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                            •
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested questions */}
              {messages.length < 3 && (
                <div className="py-4">
                  <p className="text-gray-400 text-sm mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="bg-[#1a1a1a] text-gray-300 text-xs rounded-full px-3 py-1 border border-[#333] hover:border-herb transition-colors"
                        onClick={() => handleSendMessage(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input area */}
              <div className="mt-4 bg-[#1a1a1a] rounded-lg border border-[#333] p-2 flex items-center">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about herbs for your skin concerns..."
                  className="flex-1 bg-transparent border-none text-white focus:outline-none resize-none h-10 py-2 px-3"
                  rows={1}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim()}
                  className={`rounded-full h-8 w-8 p-0 ${
                    input.trim()
                      ? "bg-herb text-herb-foreground"
                      : "bg-[#333] text-gray-600"
                  }`}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chatbot;
