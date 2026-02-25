"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ZenRingTimerProps {
  isPlaying: boolean;
  onReachHardStop: () => void;
  maxMinutes?: number;
}

export default function ZenRingTimer({ isPlaying, onReachHardStop, maxMinutes = 50 }: ZenRingTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const PULSE_MINUTE = Math.floor(maxMinutes * 0.9); // Pulse at 90% completion

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          if (next >= maxMinutes * 60) {
            onReachHardStop();
            return s;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onReachHardStop, maxMinutes]);

  const progress = (seconds / (maxMinutes * 60)) * 100;
  const minutesLabel = Math.floor(seconds / 60);
  const isPulsing = minutesLabel >= PULSE_MINUTE && isPlaying;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 glass rounded-[32px] relative overflow-hidden h-full group">
      <div className="relative w-36 h-36">
        {/* Background Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-white/5"
          />
          {/* Animated Progress Ring */}
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "linear" }}
            className="text-indigo-400/60 drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]"
          />
        </svg>

        {/* Pulsing Overlay at 50m */}
        <AnimatePresence>
          {isPulsing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.3, 0.8] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Center Info */}
        <div className="absolute inset-0 flex flex-center items-center justify-center flex-col">
          <span className="text-[8px] uppercase tracking-[0.5em] text-zinc-600 mb-1">State</span>
          <span className="text-xl font-extralight text-white tracking-widest leading-none">
             {minutesLabel}<span className="text-[10px] text-zinc-600 ml-1 font-medium">M</span>
          </span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-[8px] text-zinc-600 uppercase tracking-[0.4em] font-medium group-hover:text-zinc-500 transition-colors">
          Protocol Active
        </p>
      </div>
    </div>
  );
}


