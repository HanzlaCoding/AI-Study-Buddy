"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, StickyNote as NoteIcon, X, Headphones } from "lucide-react";
import confetti from "canvas-confetti";
import YouTubePlayer from "@/components/YouTubePlayer";
import ZenRingTimer from "@/components/ZenRingTimer";
import StickyNotes from "@/components/StickyNotes";
import WhisperAI from "@/components/WhisperAI";
import Gateway from "@/components/Gateway";
import ZenMusic from "@/components/ZenMusic";

export default function Home() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState(-1);
  const [isHardStop, setIsHardStop] = useState(false);
  const [activePanel, setActivePanel] = useState<"ai" | "notes" | "music" | null>(null);
  const [focusDuration, setFocusDuration] = useState(50); // Default 50m

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleEnterGateway = (url: string) => {
    const id = extractVideoId(url);
    if (id) setVideoId(id);
  };

  const handleStateChange = useCallback((state: number) => {
    setPlayerState(state);
  }, []);

  const handleHardStop = useCallback(() => {
    setIsHardStop(true);
    // Trigger Celebration
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#818CF8", "#34D399", "#22D3EE"]
    });
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!videoId ? (
        <motion.div
          key="gateway"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Gateway 
            onEnter={handleEnterGateway} 
            duration={focusDuration}
            onDurationChange={setFocusDuration}
          />
        </motion.div>
      ) : (
        <motion.main
          key="flow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-screen w-screen bg-[#09090B] overflow-hidden selection:bg-white/10"
        >
          {/* Ambient Noise */}
          <div className="noise opacity-10 pointer-events-none" />

          {/* Cinematic Cinema Core */}
          <div className="absolute inset-0 z-0">
            <YouTubePlayer 
              videoId={videoId} 
              onStateChange={handleStateChange}
            />
          </div>

          {/* Hard Stop Overlay */}
          <AnimatePresence>
            {isHardStop && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-[100] glass backdrop-blur-[120px] flex items-center justify-center"
              >
                <div className="text-center p-12 max-w-xl">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="mb-8 p-6 glass rounded-full w-fit mx-auto border border-white/10"
                  >
                    <Sparkles size={48} className="text-indigo-400" />
                  </motion.div>
                  <h2 className="text-7xl font-bold text-white mb-8 tracking-tighter">Protocol Complete.</h2>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-12 font-light">
                    Neural pathways fully calibrated. Focus session successfully materialized. Enjoy the clarity.
                  </p>
                  <div className="flex flex-col items-center gap-6">
                    <button 
                      onClick={() => setIsHardStop(false)}
                      className="px-10 py-4 rounded-full bg-white text-black text-[10px] uppercase tracking-[0.5em] font-bold hover:scale-105 transition-all active:scale-95"
                    >
                      Resume Flow
                    </button>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-[0.5em]">
                      Session Duration: {focusDuration}m
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HUD - Subtle Timer Fixed Top Right */}
          <div className="absolute top-8 right-8 z-10 w-48 h-48 opacity-40 hover:opacity-100 transition-opacity">
            <ZenRingTimer 
              isPlaying={playerState === 1 && !isHardStop} 
              onReachHardStop={handleHardStop}
              maxMinutes={focusDuration}
            />
          </div>

          {/* Floating Action Buttons (FABs) */}
          <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-4">
            <ZenMusic />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePanel(activePanel === "ai" ? null : "ai")}
              className={`p-5 rounded-full bg-[#0C0C0E] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all ${activePanel === "ai" ? "bg-[#121214] border-white/20" : ""}`}
            >
              <Sparkles size={24} className={activePanel === "ai" ? "text-indigo-400" : "text-zinc-500"} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePanel(activePanel === "notes" ? null : "notes")}
              className={`p-5 rounded-full bg-[#0C0C0E] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all ${activePanel === "notes" ? "bg-[#121214] border-white/20" : ""}`}
            >
              <NoteIcon size={24} className={activePanel === "notes" ? "text-emerald-400" : "text-zinc-500"} />
            </motion.button>
          </div>

          {/* AI Drawer */}
          <AnimatePresence>
            {activePanel === "ai" && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActivePanel(null)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute top-0 right-0 h-full w-full max-w-md z-50 bg-[#09090B] border-l border-white/10 shadow-[-40px_0_80px_rgba(0,0,0,0.9)]"
                >
                  <WhisperAI />
                  <button 
                    onClick={() => setActivePanel(null)}
                    className="absolute top-6 left-[-60px] p-4 bg-[#121214] rounded-full border border-white/10 hover:bg-white/5 active:scale-90 transition-all shadow-2xl"
                  >
                    <X size={20} className="text-zinc-500" />
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Notes Floating Modal */}
          <AnimatePresence>
            {activePanel === "notes" && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActivePanel(null)}
                  className="absolute inset-0 bg-black/20 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="absolute bottom-24 right-24 w-[400px] h-[300px] z-50"
                >
                  <StickyNotes />
                  <button 
                    onClick={() => setActivePanel(null)}
                    className="absolute -top-3 -right-3 p-2 glass rounded-full border border-white/10 hover:bg-white/5 shadow-xl"
                  >
                    <X size={14} className="text-zinc-500" />
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Neural Link Status Overlay */}
          <div className="absolute bottom-10 left-10 flex items-center gap-3 pointer-events-none opacity-20 z-10 font-medium">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse" />
            <span className="text-[10px] text-white uppercase tracking-[0.5em]">Protocol: Flow</span>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}


