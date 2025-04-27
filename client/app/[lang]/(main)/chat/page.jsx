"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AI_SERVER_URL } from "@/constants/utils.js";
import { Send, Mic, MicOff } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const formatMessage = (text) => {
  if (!text) return null;

  // Handle numbered lists (like "1. Item")
  const hasNumberedList = /^\d+\.\s.+/m.test(text);

  // Handle bullet points (like "* Item" or "• Item")
  const hasBulletList = /^[\*\•]\s.+/m.test(text);

  // Handle URLs to make them clickable
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Handle bold text (like **text**)
  const boldRegex = /\*\*(.*?)\*\*/g;

  let formattedText = text;

  // Convert URLs to anchor tags
  formattedText = formattedText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline flex items-center gap-1">${url}<span class="inline-block"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></span></a>`;
  });

  // Convert bold text
  formattedText = formattedText.replace(boldRegex, "<strong>$1</strong>");

  // Process the text line by line
  const lines = formattedText.split("\n");
  let inList = false;
  let listType = "";
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check if line starts a numbered list
    if (/^\d+\.\s.+/.test(line)) {
      if (!inList || listType !== "ol") {
        if (inList) result.push(`</ul>`);
        result.push(`<ol class="list-decimal pl-5 my-1">`); // Reduced vertical spacing
        inList = true;
        listType = "ol";
      }
      line = `<li class="mb-0.5">${line.replace(/^\d+\.\s/, "")}</li>`; // Add small margin to list items
    }
    // Check if line starts a bullet list
    else if (/^[\*\•]\s.+/.test(line)) {
      if (!inList || listType !== "ul") {
        if (inList) result.push(`</ol>`);
        result.push(`<ul class="list-disc pl-5 my-1">`); // Reduced vertical spacing
        inList = true;
        listType = "ul";
      }
      line = `<li class="mb-0.5">${line.replace(/^[\*\•]\s/, "")}</li>`; // Add small margin to list items
    }
    // Empty line
    else if (line.trim() === "") {
      if (inList) {
        result.push(listType === "ol" ? "</ol>" : "</ul>");
        inList = false;
      }
      line = '<span class="block h-2"></span>'; // Reduced empty line height
    }
    // Regular text but we're in a list
    else if (inList) {
      result.push(listType === "ol" ? "</ol>" : "</ul>");
      inList = false;
    }

    result.push(line);
  }

  // Close any open list
  if (inList) {
    result.push(listType === "ol" ? "</ol>" : "</ul>");
  }

  return result.join("\n");
};

export default function ChatPage() {
  const { user } = useUser();
  const router = useRouter();
  const { lang } = useParams();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Asha AI, your ethical AI assistant. How can I help you today?",
      sender: "ai",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setSpeechSupported(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => prev + (prev ? " " + transcript : transcript));
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      // Step 1: If it's the very first user message (only greeting message exists)
      if (messages.length === 1) {
        setIsGeneratingTitle(true);

        // 1. First hit generate-title API
        const titleResponse = await fetch(`${AI_SERVER_URL}/generate-title`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: inputValue }),
        });

        if (!titleResponse.ok) {
          throw new Error("Failed to generate title");
        }

        const titleData = await titleResponse.json();
        const generatedTitle = titleData.title || "New Chat";
        setChatTitle(generatedTitle);

        // 2. Now hit asha-smart-query API with generated title
        const queryResponse = await fetch(`${AI_SERVER_URL}/asha-smart-query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: inputValue,
            user_id: user?.username,
            chat_title: generatedTitle,
          }),
        });

        if (!queryResponse.ok) {
          throw new Error("Failed to get AI response");
        }

        const queryData = await queryResponse.json();
        console.log("Response:", queryData);

        const aiMessage = {
          id: messages.length + 2,
          text: queryData.response || "No response from AI.",
          sender: "ai",
          isFormatted: true,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Step 2: For subsequent messages (normal chat flow)
        const response = await fetch(`${AI_SERVER_URL}/asha-smart-query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: inputValue,
            user_id: user?.username,
            chat_title: chatTitle,
          }),
        });

        const data = await response.json();
        const aiMessage = {
          id: messages.length + 2,
          text: data.response || "No response from AI.",
          sender: "ai",
          isFormatted: true,
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: messages.length + 2,
          text: "Something went wrong. Please try again later.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <header className="h-[5%] bg-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <h1 className="text-lg font-semibold text-primary-900">
            {isGeneratingTitle ? "Starting new chat..." : chatTitle}
          </h1>
        </div>
      </header>

      {/* Chat Content Area */}
      <div className="h-[85%] flex-1 overflow-y-auto p-2 md:p-4">
        {messages.length === 1 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="max-w-md w-full text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                <h2 className="text-lg font-medium text-primary-900 mb-2">
                  Welcome to Asha AI
                </h2>
                <p className="text-gray-700 mb-4">
                  I'm your ethical AI assistant. Ask me anything or start with
                  one of these:
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full text-left justify-start"
                    onClick={() =>
                      setInputValue("How can I improve my resume?")
                    }
                  >
                    How can I improve my resume?
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-left justify-start"
                    onClick={() =>
                      setInputValue("Career advice for women in tech")
                    }
                  >
                    Career advice for women in tech
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-left justify-start"
                    onClick={() => setInputValue("Work-life balance tips")}
                  >
                    Work-life balance tips
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.sender === "user"
                      ? "bg-primary-700 text-white"
                      : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                  }`}
                >
                  {message.isFormatted ? (
                    <div
                      className="whitespace-pre-wrap formatted-message text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(message.text),
                      }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">
                      {message.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="h-[10%] bg-white py-2 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-1">
            <div className="flex-1 bg-white rounded-lg border border-gray-300 overflow-hidden flex items-end">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 py-2 px-3 outline-none resize-none min-h-[38px] max-h-20 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={
                  inputValue.split("\n").length > 3
                    ? 3
                    : inputValue.split("\n").length || 1
                }
              />
              {speechSupported && (
                <button
                  onClick={toggleSpeechRecognition}
                  className={`p-1.5 rounded-full transition-colors ${
                    isListening
                      ? "text-red-500 animate-pulse bg-red-50"
                      : "text-gray-500 hover:text-primary-700 hover:bg-gray-100"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                  type="button"
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-primary-700 hover:bg-primary-800 text-white p-2 h-[38px] w-[38px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </Button>
          </div>
          <div className="mt-1 text-xs text-gray-500 text-center">
            Press Enter to send, Shift+Enter for new line
            {speechSupported && " • Click microphone for voice input"}
          </div>
        </div>
      </div>
    </div>
  );
}
