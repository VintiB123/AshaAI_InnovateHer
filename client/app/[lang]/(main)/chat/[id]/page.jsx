// "use client";
// import { useState, useRef, useEffect, use } from "react";
// import { useUser } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { AI_SERVER_URL } from "@/constants/utils.js";
// import {
//   Upload,
//   Image as ImageIcon,
//   Send,
//   Plus,
//   X,
//   Mic,
//   MicOff,
//   ExternalLink,
// } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";

// // Helper function to convert text to HTML with formatted elements - reused from your ChatPage
// const formatMessage = (text) => {
//   if (!text) return null;

//   // Handle numbered lists (like "1. Item")
//   const hasNumberedList = /^\d+\.\s.+/m.test(text);

//   // Handle bullet points (like "* Item" or "• Item")
//   const hasBulletList = /^[\*\•]\s.+/m.test(text);

//   // Handle URLs to make them clickable
//   const urlRegex = /(https?:\/\/[^\s]+)/g;

//   // Handle bold text (like **text**)
//   const boldRegex = /\*\*(.*?)\*\*/g;

//   let formattedText = text;

//   // Convert URLs to anchor tags
//   formattedText = formattedText.replace(urlRegex, (url) => {
//     return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline flex items-center gap-1">${url}<span class="inline-block"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></span></a>`;
//   });

//   // Convert bold text
//   formattedText = formattedText.replace(boldRegex, "<strong>$1</strong>");

//   // Process the text line by line
//   const lines = formattedText.split("\n");
//   let inList = false;
//   let listType = "";
//   let result = [];

//   for (let i = 0; i < lines.length; i++) {
//     let line = lines[i];

//     // Check if line starts a numbered list
//     if (/^\d+\.\s.+/.test(line)) {
//       if (!inList || listType !== "ol") {
//         if (inList) result.push(`</ul>`);
//         result.push(`<ol class="list-decimal pl-5 my-1">`);
//         inList = true;
//         listType = "ol";
//       }
//       line = `<li class="mb-0.5">${line.replace(/^\d+\.\s/, "")}</li>`;
//     }
//     // Check if line starts a bullet list
//     else if (/^[\*\•]\s.+/.test(line)) {
//       if (!inList || listType !== "ul") {
//         if (inList) result.push(`</ol>`);
//         result.push(`<ul class="list-disc pl-5 my-1">`);
//         inList = true;
//         listType = "ul";
//       }
//       line = `<li class="mb-0.5">${line.replace(/^[\*\•]\s/, "")}</li>`;
//     }
//     // Empty line
//     else if (line.trim() === "") {
//       if (inList) {
//         result.push(listType === "ol" ? "</ol>" : "</ul>");
//         inList = false;
//       }
//       line = '<span class="block h-2"></span>';
//     }
//     // Regular text but we're in a list
//     else if (inList) {
//       result.push(listType === "ol" ? "</ol>" : "</ul>");
//       inList = false;
//     }

//     result.push(line);
//   }

//   // Close any open list
//   if (inList) {
//     result.push(listType === "ol" ? "</ol>" : "</ul>");
//   }

//   return result.join("\n");
// };

// export default function ChatDetailPage() {
//   const params = useParams();
//   const { lang } = useParams();
//   const router = useRouter();
//   const { user } = useUser();
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [chatTitle, setChatTitle] = useState("");
//   const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
//   const fileInputRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);
//   const [isListening, setIsListening] = useState(false);
//   const [speechSupported, setSpeechSupported] = useState(true);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchChatData = async () => {
//       if (!user || !params.id) return;

//       try {
//         setLoading(true);

//         const response = await fetch(
//           `${AI_SERVER_URL}/chat-history?user_id=${user?.username}`
//         );

//         if (!response.ok) throw new Error("Failed to fetch chat history");

//         const data = await response.json();

//         // Get title from URL params (decoded)
//         const searchParams = new URLSearchParams(window.location.search);
//         const titleParam = searchParams.get("title")?.replace(/\+/g, " ");

//         // Create matching function
//         const matchesChat = (chatTitle) => {
//           const formatsToTry = [
//             chatTitle, // Original title
//             chatTitle.toLowerCase(), // Lowercase version
//             chatTitle.replace(/\s+/g, "-"), // With hyphens
//             chatTitle.replace(/\s+/g, "-").toLowerCase(), // Hyphens + lowercase
//             encodeURIComponent(chatTitle.replace(/\s+/g, "+")), // URL encoded
//           ];

//           return formatsToTry.some(
//             (format) => format === params.id || format === titleParam
//           );
//         };

//         const chat = data.chats.find((c) => matchesChat(c.title));

//         if (!chat) {
//           console.error("Chat not found", {
//             searchingFor: params.id,
//             titleParam,
//             availableChats: data.chats.map((c) => c.title),
//           });
//           router.push(`${lang}/chat`);
//           return;
//         }

//         setChatTitle(chat.title);
//         setMessages(
//           chat.history.map((msg, index) => ({
//             id: index + 1,
//             text: msg.content,
//             sender: msg.role === "user" ? "user" : "ai",
//             isFormatted: msg.role === "assistant",
//             urls: msg.urls || [],
//           }))
//         );
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChatData();
//   }, [params.id, user, router]);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (inputValue.trim()) {
//       const userMessage = {
//         id: messages.length + 1,
//         text: inputValue,
//         sender: "user",
//       };

//       setMessages((prevMessages) => [...prevMessages, userMessage]);
//       setInputValue("");

//       try {
//         // Get AI response with user data
//         const response = await fetch(`${AI_SERVER_URL}/asha-smart-query`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             query: inputValue,
//             user_id: user?.username,
//             chat_title: chatTitle,
//           }),
//         });

//         const data = await response.json();
//         const aiMessage = {
//           id: messages.length + 2,
//           text: data.response || "No response from AI.",
//           sender: "ai",
//           isFormatted: true,
//           urls: data.urls || [],
//         };

//         setMessages((prevMessages) => [...prevMessages, aiMessage]);
//       } catch (error) {
//         console.error("Error:", error);
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           {
//             id: messages.length + 2,
//             text: "Something went wrong. Please try again later.",
//             sender: "ai",
//           },
//         ]);
//       }
//     }
//   };

//   const toggleSpeechRecognition = () => {
//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       try {
//         recognitionRef.current.start();
//         setIsListening(true);
//       } catch (error) {
//         console.error("Speech recognition start failed:", error);
//         setIsListening(false);
//       }
//     }
//   };

//   const handleFileUpload = (e) => {
//     const selectedFiles = Array.from(e.target.files);

//     // Preview files
//     const newFiles = selectedFiles.map((file) => ({
//       id: Math.random().toString(36).substring(2),
//       name: file.name,
//       type: file.type,
//       url: URL.createObjectURL(file),
//       file: file,
//     }));

//     setFiles((prev) => [...prev, ...newFiles]);
//   };

//   const removeFile = (fileId) => {
//     setFiles(files.filter((file) => file.id !== fileId));
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col h-screen bg-transparent items-center justify-center">
//         <p className="text-primary-700">Loading chat...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full bg-transparent overflow-hidden">
//       {/* Header */}
//       <header className="h-[5%] bg-white  py-2 px-4 ">
//         <div className="max-w-7xl mx-auto flex justify-center items-center">
//           <h1 className="text-lg font-semibold text-primary-900">
//             {chatTitle}
//           </h1>
//         </div>
//       </header>

//       {/* Chat Content Area */}
//       <div
//         ref={chatContainerRef}
//         className="h-[85%] flex-1 overflow-y-auto p-2 md:p-4"
//       >
//         <div className="space-y-2 max-w-3xl mx-auto">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${
//                 message.sender === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-[85%] rounded-lg px-3 py-2 ${
//                   message.sender === "user"
//                     ? "bg-primary-700 text-white"
//                     : "bg-white text-gray-900 border border-gray-200 shadow-sm"
//                 }`}
//               >
//                 {message.isFormatted ? (
//                   <div
//                     className="whitespace-pre-wrap formatted-message text-sm"
//                     dangerouslySetInnerHTML={{
//                       __html: formatMessage(message.text),
//                     }}
//                   />
//                 ) : (
//                   <p className="whitespace-pre-wrap text-sm">{message.text}</p>
//                 )}

//                 {/* Display attached files */}
//                 {message.files && message.files.length > 0 && (
//                   <div className="mt-2 flex flex-wrap gap-1">
//                     {message.files.map((file) => (
//                       <div key={file.id} className="relative">
//                         {file.type.startsWith("image/") ? (
//                           <div className="h-20 w-20 rounded-md overflow-hidden border border-gray-300">
//                             <img
//                               src={file.url}
//                               alt={file.name}
//                               className="h-full w-full object-cover"
//                             />
//                           </div>
//                         ) : (
//                           <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
//                             <div className="text-xs text-center p-1">
//                               <ImageIcon
//                                 size={20}
//                                 className="mx-auto mb-1 text-gray-500"
//                               />
//                               {file.name.length > 12
//                                 ? file.name.substring(0, 9) + "..."
//                                 : file.name}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Input Area */}
//       <div className="h-[10%] bg-white py-2 px-4">
//         <div className="max-w-3xl mx-auto">
//           {/* File previews */}
//           {files.length > 0 && (
//             <div className="mb-2 flex flex-wrap gap-1">
//               {files.map((file) => (
//                 <div key={file.id} className="relative">
//                   {file.type.startsWith("image/") ? (
//                     <div className="h-14 w-14 rounded-md overflow-hidden border border-gray-300">
//                       <img
//                         src={file.url}
//                         alt={file.name}
//                         className="h-full w-full object-cover"
//                       />
//                       <button
//                         onClick={() => removeFile(file.id)}
//                         className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 text-xs shadow-md"
//                       >
//                         <X size={10} />
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="h-14 w-14 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
//                       <button
//                         onClick={() => removeFile(file.id)}
//                         className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 text-xs shadow-md"
//                       >
//                         <X size={10} />
//                       </button>
//                       <div className="text-xs text-center">
//                         {file.name.length > 8
//                           ? file.name.substring(0, 5) + "..."
//                           : file.name}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Input with file upload and speech recognition */}
//           <div className="flex items-end gap-1">
//             <div className="flex-1 bg-white rounded-lg border border-gray-300 overflow-hidden flex items-center">
//               <textarea
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 placeholder="Type your message here..."
//                 className="flex-1 py-2 px-3 outline-none resize-none min-h-[38px] max-h-20 text-sm"
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSendMessage();
//                   }
//                 }}
//                 rows={
//                   inputValue.split("\n").length > 3
//                     ? 3
//                     : inputValue.split("\n").length || 1
//                 }
//               />
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileUpload}
//                 className="hidden"
//                 multiple
//                 accept="image/*"
//               />
//               <div className="flex items-center pr-1 gap-0.5">
//                 <button
//                   onClick={() => fileInputRef.current.click()}
//                   className="p-1.5 text-gray-500 hover:text-primary-700 rounded-full hover:bg-gray-100 transition-colors"
//                   title="Attach file"
//                   type="button"
//                 >
//                   <Upload size={16} />
//                 </button>
//                 {speechSupported && (
//                   <button
//                     onClick={toggleSpeechRecognition}
//                     className={`p-1.5 rounded-full transition-colors ${
//                       isListening
//                         ? "text-red-500 animate-pulse bg-red-50"
//                         : "text-gray-500 hover:text-primary-700 hover:bg-gray-100"
//                     }`}
//                     title={isListening ? "Stop listening" : "Start voice input"}
//                     type="button"
//                   >
//                     {isListening ? <MicOff size={16} /> : <Mic size={16} />}
//                   </button>
//                 )}
//               </div>
//             </div>
//             <Button
//               onClick={handleSendMessage}
//               disabled={!inputValue.trim() && files.length === 0}
//               className="bg-primary-700 hover:bg-primary-800 text-white p-2 h-[38px] w-[38px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Send size={16} />
//             </Button>
//           </div>
//           <div className="mt-1 text-xs text-gray-500 text-center">
//             Press Enter to send, Shift+Enter for new line
//             {speechSupported && " • Click microphone for voice input"}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AI_SERVER_URL } from "@/constants/utils.js";
import { Send, Mic, MicOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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
        result.push(`<ol class="list-decimal pl-5 my-1">`);
        inList = true;
        listType = "ol";
      }
      line = `<li class="mb-0.5">${line.replace(/^\d+\.\s/, "")}</li>`;
    }
    // Check if line starts a bullet list
    else if (/^[\*\•]\s.+/.test(line)) {
      if (!inList || listType !== "ul") {
        if (inList) result.push(`</ol>`);
        result.push(`<ul class="list-disc pl-5 my-1">`);
        inList = true;
        listType = "ul";
      }
      line = `<li class="mb-0.5">${line.replace(/^[\*\•]\s/, "")}</li>`;
    }
    // Empty line
    else if (line.trim() === "") {
      if (inList) {
        result.push(listType === "ol" ? "</ol>" : "</ul>");
        inList = false;
      }
      line = '<span class="block h-2"></span>';
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

export default function ChatDetailPage() {
  const params = useParams();
  const { lang } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatTitle, setChatTitle] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchChatData = async () => {
      if (!user || !params.id) return;

      try {
        setLoading(true);

        const response = await fetch(
          `${AI_SERVER_URL}/chat-history?user_id=${user?.username}`
        );

        if (!response.ok) throw new Error("Failed to fetch chat history");

        const data = await response.json();

        // Get title from URL params (decoded)
        const searchParams = new URLSearchParams(window.location.search);
        const titleParam = searchParams.get("title")?.replace(/\+/g, " ");

        // Create matching function
        const matchesChat = (chatTitle) => {
          const formatsToTry = [
            chatTitle, // Original title
            chatTitle.toLowerCase(), // Lowercase version
            chatTitle.replace(/\s+/g, "-"), // With hyphens
            chatTitle.replace(/\s+/g, "-").toLowerCase(), // Hyphens + lowercase
            encodeURIComponent(chatTitle.replace(/\s+/g, "+")), // URL encoded
          ];

          return formatsToTry.some(
            (format) => format === params.id || format === titleParam
          );
        };

        const chat = data.chats.find((c) => matchesChat(c.title));

        if (!chat) {
          console.error("Chat not found", {
            searchingFor: params.id,
            titleParam,
            availableChats: data.chats.map((c) => c.title),
          });
          router.push(`${lang}/chat`);
          return;
        }

        setChatTitle(chat.title);
        setMessages(
          chat.history.map((msg, index) => ({
            id: index + 1,
            text: msg.content,
            sender: msg.role === "user" ? "user" : "ai",
            isFormatted: msg.role === "assistant",
            urls: msg.urls || [],
          }))
        );
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [params.id, user, router]);

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
    if (inputValue.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue("");

      try {
        // Get AI response with user data
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
          urls: data.urls || [],
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
      }
    }
  };

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

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-transparent items-center justify-center">
        <p className="text-primary-700">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Header */}
      <header className="h-[5%] bg-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <h1 className="text-xs font-medium text-primary-900 sm:text-sm md:text-base lg:text-lg">
            {chatTitle}
          </h1>
        </div>
      </header>
      {/* Chat Content Area */}
      <div
        ref={chatContainerRef}
        className="h-[85%] flex-1 overflow-y-auto p-2 md:p-4"
      >
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
                  <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="h-[10%] bg-white py-2 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-1">
            <div className="flex-1 bg-white rounded-lg border border-gray-300 overflow-hidden flex items-center">
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
