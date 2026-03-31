"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Link as LinkIcon,
  Sparkles,
  Zap,
  CheckCircle,
  FileText,
  CornerDownLeft,
  Timer,
  Music,
  Brain,
} from "lucide-react";
import DarkSaaSLayout from "../layouts/DarkSaaSLayout";

interface GatewayProps {
  onEnter: (url: string, fear: string) => void;
  onDurationChange: (mins: number) => void;
  duration: number;
  hideUI?: boolean;
}

export default function Gateway({ onEnter, onDurationChange, duration, hideUI = false }: GatewayProps) {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=w0K5SOSlOvU");
  const [focusDuration, setFocusDuration] = useState(duration);
  const [showError, setShowError] = useState(false);
  const [fear, setFear] = useState("");

  // Parallax tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 400 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transformation values for different parallax depths
  const subtleX = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);
  const subtleY = useTransform(smoothMouseY, [-0.5, 0.5], [-15, 15]);
  const mediumX = useTransform(smoothMouseX, [-0.5, 0.5], [-35, 35]);
  const mediumY = useTransform(smoothMouseY, [-0.5, 0.5], [-35, 35]);
  const intenseX = useTransform(smoothMouseX, [-0.5, 0.5], [-60, 60]);
  const intenseY = useTransform(smoothMouseY, [-0.5, 0.5], [-60, 60]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position between -0.5 and 0.5
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleStartFocus = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (url.trim() && fear.trim()) {
      onDurationChange(focusDuration);
      onEnter(url, fear);
    } else {
      setShowError(true);
    }
  }, [url, fear, focusDuration, onDurationChange, onEnter]);

  const logos = [
    { icon: <Zap size={16}/>, name: "ACME Corp" },
    { icon: <CheckCircle size={16}/>, name: "Linear" },
    { icon: <Sparkles size={16}/>, name: "OpenAI" },
    { icon: <FileText size={16}/>, name: "Notion" },
    { icon: <Zap size={16}/>, name: "Vercel" },
    { icon: <CheckCircle size={16}/>, name: "Stripe" },
    { icon: <Sparkles size={16}/>, name: "Airbnb" },
    { icon: <FileText size={16}/>, name: "Figma" },
  ];

  const quotes = [
    { text: "\"Best focus tool I've ever used.\"" },
    { text: "\"Neural Acoustics is pure genius.\"" },
    { text: "\"I finished my thesis in 3 weeks.\"" },
    { text: "\"The Pomodoro timer is flawless.\"" },
    { text: "\"Finally, a workspace that respects focus.\"" },
    { text: "\"The AI summaries saved me hours.\"" },
  ];

  return (
    <div className={`transition-opacity duration-1000 ${hideUI ? "opacity-0 pointer-events-none" : "opacity-100"} min-h-[100dvh] flex flex-col`}>
      <DarkSaaSLayout>
        {/* ── Error Modal ── */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowError(false)}
              className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#111113]/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                  <Zap size={22} className="text-red-400" />
                </div>
                <h3 className="text-xl font-bold font-heading text-zinc-100 mb-2 tracking-tight">Input Required.</h3>
                <p className="text-zinc-500 text-sm mb-7 leading-relaxed">
                  Please provide a valid YouTube URL and identify your biggest distraction to begin the session.
                </p>
                <button
                  onClick={() => setShowError(false)}
                  className="w-full py-3 bg-[#111113] hover:bg-[#18181b] text-emerald-400 border border-emerald-500/30 hover:border-emerald-400/60 text-[11px] font-bold uppercase tracking-[0.3em] rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]"
                  aria-label="Acknowledge Error"
                >
                  Acknowledged
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════ */}
        {/* HERO — Full viewport, zero scroll needed */}
        {/* ════════════════════════════════════════ */}
        <section className="min-h-[100dvh] w-full max-w-7xl mx-auto flex flex-col items-center justify-center relative pt-12 pb-6 px-4 sm:px-6 lg:px-8 overflow-hidden z-0">
          {/* Ambient Glows */}
          <div className="absolute w-[800px] h-[400px] bg-emerald-600/10 blur-[150px] rounded-full top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0" />

          {/* 3D Asset 4: Ambient Waves (Hero Background) */}
          <motion.img
            src="/assets/3d/ambient_waves.png"
            alt=""
            className="absolute top-[10%] -left-[10%] w-[120%] max-w-[1500px] absolute mix-blend-screen opacity-30 pointer-events-none z-0"
            style={{ x: subtleX, y: subtleY }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 3D Asset 1: Neural Sync (Floating near Hero) */}
          <motion.img
            src="/assets/3d/neural_sync.png"
            alt="Neural Sync Brain"
            className="absolute -top-[5%] -right-[15%] w-[450px] absolute mix-blend-screen opacity-30 pointer-events-none z-0 hidden lg:block"
            style={{ x: intenseX, y: intenseY }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center w-full max-w-3xl mx-auto flex flex-col items-center relative z-10"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-5 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-zinc-400">FlowState v2.0 — Your personal study room</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight leading-[1.1] text-zinc-100 mb-4 md:mb-6">
              Master complex concepts in{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                absolute focus.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-400 text-sm md:text-lg font-normal leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10">
              The premier distraction-free study room. Combine embedded lectures, AI mentoring, and persistent notes to conquer your syllabus.
            </p>

            {/* Form */}
            <form onSubmit={handleStartFocus} className="flex flex-col gap-3 w-full max-w-md mx-auto relative z-20">
              {/* URL Input */}
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <LinkIcon size={16} className="text-zinc-600 group-focus-within/input:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Paste your lecture YouTube URL here..."
                  className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              {/* Distraction Input */}
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Zap size={16} className="text-zinc-600 group-focus-within/input:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="What is your biggest distraction right now?"
                  className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  value={fear}
                  onChange={(e) => setFear(e.target.value)}
                />
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                className="mt-2 w-full relative overflow-hidden rounded-xl py-4 flex items-center justify-center gap-2.5 text-emerald-400 font-medium text-sm tracking-[0.15em] uppercase active:scale-[0.98] transition-all duration-300 bg-[#111113] hover:bg-[#18181b] border border-emerald-500/30 hover:border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]"
              >
                Enter Flow State
                <CornerDownLeft size={14} strokeWidth={2.5} />
              </button>
            </form>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════ */}
        {/* BELOW THE FOLD — Features + Marquees    */}
        {/* ════════════════════════════════════════ */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center relative"
          >
            {/* 3D Asset 2: Second Brain Nodes */}
            <motion.img
              src="/assets/3d/second_brain_nodes.png"
              alt=""
              className="absolute top-[20%] -right-[5%] w-[350px] absolute mix-blend-screen opacity-30 pointer-events-none z-0 hidden md:block"
              style={{ x: subtleX, y: subtleY }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* 3D Asset 3: Zen Clock */}
            <motion.img
              src="/assets/3d/zen_clock.png"
              alt=""
              className="absolute top-[40%] -left-[10%] w-[350px] absolute mix-blend-screen opacity-30 pointer-events-none z-0 hidden lg:block"
              style={{ x: mediumX, y: mediumY }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />

            {/* Section Label */}
            <p className="text-zinc-600 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-10 relative z-10">What's inside FlowState</p>

            {/* Feature Cards — Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full mb-20 md:mb-28 relative z-10 pl-0 pr-0">
              
              <div className="group bg-[#111113]/60 backdrop-blur-2xl border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 relative z-10">
                  <Timer size={20} className="text-emerald-400" />
                </div>
                <h3 className="font-bold text-zinc-200 mb-2 text-lg font-heading relative z-10">Hyper-Focus Mode</h3>
                <p className="text-zinc-500 text-sm leading-relaxed relative z-10">A strict, timer-based environment that eliminates distracting tabs and notifications, putting you in the zone instantly.</p>
              </div>

              <div className="group bg-[#111113]/60 backdrop-blur-2xl border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 relative z-10">
                  <Music size={20} className="text-emerald-400" />
                </div>
                <h3 className="font-bold text-zinc-200 mb-2 text-lg font-heading relative z-10">Neural Acoustics</h3>
                <p className="text-zinc-500 text-sm leading-relaxed relative z-10">Curated ambient soundscapes designed to increase sustained flow states and deep work capacity during long study sessions.</p>
              </div>

              <div className="group bg-[#111113]/60 backdrop-blur-2xl border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 relative z-10">
                  <Brain size={20} className="text-emerald-400" />
                </div>
                <h3 className="font-bold text-zinc-200 mb-2 text-lg font-heading relative z-10">AI Note Synthesis</h3>
                <p className="text-zinc-500 text-sm leading-relaxed relative z-10">Instantly capture any thought. The AI organizes them into structured, searchable notes automatically — post-session, ready to review.</p>
              </div>
            </div>

            {/* Marquee 1 — Company Logos */}
            <div className="w-screen -mx-6 sm:-mx-8 mb-6">
              <p className="text-center text-zinc-600 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-6">Used by students at</p>
              <div className="marquee-container w-full">
                <div className="marquee-track">
                  {[...Array(2)].map((_, setIdx) => (
                    <div key={setIdx} className="flex items-center gap-10 md:gap-16 px-8">
                      {logos.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 font-semibold text-sm text-zinc-600 opacity-30 hover:opacity-60 grayscale transition-all whitespace-nowrap cursor-default select-none">
                          {item.icon} {item.name}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Marquee 2 — Quotes */}
            <div className="w-screen -mx-6 sm:-mx-8 pb-20 md:pb-28">
              <div className="marquee-container w-full">
                <div className="marquee-track-reverse">
                  {[...Array(2)].map((_, setIdx) => (
                    <div key={setIdx} className="flex items-center gap-6 px-8">
                      {quotes.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs sm:text-sm italic text-zinc-600 whitespace-nowrap px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 select-none">
                          {item.text}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </DarkSaaSLayout>
    </div>
  );
}
