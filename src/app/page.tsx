"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, StickyNote as NoteIcon, X, Headphones, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import YouTubePlayer from "@/components/YouTubePlayer";
import ZenRingTimer from "@/components/ZenRingTimer";
import StickyNotes from "@/components/StickyNotes";
import WhisperAI from "@/components/WhisperAI";
import Gateway from "@/components/Gateway";
import ZenMusic from "@/components/ZenMusic";
import LiquidGradient from "@/components/LiquidGradient";
import FloatingMiniPlayer from "@/components/FloatingMiniPlayer";
import { useAudio } from "@/context/AudioContext";
import { useNotes } from "@/context/NotesContext";

export default function Home() {
  const { setIsPanelOpen } = useAudio();
  const { hasNewNote, setHasNewNote } = useNotes();
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState(-1);
  const [isHardStop, setIsHardStop] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "notes" | "music">("ai");
  const [showControls, setShowControls] = useState(true);
  const [focusDuration, setFocusDuration] = useState(50); // Default 50m
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [isBreakMode, setIsBreakMode] = useState(false);

  // Sync AudioContext panel state
  useEffect(() => {
    setIsPanelOpen(activeTab === "music");
    
    // Clear the notification dot when the user explicitly views the notes panel
    if (activeTab === "notes") {
      setHasNewNote(false);
    }
  }, [activeTab, setIsPanelOpen, setHasNewNote]);

  // Idle HUD Hide Logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleActivity = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Only hide if focused (playing), not stopped, and no utility windows are open
        // Only hide if focused (playing), not stopped, and no specific utility tab is active (if you want that behavior)
        if (playerState === 1 && !isHardStop) {
          setShowControls(false);
        }
      }, 3000);
    };

    if (videoId) {
      window.addEventListener("mousemove", handleActivity);
      window.addEventListener("mousedown", handleActivity);
      window.addEventListener("touchstart", handleActivity);
      window.addEventListener("keydown", handleActivity);
      handleActivity();
    }

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearTimeout(timeout);
    };
  }, [videoId, playerState, isHardStop]);

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
    
    // Only trigger modal and confetti if it was a focus session, not a break
    if (!isBreakMode) {
      setShowBreakModal(true);
      // Trigger Celebration
      confetti({
        particleCount: 150,
        spread: window.innerWidth < 768 ? 60 : 100,
        origin: { y: 0.8 },
        colors: ["#8c25f4", "#34D399", "#d946ef", "#FBBF24"]
      });
    } else {
      // Break is over, immediately reset back to focus mode setup without modal
      setIsHardStop(false);
      setIsBreakMode(false);
      setFocusDuration(50); // reset to standard focus
    }
  }, [isBreakMode]);

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
          className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#09090B] overflow-hidden selection:bg-[#8c25f4]/20 font-sans relative"
        >
          {/* Aurora Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none z-0" />



          {/* Break Modal */}
          <AnimatePresence>
            {showBreakModal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] bg-[#1E2024]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-10 flex flex-col items-center text-center max-w-[420px] w-[90%] shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
              >
                <div className="w-16 h-16 rounded-full bg-[#2A2B33] flex items-center justify-center mb-6 text-3xl">
                  🎉
                </div>
                <h3 className="text-[28px] font-bold text-white mb-3 tracking-tight">Incredible focus!</h3>
                <p className="text-zinc-400 text-[15px] mb-8 leading-relaxed px-4">
                  You unlocked a <span className="text-indigo-400 font-medium">5-minute break</span>.<br/>Stretch, breathe, and grab some water.
                </p>
                <div className="flex flex-col gap-4 w-full px-2">
                   <button 
                     onClick={() => {
                        setShowBreakModal(false);
                        setIsHardStop(false);
                        setIsBreakMode(true);
                        setFocusDuration(5); // 5 min break
                     }}
                     className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] text-[15px]"
                   >
                     Start Break Timer
                   </button>
                   <button 
                     onClick={() => {
                        setShowBreakModal(false);
                        setIsHardStop(false);
                     }}
                     className="w-full py-3 text-[#5A6076] hover:text-zinc-300 font-medium transition-colors text-sm"
                   >
                     Skip break and keep working
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* [Section A] Main Cinematic Video Section (70%) */}
          <section className="relative z-[1] overflow-hidden w-full h-[70dvh] md:h-full md:w-[70%]">
            <YouTubePlayer 
              videoId={videoId} 
              onStateChange={handleStateChange}
            >
              {/* Floating Gamified Timer (Visible in Fullscreen) */}
              <div className="absolute top-4 right-4 md:top-8 md:right-auto md:left-1/2 md:-translate-x-1/2 z-[300] bg-[#0C0C0E]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full px-4 py-2 md:px-8 md:py-3 flex items-center justify-center pointer-events-auto text-sm md:text-base">
                <div className="w-24 h-6 md:w-32 md:h-8">
                  <ZenRingTimer 
                     isPlaying={playerState === 1 && !isHardStop} 
                     onReachHardStop={handleHardStop}
                     maxMinutes={focusDuration}
                  />
                </div>
              </div>

              {/* Hard Stop Overlay (Scoped to Video) */}
              <AnimatePresence>
                {isHardStop && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-[100] backdrop-blur-[120px] bg-black/80 flex items-center justify-center p-8 text-center pointer-events-auto"
                  >
                    <div className="max-w-xl">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-8 p-6 glass rounded-full w-fit mx-auto border border-white/10"
                      >
                        <Sparkles size={48} className="text-[#8c25f4]" />
                      </motion.div>
                      <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">Protocol Complete.</h2>
                      <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10 font-light italic">
                        Neural pathways fully calibrated. Focus session successfully materialized.
                      </p>
                      <button 
                        onClick={() => setIsHardStop(false)}
                        className="px-12 py-5 rounded-full bg-white text-black text-[10px] uppercase tracking-[0.5em] font-black hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                      >
                        Resume Flow
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </YouTubePlayer>
          </section>

          {/* [Section B] Routed Utility Sidebar (Responsive Drawer) (30%) */}
          <AnimatePresence>
            <motion.aside 
              initial={false}
              className="relative flex flex-col-reverse md:flex-row h-[30dvh] md:h-full w-full md:w-[30%] z-[200] md:z-20 bg-[#09090B]/60 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-white/10 shadow-[inset_1px_0_20px_rgba(255,255,255,0.02)] overflow-hidden"
            >
              {/* Main Content Area (Left side of sidebar) */}
              <div className="flex-1 flex flex-col h-full overflow-hidden overscroll-none">

                {/* Sidebar Bottom: Dynamic Tool Viewport */}
                <div className="flex-1 relative overflow-hidden bg-transparent">
                  <AnimatePresence mode="wait">
                    {activeTab === "ai" && (
                      <motion.div
                        key="ai"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -10 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="h-full"
                      >
                        <WhisperAI />
                      </motion.div>
                    )}
                    {activeTab === "notes" && (
                      <motion.div
                        key="notes"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -10 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="h-full"
                      >
                        <StickyNotes />
                      </motion.div>
                    )}
                    {activeTab === "music" && (
                      <motion.div
                        key="music"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -10 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="h-full overflow-y-auto scrollbar-none"
                      >
                        <ZenMusic />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation Strip */}
              <nav className="flex flex-row md:flex-col justify-around md:justify-start items-center h-14 md:h-full w-full md:w-20 shrink-0 border-t md:border-t-0 md:border-l border-white/5 bg-[#09090B]/90 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none pb-safe md:pb-0 md:py-8 gap-0 md:gap-4 z-10 px-4 md:px-0">
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`relative p-3 rounded-xl transition-all duration-300 group ${activeTab === "ai" ? "bg-white/10 text-zinc-100" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}
                  title="Study Assistant"
                >
                  <Sparkles size={22} className="md:size-[24px]" />
                </button>

                <button
                  onClick={() => setActiveTab("notes")}
                  className={`relative p-3 rounded-xl transition-all duration-300 group ${activeTab === "notes" ? "bg-white/10 text-zinc-100" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}
                  title="Notes"
                >
                  <NoteIcon size={22} className="md:size-[24px]" />
                  {hasNewNote && activeTab !== "notes" && (
                    <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                  )}
                </button>

                <div className="hidden md:block w-8 h-px bg-white/5 my-2" /> {/* Divider */}

                <button
                  onClick={() => setActiveTab("music")}
                  className={`relative p-3 rounded-xl transition-all duration-300 group ${activeTab === "music" ? "bg-white/10 text-zinc-100" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}
                  title="Focus Audio"
                >
                  <Headphones size={22} className="md:size-[24px]" />
                </button>
              </nav>
            </motion.aside>
          </AnimatePresence>

          {/* Floating Audio Mini-Player */}
          <FloatingMiniPlayer onExpand={() => {
            setActiveTab("music");
          }} />

        </motion.main>
      )}
    </AnimatePresence>
  );
}
