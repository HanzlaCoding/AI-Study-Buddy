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
    <div className="min-h-screen flex flex-col p-8 relative overflow-hidden bg-black text-white selection:bg-teal-500/30 font-sans">
      {/* Liquid Flow Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
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
          className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] rounded-full bg-gradient-to-br from-teal-900/30 via-emerald-950/20 to-transparent blur-[140px]"
        />

        {/* Mask Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-black/80 pointer-events-none" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center px-4 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer text-white">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 group-hover:bg-teal-500/20 transition-all shadow-[0_0_20px_rgba(20,184,166,0.1)]">
            <Zap size={18} className="text-teal-400 fill-teal-400/20" />
          </div>
          <span className="text-lg font-bold tracking-tight uppercase tracking-[0.2em]">FlowState<span className="text-teal-500">.</span></span>
        </div>
        
        <nav className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-teal-900">
          <a href="#" className="hover:text-teal-400 transition-colors">Protocol</a>
          <a href="#" className="hover:text-teal-400 transition-colors">Neural Sync</a>
          <div className="w-px h-4 bg-teal-900/20" />
          <a href="#" className="hover:text-teal-400 transition-colors text-white">Console</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-2xl text-center space-y-12">
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_80px_rgba(20,184,166,0.15)] uppercase"
            >
              Hyper<span className="text-teal-500">Focus</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-teal-900 text-[11px] font-black tracking-[0.6em] max-w-lg mx-auto uppercase leading-loose"
            >
              Neural calibration for modern lecture consumption. <br/> Zero distraction. Maximum retention.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <form 
              onSubmit={handleSubmit}
              className="relative flex items-center bg-black border border-teal-500/20 rounded-2xl p-3 focus-within:border-teal-500/50 focus-within:bg-teal-500/[0.02] transition-all shadow-[0_0_100px_rgba(0,0,0,1)]"
            >
              <div className="pl-6 pr-4 text-teal-900">
                <Link size={18} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="INPUT YOUTUBE PROTOCOL URL..."
                className="flex-1 bg-transparent border-none py-3 text-white placeholder:text-teal-950 focus:ring-0 text-sm font-bold tracking-widest uppercase"
              />
              <div className="flex items-center gap-3 pr-2">
                <button
                  type="submit"
                  className="p-4 rounded-xl bg-teal-500 text-black hover:bg-teal-400 transition-all active:scale-90 shadow-[0_0_30px_rgba(45,212,191,0.3)]"
                >
                  <ArrowRight size={20} strokeWidth={3} />
                </button>
              </div>
            </form>

            <div className="flex flex-col items-center gap-8 pt-8">
              <div className="flex items-center gap-4 p-2 bg-black border border-teal-500/10 rounded-2xl shadow-inner">
                {[25, 50, 90].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => onDurationChange(mins)}
                    className={`px-6 py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
                      duration === mins 
                        ? "bg-teal-500 text-black shadow-[0_0_20px_rgba(45,212,191,0.3)] scale-100" 
                        : "text-teal-900 hover:text-teal-400 hover:bg-teal-500/5 active:scale-95"
                    }`}
                  >
                    {mins}M
                  </button>
                ))}
                <div className="w-px h-8 bg-teal-500/10 mx-2" />
                <div className="relative group">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => onDurationChange(parseInt(e.target.value) || 0)}
                    placeholder="Custom"
                    className="w-24 bg-teal-500/5 border border-teal-500/20 rounded-xl py-3 px-4 text-[11px] font-black text-center text-white placeholder:text-teal-950 focus:outline-none focus:border-teal-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none uppercase"
                  />
                </div>
              </div>
              <p className="text-[10px] text-teal-950 uppercase tracking-[0.8em] font-black opacity-60">Initialize Neural Protocol</p>
            </div>

            <div className="flex justify-center items-center gap-10 text-[10px] font-black text-teal-950 uppercase tracking-[0.4em] pt-8">
              <div className="flex items-center gap-3">
                <Sparkles size={14} className="text-teal-900" />
                <span>AI Synthesis</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-teal-950/20" />
              <div className="flex items-center gap-3">
                <CheckSquare size={14} className="text-teal-900" />
                <span>Neural Sync</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-teal-950/20" />
              <div className="flex items-center gap-3">
                <Zap size={14} className="text-teal-900" />
                <span>Hyper Phase</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 flex justify-between items-end px-4 w-full max-w-[1600px] mx-auto pb-6">
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.5em] text-teal-950 font-black">Link Status</span>
          <div className="flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></span>
            </div>
            <span className="text-xs text-teal-900 font-black uppercase tracking-widest">Protocol Stable</span>
          </div>
        </div>
        
        <button className="p-4 rounded-full bg-black border border-teal-500/10 hover:border-teal-500/30 transition-all group shadow-2xl">
          <HelpCircle size={20} className="text-teal-900 group-hover:text-teal-400" />
        </button>
      </footer>
    </div>
  );
}
