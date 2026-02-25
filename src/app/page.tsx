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

          {/* Master Dock - Draggable Bottom Center */}
          <motion.div
            drag
            dragConstraints={{ left: -500, right: 500, top: -500, bottom: 0 }}
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: -40, x: "-50%", opacity: 1 }}
            className="absolute bottom-0 left-1/2 z-50 flex items-center gap-6 p-3 bg-black border border-teal-500/30 rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,1)]"
          >
            {/* Drag Handle */}
            <div className="pl-3 flex flex-col gap-1 opacity-20 cursor-grab active:cursor-grabbing">
              <div className="w-1 h-1 rounded-full bg-teal-400" />
              <div className="w-1 h-1 rounded-full bg-teal-400" />
              <div className="w-1 h-1 rounded-full bg-teal-400" />
            </div>

            <div className="flex items-center gap-4 pr-3 border-r border-teal-500/10">
              <ZenRingTimer 
                isPlaying={playerState === 1 && !isHardStop} 
                onReachHardStop={handleHardStop}
                maxMinutes={focusDuration}
              />
            </div>

            <div className="flex items-center gap-3 pr-2">
              <ZenMusic />
              
              <button
                onClick={() => setActivePanel(activePanel === "ai" ? null : "ai")}
                className={`p-4 rounded-2xl bg-black border border-teal-500/10 transition-all ${activePanel === "ai" ? "bg-teal-500/10 border-teal-500/40" : "hover:bg-white/5"}`}
              >
                <Sparkles size={20} className={activePanel === "ai" ? "text-teal-400" : "text-teal-900"} />
              </button>

              <button
                onClick={() => setActivePanel(activePanel === "notes" ? null : "notes")}
                className={`p-4 rounded-2xl bg-black border border-teal-500/10 transition-all ${activePanel === "notes" ? "bg-teal-500/10 border-teal-500/40" : "hover:bg-white/5"}`}
              >
                <NoteIcon size={20} className={activePanel === "notes" ? "text-teal-400" : "text-teal-900"} />
              </button>
            </div>
          </motion.div>

          {/* AI Panel - Bottom Right Overlay */}
          <AnimatePresence>
            {activePanel === "ai" && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-32 right-8 h-[500px] w-[400px] z-50 bg-black border border-teal-500/20 rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,1)]"
              >
                <WhisperAI />
                <button 
                  onClick={() => setActivePanel(null)}
                  className="absolute -top-3 -right-3 p-2 bg-black rounded-full border border-teal-500/30 text-teal-500 hover:text-white transition-all shadow-xl"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notes Panel - Bottom Left Overlay */}
          <AnimatePresence>
            {activePanel === "notes" && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-32 left-8 h-[400px] w-[350px] z-50"
              >
                <StickyNotes />
                <button 
                  onClick={() => setActivePanel(null)}
                  className="absolute -top-3 -right-3 p-2 bg-black rounded-full border border-teal-500/30 text-teal-500 hover:text-white transition-all shadow-xl"
                >
                  <X size={14} />
                </button>
              </motion.div>
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


