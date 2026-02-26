"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Maximize2, Disc } from "lucide-react";
import { useAudio, STREAMS } from "@/context/AudioContext";

interface FloatingMiniPlayerProps {
  onExpand: () => void;
}

export default function FloatingMiniPlayer({ onExpand }: FloatingMiniPlayerProps) {
  const { isPlaying, setIsPlaying, currentTrack, activeStreamId, setActiveStreamId, isPanelOpen } = useAudio();

  // The logic is only to show if playing = true and panel = false
  const shouldRender = isPlaying && !isPanelOpen;

  const handleSkip = (direction: "forward" | "back") => {
    const currentIndex = STREAMS.findIndex(s => s.id === activeStreamId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (direction === "forward") {
      nextIndex = (currentIndex + 1) % STREAMS.length;
    } else {
      nextIndex = (currentIndex - 1 + STREAMS.length) % STREAMS.length;
    }
    setActiveStreamId(STREAMS[nextIndex].id);
  };

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-8 left-8 z-[300] bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl px-3 py-2.5 flex items-center gap-4 min-w-[320px] max-w-[400px]"
        >
          {/* Album Art Placeholder / Thumbnail */}
           {currentTrack?.thumbnail ? (
             <motion.img 
               src={currentTrack.thumbnail}
               alt="Thumbnail"
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="w-10 h-10 rounded-full border border-white/10 shrink-0 object-cover"
             />
           ) : (
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0"
             >
               <Disc size={20} className="text-zinc-500" />
             </motion.div>
           )}

           {/* Track Info */}
           <div className="flex-1 min-w-0 pr-4">
             <h4 className="text-zinc-200 text-sm font-medium truncate">{currentTrack.name}</h4>
             <p className="text-zinc-500 text-xs truncate">{currentTrack?.author || "Ambient Focus"}</p>
           </div>

           {/* Controls */}
           <div className="flex items-center gap-1 shrink-0">
             <button 
               onClick={() => handleSkip("back")}
               className="p-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-95"
             >
               <SkipBack size={14} className="text-zinc-400 hover:text-white transition-colors" />
             </button>
             
             <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-95 text-white"
             >
               {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current" />}
             </button>
             
             <button 
               onClick={() => handleSkip("forward")}
               className="p-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-95"
             >
               <SkipForward size={14} className="text-zinc-400 hover:text-white transition-colors" />
             </button>

             <div className="w-px h-6 bg-white/10 mx-2" />

             {/* Expand Button */}
             <button 
               onClick={onExpand}
               className="p-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-95"
               title="Open Audio Panel"
             >
               <Maximize2 size={14} className="text-zinc-500 hover:text-white transition-colors" />
             </button>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
