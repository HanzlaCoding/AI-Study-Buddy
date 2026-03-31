"use client";

import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, StickyNote as NoteIcon, X, Headphones } from "lucide-react";
import confetti from "canvas-confetti";
import { useAudio } from "@/context/AudioContext";
import { useNotes } from "@/context/NotesContext";

// Dynamic Imports (Code Splitting)
const YouTubePlayer = lazy(() => import("@/components/YouTubePlayer"));
const ZenRingTimer = lazy(() => import("@/components/ZenRingTimer"));
const StickyNotes = lazy(() => import("@/components/StickyNotes"));
const WhisperAI = lazy(() => import("@/components/WhisperAI"));
const Gateway = lazy(() => import("@/components/Gateway"));
const ZenMusic = lazy(() => import("@/components/ZenMusic"));
const FloatingMiniPlayer = lazy(() => import("@/components/FloatingMiniPlayer"));

import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Testimonials from "./pages/Testimonials";

export default function Home() {
  const { setIsPanelOpen } = useAudio();
  const { hasNewNote, setHasNewNote } = useNotes();
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [biggestFear, setBiggestFear] = useState<string>("");
  const [playerState, setPlayerState] = useState(-1);
  const [isHardStop, setIsHardStop] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "notes" | "music">("ai");
  const [showControls, setShowControls] = useState(true);
  const [focusDuration, setFocusDuration] = useState(50); // Default 50m
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [isBreakMode, setIsBreakMode] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [showTestConfettiModal, setShowTestConfettiModal] = useState(false);
  const [testConfettiSeconds, setTestConfettiSeconds] = useState("5");

  const navigate = useNavigate();

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

  const extractYouTubeInfo = (url: string) => {
    const videoRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const videoMatch = url.match(videoRegExp);
    const videoId = (videoMatch && videoMatch[2].length === 11) ? videoMatch[2] : null;

    const listRegExp = /[?&]list=([^#\&\?]+)/;
    const listMatch = url.match(listRegExp);
    const playlistId = listMatch ? listMatch[1] : null;

    return { videoId, playlistId };
  };

  const handleEnterGateway = (url: string, fear: string) => {
    const info = extractYouTubeInfo(url);
    if (info.videoId || info.playlistId) {
       // Support purely playlist URLs by passing an empty string for videoId
       setVideoId(info.videoId || "");
       setPlaylistId(info.playlistId);
       setBiggestFear(fear);
       setShowTestConfettiModal(true);
       navigate("/app");
    }
  };

  const handleStateChange = useCallback((state: number) => {
    setPlayerState(state);
  }, []);

  const handleHardStop = useCallback(() => {
    setIsHardStop(true);
    
    // Only trigger modal and confetti if it was a focus session, not a break
    if (!isBreakMode) {
      // Trigger Celebration
      confetti({
        particleCount: 150,
        spread: window.innerWidth < 768 ? 80 : 120,
        origin: { y: 0.7 },
        colors: ["#8c25f4", "#34D399", "#d946ef", "#FBBF24"],
        zIndex: 10000,
        gravity: 0.8,
        scalar: 1.2
      });
      
      // Delay modal slightly for visual impact
      setTimeout(() => {
        setShowBreakModal(true);
      }, 500);
    } else {
      // Break is over! Trigger "Focus Assistant" lock
      setIsHardStop(true);
      setIsSessionEnded(true);
      setIsBreakMode(false);
      setFocusDuration(50); // Ready for next 50m focus
    }
  }, [isBreakMode]);

  const startConfettiTest = useCallback(() => {
    setShowTestConfettiModal(false);
    // Explicitly parse and use the value to avoid stale closures
    const seconds = Number(testConfettiSeconds);
    const ms = seconds * 1000;
    
    if (ms >= 0) {
      setTimeout(() => {
        // Multi-burst for premium feel like the reference image
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          zIndex: 10000,
          colors: ["#8c25f4", "#34D399", "#d946ef", "#FBBF24"],
          scalar: 1.2
        };

        function fire(particleRatio: number, opts: any) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });

        // Show the high-end modal
        setShowBreakModal(true);
      }, ms);
    }
  }, [testConfettiSeconds]);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Marketing / Landing Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/testimonials" element={<Testimonials />} />
        
        <Route path="/" element={
          <motion.div
            key="gateway"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Suspense fallback={<div className="h-screen w-full bg-white flex items-center justify-center"><div className="w-8 h-8 border-t-2 border-[#6366F1] rounded-full animate-spin"></div></div>}>
              <Gateway 
                onEnter={handleEnterGateway} 
                duration={focusDuration}
                onDurationChange={setFocusDuration}
              />
            </Suspense>
          </motion.div>
        } />
        <Route path="/app" element={
          !videoId ? <Navigate to="/" replace /> : (
        <motion.main
          key="flow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#FAFAFA] text-zinc-900 overflow-hidden selection:bg-[#6366F1]/20 font-sans relative"
        >
          {/* Light Mode Enterprise Grid & Subtle Accents */}
          <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] -translate-x-1/4 -translate-y-1/4 pointer-events-none z-0 transform-gpu" />
          <AnimatePresence>
            {showTestConfettiModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md md:backdrop-blur-[120px] flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-[#1E2024]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center max-w-[380px] w-full shadow-[0_40px_100px_rgba(0,0,0,0.8)] transform-gpu"
                >
                  <div className="w-14 h-14 rounded-full bg-[#2A2B33] flex items-center justify-center mb-5 text-2xl">
                    ✨
                  </div>
                  <h3 className="text-[24px] font-bold text-white mb-2 tracking-tight">Test the Vibe?</h3>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    Want to test the celebration effect? Enter seconds below to trigger a test confetti pop over the video!
                  </p>
                <div className="w-full relative mb-6">
                  <input 
                     type="number" 
                     value={testConfettiSeconds}
                     onChange={(e) => setTestConfettiSeconds(e.target.value)}
                     className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-center text-white text-xl font-bold focus:outline-none focus:border-[#8c25f4] transition-colors"
                     placeholder="Seconds"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-sm">SEC</span>
                </div>
                <div className="flex flex-col gap-3 w-full">
                   <button 
                     onClick={startConfettiTest}
                     className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8c25f4] to-[#d946ef] text-white font-bold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(140,37,244,0.3)] text-[14px] uppercase tracking-wider"
                   >
                     Test Confetti
                   </button>
                   <button 
                     onClick={() => setShowTestConfettiModal(false)}
                     className="w-full py-3 text-[#5A6076] hover:text-zinc-300 font-medium transition-colors text-sm"
                   >
                     Skip Test
                   </button>
                </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Celebration / Break Modal */}
          <AnimatePresence>
            {showBreakModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] bg-white/60 backdrop-blur-md md:backdrop-blur-[20px] flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="glass-premium border border-zinc-200 rounded-[40px] p-12 flex flex-col items-center text-center max-w-[500px] w-full shadow-[0_40px_120px_rgba(0,0,0,0.15)] relative overflow-hidden transform-gpu"
                >
                  <div className="w-24 h-24 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-8 text-5xl shadow-inner">
                    🎉
                  </div>
                  
                  <h3 className="text-[42px] md:text-[52px] font-bold text-zinc-900 mb-4 tracking-tight leading-tight">
                    Incredible focus!
                  </h3>
                  
                  <p className="text-zinc-500 text-lg md:text-xl mb-12 leading-relaxed font-medium">
                    You unlocked a <span className="text-zinc-900 font-bold">5-minute break</span>.
                    <br/><span className="text-zinc-400 text-base mt-2 block font-normal px-8">Stretch, breathe, and grab some water.</span>
                  </p>
                  
                  <div className="flex flex-col gap-6 w-full">
                     <button 
                       onClick={() => {
                          setShowBreakModal(false);
                          setIsHardStop(false);
                          setIsBreakMode(true);
                          setFocusDuration(5);
                       }}
                       className="w-full py-5 rounded-2xl bg-[#6366F1] text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#6366F1]/20 text-lg"
                     >
                       Start Break Timer
                     </button>
                     <button 
                       onClick={() => {
                          setShowBreakModal(false);
                          setIsHardStop(false);
                       }}
                       className="w-full py-2 text-zinc-400 hover:text-zinc-700 font-medium transition-colors text-sm underline-offset-8 hover:underline"
                     >
                       Skip break and keep working
                     </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* [Section A] Main Cinematic Video Section (70%) */}
          <section className="relative z-[1] overflow-hidden w-full h-auto aspect-video md:aspect-auto md:h-full md:w-[70%] shrink-0">
            <Suspense fallback={<div className="w-full h-full bg-black flex items-center justify-center"><div className="w-8 h-8 border-t-2 border-[#2b7fff] rounded-full animate-spin"></div></div>}>
              <YouTubePlayer 
                videoId={videoId} 
                playlistId={playlistId}
                onStateChange={handleStateChange}
              >
              {/* Biggest Fear Overlay (Top Center) */}
              {biggestFear && (
                <div className="absolute top-4 md:top-8 left-4 md:left-8 z-[8000] pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-1000">
                  <div className="bg-red-950/40 backdrop-blur-md border border-red-500/20 text-red-500 px-4 md:px-6 py-2 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.2)] max-w-[200px] md:max-w-xs truncate">
                    Defeating: {biggestFear}
                  </div>
                </div>
              )}

              {/* Floating Gamified Timer (Visible in Fullscreen) */}
              <div className="absolute top-4 right-4 md:top-8 md:right-auto md:left-1/2 md:-translate-x-1/2 z-[9999] bg-white/80 backdrop-blur-3xl border border-zinc-200 shadow-xl rounded-full px-4 py-2 md:px-8 md:py-3 flex items-center justify-center pointer-events-auto text-sm md:text-base">
                <div className="w-24 h-6 md:w-32 md:h-8">
                  <ZenRingTimer 
                     isPlaying={playerState === 1 && !isHardStop} 
                     onReachHardStop={handleHardStop}
                     maxMinutes={focusDuration}
                  />
                </div>
              </div>

              {/* Hard Stop / Session End Overlay (Scoped to Video) */}
              <AnimatePresence>
                {(isHardStop || isSessionEnded) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[1000] bg-white/60 backdrop-blur-md md:backdrop-blur-[20px] flex items-center justify-center p-6 text-center cursor-default pointer-events-auto"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="max-w-md w-full glass-premium border border-zinc-200 rounded-[40px] p-8 md:p-12 shadow-2xl backdrop-blur-3xl"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 mx-auto text-4xl shadow-inner">
                        {isSessionEnded ? "🔄" : "⚠️"}
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
                        {isSessionEnded ? "Break Complete!" : "Presence Lost"}
                      </h3>
                      
                      <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
                        {isSessionEnded 
                          ? "Your break has ended. Ready to dive back into deep work?" 
                          : "The timer paused because you were distracted. Get back to focus!"
                        }
                      </p>
                      
                      <button
                        onClick={() => {
                          setIsHardStop(false);
                          setIsSessionEnded(false);
                        }}
                        className="w-full py-4 rounded-xl bg-zinc-900 text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                      >
                        {isSessionEnded ? "Start New Focus Session" : "I'm Back"}
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              </YouTubePlayer>
            </Suspense>
          </section>

          {/* [Section B] Routed Utility Sidebar (Responsive Drawer) (30%) */}
          <AnimatePresence>
            <motion.aside 
              initial={false}
              className="relative flex flex-col-reverse md:flex-row flex-1 md:flex-none md:h-full w-full md:w-[30%] z-[200] md:z-20 bg-white/70 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-zinc-200 shadow-[inset_1px_0_20px_rgba(0,0,0,0.02)] overflow-hidden"
            >
              {/* Main Content Area (Left side of sidebar) */}
              <div className="flex-1 flex flex-col h-full overflow-hidden overscroll-none">

                {/* Sub-Header Area */}
                <div className="h-14 flex-shrink-0 flex items-center justify-center border-b border-zinc-200 bg-white/40 backdrop-blur-md px-4 relative z-20">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500">
                      {activeTab === "ai" ? "Neural Assistant" : 
                       activeTab === "notes" ? "Knowledge Base" : "Acoustic Environment"}
                    </span>
                    
                    {/* Floating Action Button (Top Right of Sidebar) */}
                    {activeTab === "music" && (
                      <button 
                        onClick={() => setIsPanelOpen(false)}
                        className="absolute right-4 p-1.5 rounded-lg bg-white/50 hover:bg-white text-zinc-400 hover:text-zinc-600 transition-colors border border-zinc-200 shadow-sm"
                        title="Close Audio Panel"
                      >
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    )}
                </div>

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
                        transition={{ duration: 0.3, ease: "easeOut" }}
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
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="h-full overflow-y-auto scrollbar-none"
                      >
                        <ZenMusic />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation Strip */}
              <nav className="flex flex-row md:flex-col justify-around md:justify-start items-center h-14 md:h-full w-full md:w-20 shrink-0 border-t md:border-t-0 md:border-l border-zinc-200 bg-white/90 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none pb-safe md:pb-0 md:py-8 gap-0 md:gap-4 z-10 px-4 md:px-0">
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`relative p-3 rounded-xl transition-all duration-300 group ${activeTab === "ai" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"}`}
                  title="Study Assistant"
                >
                  <Sparkles size={22} className="md:size-[24px]" />
                </button>

                <button
                  onClick={() => setActiveTab("notes")}
                  className={`relative p-3 rounded-xl transition-all duration-300 group ${activeTab === "notes" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"}`}
                  title="Notes"
                >
                  <NoteIcon size={22} className="md:size-[24px]" />
                  {hasNewNote && activeTab !== "notes" && (
                     <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                  )}
                </button>

                <div className="hidden md:block w-8 h-px bg-zinc-200 my-2" /> {/* Divider */}

                <button
                  onClick={() => setActiveTab("music")}
                  className={`relative p-3 rounded-xl transition-all duration-300 group ${activeTab === "music" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"}`}
                  title="Focus Audio"
                >
                  <Headphones size={22} className="md:size-[24px]" />
                </button>
              </nav>
            </motion.aside>
          </AnimatePresence>

          {/* Floating Audio Mini-Player */}
          <Suspense fallback={null}>
            <FloatingMiniPlayer onExpand={() => {
              setActiveTab("music");
            }} />
          </Suspense>

        </motion.main>
          )}
        />
      </Routes>
    </AnimatePresence>
  );
}
