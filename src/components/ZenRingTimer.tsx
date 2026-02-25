"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ZenRingTimerProps {
  isPlaying: boolean;
  onReachHardStop: () => void;
  maxMinutes?: number;
}

export default function ZenRingTimer({ isPlaying, onReachHardStop, maxMinutes = 50 }: ZenRingTimerProps) {
  const [ms, setMs] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - ms;
      const tick = () => {
        const currentMs = Date.now() - startTime;
        if (currentMs >= maxMinutes * 60 * 1000) {
          setMs(maxMinutes * 60 * 1000);
          onReachHardStop();
          return;
        }
        setMs(currentMs);
        timerRef.current = requestAnimationFrame(tick);
      };
      timerRef.current = requestAnimationFrame(tick);
    } else {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    }
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isPlaying, onReachHardStop, maxMinutes]);

  const progress = (ms / (maxMinutes * 60 * 1000)) * 100;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-6 p-4 bg-black border border-teal-500/30 rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.1)] group">
      {/* Drag Handle */}
      <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing">
        <div className="w-1 h-1 rounded-full bg-teal-400" />
        <div className="w-1 h-1 rounded-full bg-teal-400" />
        <div className="w-1 h-1 rounded-full bg-teal-400" />
      </div>

      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-white/5"
            strokeDasharray="1, 8"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.1, ease: "linear" }}
            className="text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="flex items-baseline gap-0.5 text-white font-mono tabular-nums">
            <span className="text-xl font-bold">{minutes.toString().padStart(2, '0')}</span>
            <span className="text-teal-500/50 text-xs">:</span>
            <span className="text-xl font-bold">{seconds.toString().padStart(2, '0')}</span>
            <span className="text-[10px] text-teal-400/60 ml-0.5">.{centiseconds.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-[10px] text-teal-500/80 uppercase tracking-[0.3em] font-black">Neural Lock</p>
        <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            style={{ width: `${progress}%` }}
            className="h-full bg-teal-400"
          />
        </div>
      </div>
    </div>
  );
}


