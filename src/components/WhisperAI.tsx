"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Zap, User, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function WhisperAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (data.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border border-teal-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.05)]">
      <div className="p-6 flex items-center justify-between border-b border-teal-500/10 bg-black/40">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-teal-500/5 border border-teal-500/20">
            <Zap size={16} className="text-teal-400" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white">Neural Mentor</h3>
            <p className="text-[9px] text-teal-500/60 uppercase tracking-widest font-medium">Protocol Active</p>
          </div>
        </div>
        <div className="flex gap-2 opacity-40">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse delay-150" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-none">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 rounded-full border border-teal-500/10 bg-teal-500/5 mx-auto flex items-center justify-center">
                <Brain size={32} className="text-teal-900" />
              </div>
              <p className="text-[10px] text-teal-800 leading-loose uppercase tracking-[0.6em] font-bold max-w-[160px] mx-auto">
                Consult the mentor. <br/> Interrogate the link.
              </p>
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-6 ${m.role === "assistant" ? "" : "flex-row-reverse"}`}
          >
            <div className={`mt-1 h-10 w-10 rounded-2xl flex items-center justify-center border border-teal-500/10 ${m.role === "assistant" ? "bg-black" : "bg-teal-500/5"}`}>
              {m.role === "assistant" ? <Zap size={14} className="text-teal-700" /> : <User size={14} className="text-teal-400" />}
            </div>
            <div className={`max-w-[80%] text-[13px] leading-relaxed p-5 rounded-[20px] ${m.role === "assistant" ? "text-zinc-400 bg-black border border-teal-500/10" : "text-white bg-teal-500/5 border border-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.05)]"}`}>
              {m.content}
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="flex gap-6">
            <div className="h-10 w-10 rounded-2xl flex items-center justify-center border border-teal-500/10 bg-black animate-pulse">
              <Zap size={14} className="text-teal-900" />
            </div>
            <div className="flex gap-2.5 items-center px-4">
              <div className="w-1.5 h-1.5 bg-teal-900 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-teal-900 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-teal-900 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-8 pt-4 bg-black border-t border-teal-500/10">
        <div className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Interrogate neural link..."
            className="w-full bg-black border border-teal-500/20 rounded-[18px] py-5 px-8 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-teal-500/40 focus:bg-teal-500/[0.02] transition-all font-light"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="absolute right-4 p-3.5 hover:bg-teal-500/10 rounded-2xl transition-all group active:scale-90"
          >
            <Send size={18} className="text-teal-900 group-hover:text-teal-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}

