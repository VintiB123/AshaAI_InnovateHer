"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Image as ImageIcon,
  Send,
  Plus,
  X,
  Mic,
  MicOff,
} from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Asha AI, your ethical AI assistant. How can I help you today?",
      sender: "ai",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState([]);
  const [isNewChat, setIsNewChat] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() || files.length > 0) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
        files: files.length > 0 ? [...files] : undefined,
      };

      setMessages([...messages, newMessage]);
      setInputValue("");
      setFiles([]);

      // Simulate AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: "I've received your message! How can I assist you further?",
            sender: "ai",
          },
        ]);
      }, 1000);
    }
  };

  useEffect(() => {
    // Check if browser supports speech recognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setSpeechSupported(false);
      return;
    }

    // Initialize speech recognition
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

    recognitionRef.current.onend = () => {
      if (isListening) {
        recognitionRef.current.start();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition start failed:", error);
        setIsListening(false);
      }
    }
  };
  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Preview files
    const newFiles = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setFiles(files.filter((file) => file.id !== fileId));
  };

  const startNewChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm Asha AI, your ethical AI assistant. How can I help you today?",
        sender: "ai",
      },
    ]);
    setInputValue("");
    setFiles([]);
    setIsNewChat(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary-900">
            Asha AI Chat
          </h1>
          <Button
            onClick={startNewChat}
            className="bg-primary-700 hover:bg-primary-800 text-white flex items-center gap-2"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </header>

      {/* Chat Content Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length === 1 && !isNewChat ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="max-w-md w-full text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h2 className="text-xl font-medium text-primary-900 mb-2">
                  Welcome to Asha AI
                </h2>
                <p className="text-gray-700 mb-6">
                  I'm your ethical AI assistant. I can help answer questions,
                  assist with tasks, and respond to uploaded content.
                </p>
                <Button
                  onClick={startNewChat}
                  className="bg-primary-700 hover:bg-primary-800 text-white"
                >
                  Start New Chat
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-4 ${
                    message.sender === "user"
                      ? "bg-primary-700 text-white"
                      : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>

                  {/* Display attached files */}
                  {message.files && message.files.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.files.map((file) => (
                        <div key={file.id} className="relative">
                          {file.type.startsWith("image/") ? (
                            <div className="h-24 w-24 rounded-md overflow-hidden border border-gray-300">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                              <div className="text-xs text-center p-2">
                                <ImageIcon
                                  size={24}
                                  className="mx-auto mb-1 text-gray-500"
                                />
                                {file.name.length > 15
                                  ? file.name.substring(0, 12) + "..."
                                  : file.name}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          {/* File previews */}
          {files.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {files.map((file) => (
                <div key={file.id} className="relative">
                  {file.type.startsWith("image/") ? (
                    <div className="h-16 w-16 rounded-md overflow-hidden border border-gray-300">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs shadow-md"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs shadow-md"
                      >
                        <X size={12} />
                      </button>
                      <div className="text-xs text-center">
                        {file.name.length > 10
                          ? file.name.substring(0, 7) + "..."
                          : file.name}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Input with file upload and speech recognition */}
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-white rounded-lg border border-gray-300 overflow-hidden flex items-end">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 p-3 outline-none resize-none min-h-[44px] max-h-24"
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
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
                accept="image/*" // Added for better mobile UX
              />
              <div className="flex items-center pr-1 gap-0.5">
                {" "}
                {/* Improved spacing */}
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-gray-500 hover:text-primary-700 rounded-full hover:bg-gray-100 transition-colors"
                  title="Attach file"
                  type="button" // Added to prevent form submission
                >
                  <Upload size={20} />
                </button>
                {speechSupported && (
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`p-2 rounded-full transition-colors ${
                      isListening
                        ? "text-red-500 animate-pulse bg-red-50"
                        : "text-gray-500 hover:text-primary-700 hover:bg-gray-100"
                    }`}
                    title={isListening ? "Stop listening" : "Start voice input"}
                    type="button" // Added to prevent form submission
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                )}
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && files.length === 0} // Added disabled state
              className="bg-primary-700 hover:bg-primary-800 text-white p-3 h-[44px] w-[44px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send, Shift+Enter for new line
            {speechSupported && " • Click microphone for voice input"}
          </div>
        </div>
      </div>
    </div>
  );
}
