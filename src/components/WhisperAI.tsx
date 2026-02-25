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
    <div className="flex flex-col h-full bg-[#09090B] shadow-[-20px_0_60px_rgba(0,0,0,0.8)] border-l border-white/5">
      <div className="p-8 pb-6 flex items-center justify-between border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Zap size={16} className="text-indigo-400" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white">Neural Mentor</h3>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium">Clear Focus Interface</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse delay-150" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-none">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 rounded-full border border-white/5 bg-white/[0.02] mx-auto flex items-center justify-center">
                <Brain size={32} className="text-zinc-800" />
              </div>
              <p className="text-[10px] text-zinc-600 leading-loose uppercase tracking-[0.6em] font-light max-w-[160px] mx-auto">
                Consult the mentor. Interrogate the link.
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
            <div className={`mt-1 h-10 w-10 rounded-2xl flex items-center justify-center border border-white/5 ${m.role === "assistant" ? "bg-white/[0.03]" : "bg-indigo-500/10 border-indigo-500/20"}`}>
              {m.role === "assistant" ? <Zap size={14} className="text-zinc-500" /> : <User size={14} className="text-indigo-400" />}
            </div>
            <div className={`max-w-[80%] text-[13px] leading-relaxed p-5 rounded-[24px] ${m.role === "assistant" ? "text-zinc-300 bg-white/[0.02] border border-white/5" : "text-zinc-100 bg-indigo-500/10 border border-indigo-500/20 shadow-xl"}`}>
              {m.content}
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="flex gap-6">
            <div className="h-10 w-10 rounded-2xl flex items-center justify-center border border-white/5 bg-white/[0.03] animate-pulse">
              <Zap size={14} className="text-zinc-700" />
            </div>
            <div className="flex gap-2.5 items-center px-4 opacity-40">
              <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-8 pt-4 bg-transparent">
        <div className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Interrogate neural link..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] py-5 px-8 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/10 focus:bg-white/[0.05] transition-all font-light shadow-2xl"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="absolute right-4 p-3.5 hover:bg-white/10 rounded-2xl transition-all group active:scale-90"
          >
            <Send size={18} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}

