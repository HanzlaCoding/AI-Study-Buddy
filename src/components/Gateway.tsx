"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Link, Sparkles, HelpCircle, Zap, Command, CheckSquare, Brain } from "lucide-react";

interface GatewayProps {
  onEnter: (url: string) => void;
  onDurationChange: (mins: number) => void;
  duration: number;
}

export default function Gateway({ onEnter, onDurationChange, duration }: GatewayProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (url.trim()) {
      onEnter(url);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-8 relative overflow-hidden bg-[#000000] text-white selection:bg-indigo-500/30 font-sans">
      {/* Liquid Flow Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Layer 1: Core Teal Flow */}
        <motion.div
          animate={{
            x: ["-25%", "25%", "-10%", "-25%"],
            y: ["-20%", "20%", "40%", "-20%"],
            scale: [1, 1.4, 1.1, 1],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] rounded-full bg-gradient-to-br from-teal-400/20 via-emerald-600/10 to-transparent blur-[120px]"
        />

        {/* Layer 2: Deep Indigo Counter-Flow */}
        <motion.div
          animate={{
            x: ["20%", "-20%", "10%", "20%"],
            y: ["10%", "-10%", "-30%", "10%"],
            scale: [1.3, 1, 1.5, 1.3],
            rotate: [0, -90, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[130%] h-[130%] rounded-full bg-gradient-to-tl from-indigo-500/20 via-blue-600/10 to-transparent blur-[140px]"
        />

        {/* Layer 3: Cyan Accent Pulse */}
        <motion.div
          animate={{
            scale: [0.8, 1.5, 1, 0.8],
            opacity: [0.2, 0.5, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/3 w-[50%] h-[50%] rounded-full bg-cyan-300/10 blur-[90px]"
        />

        {/* Mask Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center px-4 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer text-white">
          <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 group-hover:bg-indigo-500/40 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Zap size={18} className="text-indigo-400 fill-indigo-400/20" />
          </div>
          <span className="text-lg font-semibold tracking-tight">FlowState</span>
        </div>
        
        <nav className="flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Methodology</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <div className="w-px h-4 bg-zinc-800" />
          <a href="#" className="hover:text-white transition-colors text-white">Log In</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-2xl text-center space-y-10">
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-bold tracking-tight text-white font-premium drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Enter Flow State
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg font-light tracking-wide max-w-lg mx-auto"
            >
              Turn any lecture into actionable knowledge. Distraction-free.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <form 
              onSubmit={handleSubmit}
              className="relative flex items-center bg-[#0C0C0E]/90 backdrop-blur-2xl border border-white/[0.08] rounded-full p-2.5 focus-within:border-white/[0.15] focus-within:bg-[#0E0E10] transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
            >
              <div className="pl-6 pr-4 text-zinc-500">
                <Link size={18} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube Lecture URL..."
                className="flex-1 bg-transparent border-none py-3 text-white placeholder:text-zinc-600 focus:ring-0 text-[15px]"
              />
              <div className="flex items-center gap-3 pr-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                  <Command size={10} /> <span>V</span>
                </div>
                <button
                  type="submit"
                  className="p-3.5 rounded-full bg-zinc-800 hover:bg-white hover:text-black transition-all active:scale-90"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>

            <div className="flex flex-col items-center gap-8 pt-6">
              <div className="flex items-center gap-3 p-1.5 glass rounded-[24px] border border-white/[0.05] shadow-inner">
                {[25, 50, 90].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => onDurationChange(mins)}
                    className={`px-5 py-2.5 rounded-[18px] text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                      duration === mins 
                        ? "bg-white text-black shadow-xl scale-100" 
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5 active:scale-95"
                    }`}
                  >
                    {mins}M
                  </button>
                ))}
                <div className="w-px h-6 bg-white/10 mx-1" />
                <div className="relative group">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => onDurationChange(parseInt(e.target.value) || 0)}
                    placeholder="Custom"
                    className="w-20 bg-white/5 border border-white/10 rounded-[18px] py-2.5 px-4 text-[10px] font-bold text-center text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500/40"></span>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-[0.5em] font-bold opacity-60">Set Neural Protocol Duration</p>
            </div>

            <div className="flex justify-center items-center gap-8 text-[11px] font-medium text-zinc-700 uppercase tracking-widest pt-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-zinc-800" />
                <span>AI Summary</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-900" />
              <div className="flex items-center gap-2">
                <CheckSquare size={14} className="text-zinc-800" />
                <span>Auto-Quiz</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-900" />
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-zinc-800" />
                <span>Instant Focus</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 flex justify-between items-end px-4 w-full max-w-[1600px] mx-auto pb-4">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-800 font-bold">System Status</span>
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
            </div>
            <span className="text-xs text-zinc-500 font-medium tracking-tight">Operational</span>
          </div>
        </div>
        
        <button className="p-3 rounded-full bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800 transition-all group">
          <HelpCircle size={18} className="text-zinc-600 group-hover:text-zinc-400" />
        </button>
      </footer>

      {/* Subtle Noise */}
      <div className="noise opacity-5" />
    </div>
  );
}
