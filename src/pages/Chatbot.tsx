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
      const botResponse = generateBotResponse(text.trim(), messages);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper function to extract multiple concerns from a user message
  const extractConcerns = (message: string): string[] => {
    const concerns: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    // Common skin concerns with variations
    const skinConcerns = {
      acne: ['acne', 'pimple', 'breakout', 'zit', 'blackhead', 'whitehead'],
      darkCircles: ['dark circle', 'under eye', 'eye bag', 'dark under eye'],
      drySkin: ['dry skin', 'dryness', 'flaky', 'tightness', 'dehydrated'],
      eczema: ['eczema', 'dermatitis', 'rash', 'itchy skin'],
      psoriasis: ['psoriasis', 'scaly skin', 'flaky skin'],
      inflammation: ['inflammation', 'redness', 'irritation', 'swelling'],
      aging: ['aging', 'wrinkle', 'fine line', 'anti-aging', 'age spot'],
      rosacea: ['rosacea', 'redness', 'flushing'],
      hyperpigmentation: ['dark spot', 'hyperpigmentation', 'uneven tone']
    };
    
    // Check for each concern with improved matching
    Object.entries(skinConcerns).forEach(([concern, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        concerns.push(concern);
      }
    });
    
    // Common ingredients with variations
    const ingredients = {
      neem: ['neem', 'azadirachta'],
      aloe: ['aloe', 'aloe vera'],
      teaTree: ['tea tree', 'melaleuca'],
      turmeric: ['turmeric', 'curcumin'],
      honey: ['honey', 'manuka'],
      vitaminC: ['vitamin c', 'ascorbic acid'],
      niacinamide: ['niacinamide', 'vitamin b3'],
      retinol: ['retinol', 'retinoid'],
      hyaluronic: ['hyaluronic acid', 'hyaluronan']
    };
    
    // Check for ingredients
    Object.entries(ingredients).forEach(([ingredient, variations]) => {
      if (variations.some(variation => lowerMessage.includes(variation))) {
        concerns.push(ingredient);
      }
    });
    
    // Check for treatment-related keywords
    if (lowerMessage.includes('treatment') || lowerMessage.includes('remedy') || 
        lowerMessage.includes('mask') || lowerMessage.includes('routine')) {
      concerns.push('treatment');
    }
    
    return concerns;
  };

  // Helper function to format response in points
  const formatResponse = (points: string[]): string => {
    return points.map(point => {
      if (point.trim() === '') return '';
      return `• ${point}`;
    }).join('\n');
  };

  // Simple mock response generator
  const generateBotResponse = (query: string, previousMessages: Message[] = []): Message => {
    const lowerQuery = query.toLowerCase();
    let response = "";
    
    // Extract concerns from the query
    const concerns = extractConcerns(query);
    
    // Handle different types of queries
    if (lowerQuery.includes('dark circles') || lowerQuery.includes('under eye')) {
      response = "For treating dark circles with herbs, here are effective natural remedies:\n\n" +
        formatResponse([
          "Cucumber: Place cool cucumber slices on eyes for 10-15 minutes",
          "Green Tea Bags: Apply cooled tea bags to reduce puffiness",
          "Potato Slices: Natural bleaching properties help lighten dark circles",
          "Aloe Vera: Apply pure gel around eyes for hydration",
          "Rose Water: Use as a gentle toner to brighten under-eye area",
          "Chamomile Tea: Use cooled tea bags to reduce inflammation",
          "Mint Leaves: Crush and apply for cooling effect"
        ]);
    }
    else if (lowerQuery.includes('eczema')) {
      response = "For treating eczema naturally, try these herbal remedies:\n\n" +
        formatResponse([
          "Coconut Oil: Apply virgin coconut oil for moisturizing",
          "Colloidal Oatmeal: Add to bath water to soothe skin",
          "Calendula: Use cream or oil for anti-inflammatory benefits",
          "Chamomile: Apply cooled tea as compress",
          "Aloe Vera: Pure gel helps reduce inflammation",
          "Evening Primrose Oil: Rich in gamma-linolenic acid",
          "Neem: Natural antiseptic properties"
        ]);
    }
    else if (concerns.includes('acne')) {
      response = "For acne treatment, here are some effective herbal remedies:\n\n" +
        formatResponse([
          "Tea Tree Oil: Natural antibacterial properties, apply diluted",
          "Neem: Powerful antimicrobial herb, use as face pack",
          "Turmeric: Anti-inflammatory properties, mix with honey",
          "Aloe Vera: Soothes inflammation and redness",
          "Green Tea: Antioxidant-rich, use as toner",
          "Holy Basil: Natural antibacterial properties",
          "Calendula: Helps heal acne scars"
        ]);
    }
    else if (concerns.includes('inflammation') || lowerQuery.includes('reduce inflammation')) {
      response = "To reduce skin inflammation naturally:\n\n" +
        formatResponse([
          "Chamomile: Natural anti-inflammatory, use as compress",
          "Green Tea: Rich in antioxidants, apply cooled tea",
          "Calendula: Healing and calming properties",
          "Aloe Vera: Cooling and soothing effect",
          "Cucumber: Natural anti-inflammatory properties",
          "Turmeric: Powerful anti-inflammatory herb",
          "Licorice Root: Helps reduce redness"
        ]);
    }
    else if (lowerQuery.includes('dry skin') || concerns.includes('drySkin')) {
      response = "For dry skin, try these moisturizing herbs:\n\n" +
        formatResponse([
          "Aloe Vera: Deep hydration and soothing",
          "Calendula: Healing and moisturizing",
          "Chamomile: Calming and hydrating",
          "Rose: Natural moisturizer",
          "Honey: Natural humectant",
          "Coconut Oil: Deep moisturizing properties",
          "Shea Butter: Rich in fatty acids"
        ]);
    }
    else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      response = "Hello! I'm your herbal skincare assistant. How can I help you with your skin concerns today?";
    }
    else {
      response = "I understand you're looking for herbal skincare advice. Could you please specify your skin concern? For example:\n\n" +
        formatResponse([
          "Do you have acne?",
          "Are you dealing with hyperpigmentation?",
          "Is your skin dry or oily?",
          "Are you experiencing redness or inflammation?",
          "Would you like general skincare tips?"
        ]);
    }

    return {
      id: Date.now().toString(),
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
                          className={`rounded-2xl px-4 py-2 text-sm whitespace-pre-line ${
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
