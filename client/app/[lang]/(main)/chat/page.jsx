"use client";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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
  ExternalLink,
} from "lucide-react";

// Helper function to convert text to HTML with formatted elements
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
  const [chatTitle, setChatTitle] = useState("Asha AI Chat");
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const handleSendMessage = async () => {
  //   if (inputValue.trim()) {
  //     const userMessage = {
  //       id: messages.length + 1,
  //       text: inputValue,
  //       sender: "user",
  //     };

  //     setMessages((prevMessages) => [...prevMessages, userMessage]);
  //     setInputValue("");

  //     try {
  //       // Generate title if this is the first user message
  //       if (messages.length === 1) {
  //         setIsGeneratingTitle(true);
  //         const titleResponse = await fetch(
  //           "https://ashaai.onrender.com/generate-title",
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ message: inputValue }),
  //           }
  //         );

  //         const titleData = await titleResponse.json();
  //         if (titleData.title) {
  //           setChatTitle(titleData.title);
  //         }
  //       }

  //       // Get AI response
  //       const response = await fetch(
  //         "https://ashaai.onrender.com/asha-smart-query",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ query: inputValue }),
  //         }
  //       );

  //       const data = await response.json();
  //       const aiMessage = {
  //         id: messages.length + 2,
  //         text: data.response || "No response from AI.",
  //         sender: "ai",
  //         isFormatted: true,
  //       };

  //       setMessages((prevMessages) => [...prevMessages, aiMessage]);
  //     } catch (error) {
  //       console.error("Error:", error);
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         {
  //           id: messages.length + 2,
  //           text: "Something went wrong. Please try again later.",
  //           sender: "ai",
  //         },
  //       ]);
  //     } finally {
  //       setIsGeneratingTitle(false);
  //     }
  //   }
  // };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue("");

      try {
        // Generate title if this is the first user message
        if (messages.length === 1) {
          setIsGeneratingTitle(true);
          const titleResponse = await fetch(
            "https://ashaai.onrender.com/generate-title",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ message: inputValue }),
            }
          );

          const titleData = await titleResponse.json();
          if (titleData.title) {
            setChatTitle(titleData.title);
          }
        }

        // Get AI response with user data
        const response = await fetch(
          "https://ashaai.onrender.com/asha-smart-query",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: inputValue,
              user_id: user?.id || "anonymous",
              chat_title: chatTitle,
            }),
          }
        );

        const data = await response.json();
        const aiMessage = {
          id: messages.length + 2,
          text: data.response || "No response from AI.",
          sender: "ai",
          isFormatted: true,
        };

        setMessages((prevMessages) => [...prevMessages, aiMessage]);
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

  // const startNewChat = () => {
  //   setMessages([
  //     {
  //       id: 1,
  //       text: "Hello! I'm Asha AI, your ethical AI assistant. How can I help you today?",
  //       sender: "ai",
  //     },
  //   ]);
  //   setInputValue("");
  //   setFiles([]);
  //   setIsNewChat(true);
  // };

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
    setChatTitle("Asha AI Chat");
    setIsNewChat(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - Reduced padding */}
      {/* <header className="bg-white border-b border-gray-200 py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold text-primary-900">
            Asha AI Chat
          </h1>
          <Button
            onClick={startNewChat}
            className="bg-primary-700 hover:bg-primary-800 text-white flex items-center gap-2 h-8 px-3" // Reduced button size
            size="sm"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </header> */}
      <header className="bg-white border-b border-gray-200 py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold text-primary-900">
            {isGeneratingTitle ? "Generating title..." : chatTitle}
          </h1>
          <Button
            onClick={startNewChat}
            className="bg-primary-700 hover:bg-primary-800 text-white flex items-center gap-2 h-8 px-3"
            size="sm"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </header>
      {/* Chat Content Area - Reduced padding */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-2 md:p-4">
        {messages.length === 1 && !isNewChat ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="max-w-md w-full text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                <h2 className="text-lg font-medium text-primary-900 mb-2">
                  Welcome to Asha AI
                </h2>
                <p className="text-gray-700 mb-4">
                  I'm your ethical AI assistant. I can help answer questions,
                  assist with tasks, and respond to uploaded content.
                </p>
                <Button
                  onClick={startNewChat}
                  className="bg-primary-700 hover:bg-primary-800 text-white"
                  size="sm"
                >
                  Start New Chat
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-w-3xl mx-auto">
            {" "}
            {/* Reduced space between messages */}
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
                      className="whitespace-pre-wrap formatted-message text-sm" // Reduced text size
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(message.text),
                      }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">
                      {message.text}
                    </p> // Reduced text size
                  )}

                  {/* Display attached files - Reduced size */}
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.files.map((file) => (
                        <div key={file.id} className="relative">
                          {file.type.startsWith("image/") ? (
                            <div className="h-20 w-20 rounded-md overflow-hidden border border-gray-300">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                              <div className="text-xs text-center p-1">
                                <ImageIcon
                                  size={20}
                                  className="mx-auto mb-1 text-gray-500"
                                />
                                {file.name.length > 12
                                  ? file.name.substring(0, 9) + "..."
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

      {/* Input Area - Reduced height */}
      <div className="bg-white border-t border-gray-200 py-2 px-4">
        <div className="max-w-3xl mx-auto">
          {/* File previews - Reduced size */}
          {files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {files.map((file) => (
                <div key={file.id} className="relative">
                  {file.type.startsWith("image/") ? (
                    <div className="h-14 w-14 rounded-md overflow-hidden border border-gray-300">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 text-xs shadow-md"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="h-14 w-14 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 text-xs shadow-md"
                      >
                        <X size={10} />
                      </button>
                      <div className="text-xs text-center">
                        {file.name.length > 8
                          ? file.name.substring(0, 5) + "..."
                          : file.name}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Input with file upload and speech recognition - Reduced height */}
          <div className="flex items-end gap-1">
            <div className="flex-1 bg-white rounded-lg border border-gray-300 overflow-hidden flex items-end">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 py-2 px-3 outline-none resize-none min-h-[38px] max-h-20 text-sm" // Reduced padding and height
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
                accept="image/*"
              />
              <div className="flex items-center pr-1 gap-0.5">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="p-1.5 text-gray-500 hover:text-primary-700 rounded-full hover:bg-gray-100 transition-colors" // Reduced padding
                  title="Attach file"
                  type="button"
                >
                  <Upload size={16} /> {/* Reduced icon size */}
                </button>
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
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}{" "}
                    {/* Reduced icon size */}
                  </button>
                )}
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && files.length === 0}
              className="bg-primary-700 hover:bg-primary-800 text-white p-2 h-[38px] w-[38px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" // Reduced size
            >
              <Send size={16} /> {/* Reduced icon size */}
            </Button>
          </div>
          <div className="mt-1 text-xs text-gray-500 text-center">
            {" "}
            {/* Reduced margin */}
            Press Enter to send, Shift+Enter for new line
            {speechSupported && " • Click microphone for voice input"}
          </div>
        </div>
      </div>
    </div>
  );
}
