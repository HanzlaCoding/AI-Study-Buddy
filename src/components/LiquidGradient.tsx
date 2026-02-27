"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const LiquidGradient = memo(function LiquidGradient() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transform-gpu">
      {/* Deepest Void Layer */}
      <div className="absolute inset-0 bg-[#020202]" />
      
      {/* Blob 1: Primary Azure Energy (Top Left) */}
      <motion.div
        animate={{
          x: ["-5%", "5%", "-5%"],
          y: ["-2%", "8%", "-2%"],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#2b7fff]/20 blur-[60px] md:blur-[100px] transform-gpu will-animate"
      />

      {/* Blob 2: Deep Teal Flow (Bottom Right) */}
      <motion.div
        animate={{
          x: ["2%", "-5%", "2%"],
          y: ["5%", "-2%", "5%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[80px] md:blur-[120px] transform-gpu will-animate"
      />

      {/* Blob 3: Nebula Ambient (Center) */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 m-auto w-[80%] h-[80%] rounded-full bg-indigo-600/10 blur-[100px] md:blur-[150px] transform-gpu will-animate"
      />

      {/* Grain Overlay for Premium Texture (Hardware Accelerated) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay transform-gpu" />
    </div>
  );
});

export default LiquidGradient;
