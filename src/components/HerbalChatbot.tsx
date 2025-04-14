import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { plantsData } from '@/data/plantsData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const HerbalChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hey there! I\'m your friendly skincare expert and plant enthusiast. What\'s on your mind today? I\'ve got all the tea on natural remedies and skincare secrets!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      // Call the Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBk27DZ37CobQG5ctP1cPLR6AQ4Ig1Er5A', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'system',
              parts: [
                {
                  text: `You are a fun, slightly gossipy skincare expert who loves talking about plants, home remedies, and skincare secrets. You can answer ANY type of question, not just skincare-related ones.

IMPORTANT FORMATTING INSTRUCTIONS:
- ALWAYS format your responses using bullet points (•) for each main point
- Keep each bullet point short and concise (1-2 sentences max)
- Use sub-bullets (◦) for related details when needed
- NEVER write in long paragraphs
- NEVER use numbered lists unless specifically asked

When users ask skincare-related questions, you must:

• Give clear skincare advice in a friendly, casual, and slightly gossipy tone, like you're sharing insider secrets with a friend.

• Suggest one or more plants or home remedies from the website's virtual herbal garden. Here are the plants available: ${Object.values(plantsData).map(p => p.name).join(', ')}.

• Casually drop little extra tips or "secrets" to make it feel exclusive.

• Share fun facts, ancient remedies, or quick side comments when relevant, but stay natural, not scripted.

• If the user's question is unclear, playfully ask for more information.

• If the conversation goes off-topic, gently and humorously steer it back to skincare and herbal remedies.

• Keep your responses concise and easy to read.

• Maintain a lively, gossip-friendly tone — like a knowledgeable best friend — but do not use emojis or any special characters. Keep all responses text-only.

For non-skincare questions:
• Answer the question directly and accurately
• If possible, relate it back to skincare, plants, or wellness when appropriate
• Keep the same friendly, slightly gossipy tone
• ALWAYS use bullet points for organization

IMPORTANT: You must provide a meaningful response to EVERY question. Never say "I don't know" or give a generic response. If you're not sure about something, make an educated guess based on your knowledge and clearly indicate that it's an estimate.`
                }
              ]
            },
            ...conversationHistory,
            {
              role: 'user',
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const botResponse = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Oops! I had a little brain freeze there. Can you try asking that again? I promise I\'m usually much more helpful!' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#333]">
      <div className="p-4 bg-[#222] border-b border-[#333]">
        <h2 className="text-xl font-semibold text-white">Herbal Skincare Expert</h2>
        <p className="text-sm text-gray-400">Ask me anything about skincare and herbal remedies!</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-herb text-white' 
                  : 'bg-[#333] text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.role === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-herb" />
                )}
                <span className="text-xs font-medium">
                  {message.role === 'user' ? 'You' : 'Herbal Expert'}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-[#333] text-white">
              <div className="flex items-center gap-2 mb-1">
                <Bot size={16} className="text-herb" />
                <span className="text-xs font-medium">Herbal Expert</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-herb rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-herb rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-herb rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-[#333]">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about skincare, plants, or remedies..."
            className="flex-1 bg-[#333] text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-herb"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-herb text-white rounded-lg p-3 hover:bg-herb-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HerbalChatbot; 