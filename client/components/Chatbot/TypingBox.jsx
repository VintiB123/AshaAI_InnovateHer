import { useLanguage } from "@/context/LanguageContext";
import { Mic, AudioLines } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export const TypingBox = ({ setMessage, loading, setLoading }) => {
  const [question, setQuestion] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognition = useRef(null);
  const audioRef = useRef(null);
  const { dict } = useLanguage();

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.lang = "en-US";
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const speechToText =
          event.results[event.results.length - 1][0].transcript;
        setQuestion(speechToText);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    recognition.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.current.stop();
  };

  const handleAsk = async () => {
    if (question.trim() === "") {
      toast.warning("Please ask a question");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: question.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(
          typeof errorData.detail === "string"
            ? errorData.detail
            : "Failed to get response"
        );
        console.error("Request failed with status", response.status, errorData);
        return;
      }

      const result = await response.json();

      if (result.audio_file) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(result.audio_file), (c) => c.charCodeAt(0))],
          { type: "audio/mpeg" }
        );
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        audio.play();

        audio.addEventListener("play", () => {
          document.dispatchEvent(new CustomEvent("startDoctorAnimation"));
        });

        audio.addEventListener("ended", () => {
          document.dispatchEvent(new CustomEvent("stopDoctorAnimation"));
          URL.revokeObjectURL(audioUrl);
        });
      }

      if (result.assistant_reply) {
        setMessage(result.assistant_reply);
      }

      setQuestion("");
    } catch (error) {
      toast.error("Error processing request");
      console.error("Error in chat request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-10 max-w-4xl flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <h2 className="text-white font-bold text-xl">{dict?.chatbot?.title}</h2>
        <p className="text-white/65">{dict?.chatbot?.desc}</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-white"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex items-center">
          <div className="flex gap-4">
            {isRecording ? (
              <button
                className="h-10 w-10 bg-blue-400 p-2 rounded-full text-white flex items-center justify-center gap-x-0.5"
                onClick={stopRecording}
              >
                <div className="line h-1/2 w-1.5 bg-white rounded-xl animate-bounce" />
                <div className="line h-5/6 w-1.5 bg-white rounded-xl animate-bounce delay-100" />
                <div className="line h-3/5 w-1.5 bg-white rounded-xl animate-bounce delay-200" />
                <div className="line h-2/3 w-1.5 bg-white rounded-xl animate-bounce delay-300" />
                <div className="line h-1/2 w-1.5 bg-white rounded-xl animate-bounce delay-400" />
              </button>
            ) : (
              <button
                className="bg-[#A294F9] p-2 rounded-full text-white flex items-center justify-center"
                onClick={startRecording}
              >
                <Mic />
              </button>
            )}
          </div>
          <input
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder={dict?.chatbot?.placeholder}
            id="chat-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
          />
          <button
            className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
            onClick={handleAsk}
          >
            {dict?.chatbot?.ask}
          </button>
          <audio ref={audioRef} />
        </div>
      )}
    </div>
  );
};
