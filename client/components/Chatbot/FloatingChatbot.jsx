"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Send, Brain } from "lucide-react";
import Image from "next/image";
import ColorfulBlobs from "./ColorfulBlobs";
import { RiMindMap } from "react-icons/ri";
import { FaBrain } from "react-icons/fa6";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const animateText = (text) => {
    setIsTyping(true);
    let currentText = "";
    let currentIndex = 0;

    const typeChar = () => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setTypingText(currentText);
        currentIndex++;
        setTimeout(typeChar, 25); // Speed up the animation by reducing the delay
      } else {
        setIsTyping(false);
        setMessages((prev) => [...prev, { text, sender: "bot" }]);
        setTypingText("");
        speakText(text); // Call text-to-speech function after typing animation
      }
    };

    typeChar();
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech is not supported in this browser.");
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      setIsProcessing(true);
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");

      try {
        // Send request to the chatbot API
        const response = await fetch("http://127.0.0.1:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: input.trim(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            "Request failed with status",
            response.status,
            errorData
          );
          return;
        }

        const result = await response.json();

        // Display the bot's response with typing animation
        animateText(result.response);
      } catch (error) {
        console.error("Error in chat request:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <div className="relative">
          {messages.length > 0 && (
            <div className="absolute bottom-8 right-0 w-64 p-3 rounded-lg backdrop-blur-md bg-white/30 border border-white/40 shadow-lg">
              <p className="text-sm text-gray-800 line-clamp-2">
                {messages[messages.length - 1].text}
              </p>
            </div>
          )}
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full bg-gradient-to-tr from-purple-200 to-purple-500 hover:bg-purple-600 h-14 w-14"
          >
            <FaBrain style={{ width: "20px", height: "20px" }} />
          </Button>
        </div>
      ) : (
        <Card className="w-[400px] h-[600px] shadow-xl transition-all duration-300 ease-in-out flex flex-col">
          <div className="h-14 p-3 px-5 bg-white rounded-t-lg flex justify-between items-center border-b">
            <span className="font-semibold flex items-center gap-x-2">
              <Image
                src="/images/logo.png"
                alt="Vaani.ai"
                className="h-8 w-auto"
                width={100}
                height={100}
              />
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-red-600 hover:bg-transparent"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <ColorfulBlobs
                size="200px"
                isProcessing={isProcessing || isTyping}
              />
            </div>

            <div className="relative z-10 ">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-500/70 text-white"
                        : "bg-gray-100/60"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-2">
                  <div className="max-w-[80%] rounded-lg p-3 bg-gray-100/60">
                    {typingText}
                    <span className="inline-block animate-pulse">▋</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleSend}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FloatingChatbot;
