// components/chatbot.tsx

"use client";

import { useState } from "react";
import { generateResponse } from "@/services/mistralService"; // Corrected import path

export default function ChatBot() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      const botReply = await generateResponse(input, { messages: newMessages });
      setMessages([...newMessages, { role: "assistant" as const, content: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: "assistant" as const, content: "Sorry, something went wrong!" },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto p-4 space-y-4">
      <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-white shadow">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left text-gray-500">Typing...</div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
