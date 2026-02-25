"use client";

import { useState, useEffect, useRef } from "react";
import { Music, Pause, Play, LogIn, HeadphoneOff, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ZenMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Curated Lo-Fi Stream (Lofi Girl - popular and reliable)
  const lofiStreamId = "jfKfPfyJRdk";

  const togglePlay = () => {
    if (!isLoggedIn) {
      setShowPlayer(true);
      return;
    }
    
    setIsPlaying(!isPlaying);
    const iframe = playerRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: isPlaying ? "pauseVideo" : "playVideo",
          args: [],
        }),
        "*"
      );
    }
  };

  return (
    <div className="relative">
      {/* Hidden YouTube Player for Audio */}
      <iframe
        ref={playerRef}
        className="hidden"
        src={`https://www.youtube.com/embed/${lofiStreamId}?enablejsapi=1&autoplay=0&controls=0&modestbranding=1`}
        allow="autoplay"
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPlayer(!showPlayer)}
        className={`p-5 rounded-full bg-black border border-teal-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all ${
          showPlayer ? "bg-black border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.1)]" : ""
        }`}
      >
        <Headphones
          size={24}
          className={isPlaying ? "text-teal-400" : "text-teal-900"}
        />
      </motion.button>

      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10, x: 20 }}
            className="absolute bottom-20 right-0 w-72 bg-black p-6 rounded-[28px] border border-teal-500/20 shadow-[0_40px_100px_rgba(0,0,0,0.9)] z-[60]"
          >
            {!isLoggedIn ? (
              <div className="text-center space-y-4">
                <div className="p-3 bg-teal-500/5 rounded-2xl w-fit mx-auto border border-teal-500/20">
                  <LogIn size={20} className="text-teal-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Neural Audio</h4>
                  <p className="text-[10px] text-teal-900 leading-relaxed font-black">
                    Unlock premium frequencies for hyper-focus activation.
                  </p>
                </div>
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="w-full py-2.5 rounded-xl bg-teal-500 text-black text-[10px] uppercase tracking-widest font-black hover:bg-teal-400 transition-all active:scale-95"
                >
                  Neural Login
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-teal-500/10 relative group">
                    <img 
                      src={`https://img.youtube.com/vi/${lofiStreamId}/0.jpg`} 
                      alt="Lofi Girl" 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Music size={12} className="text-teal-400/40" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white truncate">Lo-Fi Pulse</h4>
                    <p className="text-[9px] text-teal-900 truncate font-black">Lofi Girl Official</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={isPlaying ? { x: ["-100%", "100%"] } : { x: "-100%" }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full bg-teal-500/40"
                    />
                  </div>
                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-teal-500 text-black hover:scale-110 transition-transform active:scale-95"
                  >
                    {isPlaying ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" className="ml-0.5" />}
                  </button>
                </div>

                <div className="flex justify-between items-center text-[8px] text-teal-900 uppercase tracking-widest font-black border-t border-teal-500/10 pt-4">
                  <span>Neural Feed</span>
                  <button onClick={() => setIsLoggedIn(false)} className="hover:text-teal-400 transition-colors">Disconnect</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
