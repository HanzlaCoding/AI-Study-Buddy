"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ZenRingTimerProps {
  isPlaying: boolean;
  onReachHardStop: () => void;
  maxMinutes?: number;
}

const ZenRingTimer = memo(function ZenRingTimer({ isPlaying, onReachHardStop, maxMinutes = 50 }: ZenRingTimerProps) {
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
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const isPulsing = (seconds / 60) >= PULSE_MINUTE && isPlaying;

  const radius = 70;
  return (
    <div className="relative w-full h-full flex items-center justify-center font-sans tracking-tight transform-gpu">
      {/* Pulsing Overlay */}
      <AnimatePresence>
        {isPulsing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.15, 0],
              scale: window.innerWidth < 768 ? 1 : [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-red-500/10 blur-lg md:blur-xl pointer-events-none transform-gpu will-animate"
          />
        )}
      </AnimatePresence>

      {/* Center Info - HH:MM:SS */}
      <div className="flex flex-col items-center transform-gpu">
        <div className="flex items-baseline gap-1">
          {h > 0 && (
            <div className="flex items-baseline">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tighter w-8 text-center tabular-nums">{h}</span>
              <span className="text-[10px] md:text-xs text-zinc-500 font-bold mr-2">H</span>
            </div>
          )}
          <div className="flex items-baseline">
            <span className="text-xl md:text-2xl font-bold text-white tracking-tighter w-8 text-center tabular-nums">{String(m).padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs text-zinc-500 font-bold mr-2">M</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl md:text-2xl font-medium text-white tabular-nums w-8 text-center">{String(s).padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs text-zinc-500 font-bold">S</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ZenRingTimer;
