"use client";

import { useState } from "react";
import { Headphones, Play, Pause, Volume2, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";

export default function ZenMusic() {
  const { isPlaying, setIsPlaying, activeStreamId, setActiveStreamId, volume, setVolume, playlist, setPlaylist } = useAudio();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/audio?q=${encodeURIComponent(searchQuery + " ambient focus audio")}`);
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setPlaylist(data);
        setActiveStreamId(data[0].id);
        setIsPlaying(true);
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Failed to search tracks", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-6 md:p-8 font-sans transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 cursor-default">
        <Headphones size={18} className="text-zinc-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
        <h3 className="text-xs tracking-widest text-zinc-400 uppercase font-medium">Ambient Audio</h3>
        
        {/* Subtle Visualizer */}
        {isPlaying && (
          <div className="ml-auto flex items-end gap-1 h-3 transform-gpu">
            <motion.div animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} className="w-0.5 bg-zinc-500/50 rounded-full transform-gpu" />
            <motion.div animate={{ height: ["70%", "30%", "70%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="w-0.5 bg-zinc-500/50 rounded-full transform-gpu" />
            <motion.div animate={{ height: ["30%", "90%", "30%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="w-0.5 bg-zinc-500/50 rounded-full transform-gpu" />
            <motion.div animate={{ height: ["100%", "50%", "100%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} className="w-0.5 bg-zinc-500/50 rounded-full transform-gpu" />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 items-center justify-center space-y-12">
        {/* Track Search / Selector */}
        <div className="w-full relative group">
          <form onSubmit={handleSearch} className="relative">
            {isLoading ? (
              <Loader2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 z-10 animate-spin" />
            ) : (
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10" />
            )}
            <input 
              type="text"
              placeholder="Search ambient tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 text-center text-sm md:text-base text-zinc-200 rounded-full py-3 px-12 outline-none focus:bg-white/10 transition-all font-light placeholder:text-zinc-600 disabled:opacity-50"
            />
          </form>

          {/* Fallback Playlist Dropdown (Only visible if not searching) */}
          <div className="mt-6 text-center">
            <select 
              className="w-full bg-transparent text-center text-sm md:text-base text-zinc-400 font-light appearance-none outline-none cursor-pointer transition-colors hover:text-white"
              value={activeStreamId}
              onChange={(e) => setActiveStreamId(e.target.value)}
            >
              {playlist.map(s => (
                <option key={s.id} value={s.id} className="bg-[#1E2024] text-zinc-300">{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Controls */}
        <button
          onClick={togglePlay}
          className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 active:scale-95 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.15)] transform-gpu"
        >
          {isPlaying ? <Pause size={24} className="text-zinc-200 fill-zinc-200" /> : <Play size={24} className="text-zinc-200 fill-zinc-200 ml-1" />}
        </button>

        {/* Volume Slider */}
        <div className="w-full max-w-[200px] flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <Volume2 size={14} className="text-zinc-500 shrink-0" />
          <div className="relative w-full h-1 bg-white/10 rounded-full flex items-center">
            <div 
              className="absolute left-0 top-0 h-full bg-indigo-400/50 rounded-full pointer-events-none transition-all duration-150"
              style={{ width: `${volume}%` }}
            />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
