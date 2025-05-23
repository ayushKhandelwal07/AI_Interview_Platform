"use client"

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "user", content: "Hi, I'm ready for the interview." }
  ]);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSpeak = () => {
    if (isListening) return;
    
    setError("");
    setIsListening(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setError("");
    };

    recognition.onresult = async (event) => {
      const spoken = event.results[0][0].transcript;
      if (spoken.trim()) {
        setTranscript(spoken);
        await sendToBot(spoken);
      } else {
        setError("No speech detected. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setIsListening(false);
      
      switch(e.error) {
        case 'no-speech':
          setError("No speech detected. Please try again.");
          break;
        case 'audio-capture':
          setError("No microphone detected. Please check your microphone settings.");
          break;
        case 'not-allowed':
          setError("Microphone access denied. Please allow microphone access.");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setError("Failed to start speech recognition. Please try again.");
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if (!text) return;
    
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1.0;
    speech.pitch = 1.0;
    
    speech.onerror = (e) => {
      console.error("Speech synthesis error:", e);
      setError("Failed to speak response. Please try again.");
    };
    
    window.speechSynthesis.speak(speech);
  };

  const sendToBot = async (text) => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);

    try {
      setIsTyping(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || `HTTP error! status: ${res.status}`);
      }
      
      if (!data.response) {
        throw new Error("No response received from the server");
      }

      speak(data.response);
      setMessages([...newMessages, { role: "model", content: data.response }]);
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = "Failed to get response. Please try again.";
      
      if (error.message.includes("API key not configured")) {
        errorMessage = "API key not configured. Please check your environment variables.";
      } else if (error.message.includes("Invalid request")) {
        errorMessage = "Invalid request format. Please try again.";
      }
      
      setError(errorMessage);
      speak("I apologize, but I encountered an error. Could you please try again?");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-8 font-sans">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">
            🤖 AI Software Engineering Interview
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Practice your technical interview skills with our AI interviewer
          </p>
          
          <div className="flex flex-col items-center gap-4 mb-6">
            <button
              onClick={handleSpeak}
              disabled={loading || isListening}
              className={`px-6 py-3 rounded-full text-white font-semibold transition-all transform hover:scale-105
                ${loading || isListening 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {isListening ? "🎤 Listening..." : loading ? "⏳ Processing..." : "🎤 Start Speaking"}
            </button>
            
            {error && (
              <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>

          {transcript && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <strong className="text-blue-700">Your Answer:</strong>
              <p className="mt-2 text-blue-600 italic">{transcript}</p>
            </div>
          )}

          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4 bg-gray-50 rounded-lg">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-50 ml-12 border border-blue-100"
                    : "bg-white mr-12 border border-gray-200"
                }`}
              >
                <div className="font-semibold text-sm mb-1 text-gray-700">
                  {msg.role === "user" ? "You" : "Interviewer"}:
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">{msg.content}</div>
              </div>
            ))}
            {isTyping && (
              <div className="bg-white mr-12 p-4 rounded-lg border border-gray-200">
                <div className="font-semibold text-sm mb-1 text-gray-700">Interviewer:</div>
                <div className="text-gray-700">Typing<span className="animate-pulse">...</span></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
