"use client";

import { useEffect, useState } from "react";
import { StickyNote } from "lucide-react";

export default function StickyNotes() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("deep-work-brain-dump");
    if (saved) {
      setContent(saved);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    localStorage.setItem("deep-work-brain-dump", newContent);
  };

  return (
    <div className="flex flex-col h-full bg-[#0C0C0E] p-10 rounded-[40px] group shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] overflow-hidden relative border border-white/10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 group-hover:bg-white/5 transition-all">
            <StickyNote size={16} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">Neural Dump</h3>
            <p className="text-[8px] text-zinc-600 uppercase tracking-widest font-medium">Capture Distraction</p>
          </div>
        </div>
        <div className="h-6 w-px bg-white/5" />
      </div>
      
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Type a thought. Neutralize a distraction..."
        className="flex-1 w-full bg-transparent border-none resize-none text-[15px] text-zinc-300 placeholder:text-zinc-800 focus:ring-0 text-sm leading-relaxed font-light caret-indigo-500"
      />
      
      <div className="mt-6 flex justify-between items-center text-[9px] text-zinc-800 uppercase tracking-[0.4em] font-bold">
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30 animate-pulse" />
          Local Sync
        </span>
        <span className="opacity-40 italic font-medium lowercase tracking-normal">Auto-Saving.</span>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}

