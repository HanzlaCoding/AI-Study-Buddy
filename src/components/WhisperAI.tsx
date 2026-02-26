"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";

interface WhisperAIProps {
  onClose?: () => void;
}

export default function WhisperAI({ onClose }: WhisperAIProps) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent font-sans">
      <div className="p-6 md:p-8 pb-4 md:pb-6 flex items-center justify-between bg-transparent shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <h3 className="text-xs tracking-widest text-zinc-400 uppercase font-medium">Study Assistant</h3>
        </div>
        <div className="flex items-center">
          {onClose && (
            <button 
              onClick={onClose}
              className="ml-2 p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-600 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 md:space-y-12 scrollbar-none min-h-0">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <Sparkles size={28} className="text-zinc-500 md:size-8 opacity-50" />
            <p className="text-sm text-zinc-400 font-light">
              How can I help you focus today?
            </p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 md:gap-5 ${m.role === "assistant" ? "" : "flex-row-reverse"}`}
          >
            <div className={`mt-1 font-bold text-xs uppercase tracking-widest ${m.role === "assistant" ? "text-zinc-500" : "text-[#8c25f4]"}`}>
              {m.role === "assistant" ? "AI" : "YOU"}
            </div>
            <div className={`text-[14px] md:text-[15px] leading-relaxed font-normal ${m.role === "assistant" ? "text-zinc-300" : "text-white"}`}>
              {m.content}
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 md:gap-6">
            <div className="h-10 w-10 flex items-center justify-center">
              <Sparkles size={16} className="text-zinc-500 animate-pulse" />
            </div>
            <div className="flex gap-3 items-center px-6 opacity-30">
              <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 pt-2 md:pt-4 bg-transparent shrink-0">
         <div className="relative flex items-center group bg-white/5 border border-white/10 rounded-full transition-all duration-300 focus-within:bg-white/10 focus-within:border-white/20">
           <input
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
             placeholder="Ask a question..."
             className="w-full bg-transparent py-3 pl-5 pr-12 text-sm md:text-[15px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none transition-all font-normal"
           />
           <button
             onClick={sendMessage}
             disabled={isLoading}
             className="absolute right-2 p-2 hover:bg-white/10 rounded-full transition-all duration-300 group active:scale-95 flex items-center justify-center"
           >
             <Send size={16} className="text-zinc-400 group-focus-within:text-zinc-200 transition-colors" />
           </button>
         </div>
       </div>
    </div>
  );
}
