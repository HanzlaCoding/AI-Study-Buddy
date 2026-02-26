"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  ArrowRight, 
  Link as LinkIcon, 
  Sparkles, 
  HelpCircle, 
  Zap, 
  CheckCircle,
  FileText,
  CornerDownLeft
} from "lucide-react";
import LiquidGradient from "./LiquidGradient";

interface GatewayProps {
  onEnter: (url: string) => void;
  onDurationChange: (mins: number) => void;
  duration: number;
  hideUI?: boolean;
}

export default function Gateway({ onEnter, onDurationChange, duration, hideUI = false }: GatewayProps) {
  const [url, setUrl] = useState("");
  const [focusDuration, setFocusDuration] = useState(duration);
  const [showError, setShowError] = useState(false);

  const handleEnter = () => {
    if (url.trim()) {
      onDurationChange(focusDuration);
      onEnter(url);
    } else {
      setShowError(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEnter();
  };

  return (
    <div className={`h-screen flex flex-col p-6 md:p-12 relative overflow-hidden bg-[#050505] text-white selection:bg-[#2b7fff]/30 font-sans transition-opacity duration-1000 ${hideUI ? "opacity-40" : "opacity-100"}`}>
      <LiquidGradient />
      
      {!hideUI && (
        <>
          {/* Error Modal Overlay */}
          <AnimatePresence>
            {showError && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowError(false)}
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#0C0C0E]/80 border border-white/10 p-8 rounded-[32px] max-w-sm w-full text-center shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
                    <Zap size={24} className="text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Signal Interrupted.</h3>
                  <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                    Please paste a valid YouTube URL to establish a neural focus link.
                  </p>
                  <button
                    onClick={() => setShowError(false)}
                    className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] transition-all"
                  >
                    Acknowledged
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Navigation */}
          <nav className="relative z-10 flex justify-between items-center mb-12 md:mb-24">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#2b7fff] flex items-center justify-center shadow-[0_0_20px_rgba(43,127,255,0.5)]">
                <Zap size={18} className="text-white fill-white md:size-[22px]" />
              </div>
              <span className="text-base md:text-lg font-bold tracking-tight">FlowState</span>
            </div>
            
            <div className="flex items-center gap-4 md:gap-12 text-[11px] md:text-[13px] font-medium text-zinc-400">
              <a href="#" className="hidden sm:block hover:text-white transition-colors">Methodology</a>
              <a href="#" className="hidden sm:block hover:text-white transition-colors">Pricing</a>
              <div className="hidden sm:block w-px h-4 bg-zinc-800" />
              <button className="font-bold text-white hover:text-[#2b7fff] transition-colors">Log In</button>
            </div>
          </nav>

          {/* Main Content Area (Centering logic restored) */}
          <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto w-full relative z-10 -mt-20 md:-mt-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-12 md:space-y-16 w-full"
            >
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2b7fff]/5 border border-[#2b7fff]/20 mb-2 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2b7fff]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#2b7fff]/80">System Ready</span>
                </div>
                <h1 className="text-5xl sm:text-7x md:text-8xl lg:text-[100px] font-medium tracking-[-0.05em] leading-[0.9] text-white">
                  Enter <span className="text-[#2b7fff]">Flow</span> State
                </h1>
                <p className="text-zinc-500 text-sm md:text-lg lg:text-xl font-normal tracking-tight max-w-xl md:max-w-3xl mx-auto leading-relaxed px-6 md:px-0 opacity-70">
                  Transmute passive lectures into actionable cognitive assets. <br className="hidden md:block"/> 
                  The ultimate neural focus environment, engineered for clarity.
                </p>
              </div>

              <div className="relative max-w-3xl mx-auto w-full group px-4 md:px-0">
                {/* Advanced Input Container */}
                <form 
                  onSubmit={handleSubmit}
                  className={`relative flex items-center bg-[#0C0C0E]/40 border ${url ? "border-[#2b7fff]/50 shadow-[0_0_50px_rgba(43,127,255,0.15)]" : "border-white/5"} rounded-3xl md:rounded-[40px] p-2 md:p-3 focus-within:border-[#2b7fff]/70 focus-within:shadow-[0_0_60px_rgba(43,127,255,0.2)] transition-all duration-700 backdrop-blur-3xl overflow-hidden group/form`}
                >
                  {/* Decorative glow line */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  
                  <div className="pl-4 md:pl-6 pr-2 md:pr-4">
                    <LinkIcon size={20} className={`${url ? "text-[#2b7fff]" : "text-zinc-700"} transition-colors duration-700 md:size-6`} />
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Establish Neural Link (Paste YouTube URL)..."
                    className="flex-1 bg-transparent border-none py-4 md:py-6 px-2 md:px-4 text-sm md:text-lg text-white placeholder:text-zinc-800 focus:ring-0 outline-none font-light tracking-tight"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />

                  <div className="pr-2 md:pr-3 flex items-center gap-3 md:gap-4">
                    <div className="hidden lg:flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                      <span className="opacity-50">CMD</span> V
                    </div>
                    <button 
                      type="submit"
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[30px] flex items-center justify-center transition-all duration-700 active:scale-95 shadow-2xl ${url.trim() ? "bg-[#2b7fff] text-white shadow-[#2b7fff]/40" : "bg-zinc-900/50 text-zinc-700"}`}
                    >
                      <CornerDownLeft size={20} strokeWidth={2.5} className="md:size-[24px]" />
                    </button>
                  </div>
                </form>

                {/* Refined Quick Actions */}
                <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-14">
                  <button className="flex items-center gap-3 text-[10px] md:text-[11px] font-bold text-zinc-600 hover:text-white transition-all group uppercase tracking-[0.2em]">
                    <Sparkles size={14} className="text-zinc-800 group-hover:text-[#2b7fff] md:size-[16px] transition-colors" />
                    AI Synthesis
                  </button>
                  <div className="hidden sm:block w-px h-3 bg-zinc-900" />
                  <button className="flex items-center gap-3 text-[10px] md:text-[11px] font-bold text-zinc-600 hover:text-white transition-all group uppercase tracking-[0.2em]">
                    <FileText size={14} className="text-zinc-800 group-hover:text-[#2b7fff] md:size-[16px] transition-colors" />
                    Auto-Indexing
                  </button>
                  <div className="hidden sm:block w-px h-3 bg-zinc-900" />
                  <button className="flex items-center gap-3 text-[10px] md:text-[11px] font-bold text-zinc-600 hover:text-white transition-all group uppercase tracking-[0.2em]">
                    <Zap size={14} className="text-zinc-800 group-hover:text-[#2b7fff] md:size-[16px] transition-colors" />
                    Zero Lag
                  </button>
                </div>
              </div>
            </motion.div>
          </main>

          {/* Footer Status Indicators */}
          <footer className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full gap-6 md:gap-0 mt-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-700">System Status</span>
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2b7fff]"></span>
                </div>
                <span className="text-xs font-semibold text-zinc-400">Operational</span>
              </div>
            </div>
            
            <button className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-zinc-800 transition-all group">
              <span className="text-xl font-bold text-zinc-600 group-hover:text-white">?</span>
            </button>
          </footer>
        </>
      )}
    </div>
  );
}
