"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";

interface YouTubePlayerProps {
  onStateChange: (state: number) => void;
  videoId: string;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function YouTubePlayer({ onStateChange, videoId, children }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFocusBroken, setIsFocusBroken] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    // Load YouTube Iframe API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("player", {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
        },
        events: {
          onStateChange: (event: any) => {
            onStateChange(event.data);
            if (event.data === window.YT.PlayerState.PLAYING) {
              requestFullscreen();
            }
          },
        },
      });
    };

    const requestFullscreen = () => {
      if (wrapperRef.current?.requestFullscreen && !document.fullscreenElement) {
        wrapperRef.current.requestFullscreen().catch((err) => console.log(err));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (playerRef.current?.pauseVideo) {
          playerRef.current.pauseVideo();
        }
        setIsFocusBroken(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [videoId, onStateChange]);

  const resumeFocus = () => {
    setIsFocusBroken(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (wrapperRef.current?.requestFullscreen) {
        wrapperRef.current.requestFullscreen().catch((err) => console.log(err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full h-full bg-black shadow-2xl group flex items-center justify-center">
      <div className="relative w-full aspect-video pointer-events-auto">
        <div id="player" className="absolute inset-0 w-full h-full" />
      </div>
      
      {children}
      
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 z-[9000] bg-black/50 backdrop-blur-md p-2 rounded-lg border border-white/10 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 pointer-events-auto"
      >
        {isFullscreen ? <Minimize size={20} className="text-white" /> : <Maximize size={20} className="text-white" />}
      </button>
      <AnimatePresence>
        {isFocusBroken && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-[120px] overflow-hidden"
          >
            <div className="text-center p-4 md:p-12 max-w-lg w-full flex flex-col items-center justify-center h-full">
              <div className="flex flex-row items-center gap-3 md:gap-4 mb-4 md:mb-8">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3 md:p-5 rounded-full bg-white/5 border border-white/10 shrink-0"
                >
                  <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                </motion.div>
                <h2 className="text-2xl md:text-5xl font-bold text-white tracking-tighter uppercase whitespace-nowrap">Presence Lost</h2>
              </div>
              
              <p className="text-zinc-400 mb-6 md:mb-12 text-xs md:text-lg font-light leading-relaxed px-2 md:px-6">
                Neural link severed. Deep Work Studio requires absolute presence to continue protocol.
              </p>
              
              <button
                onClick={resumeFocus}
                className="px-6 md:px-12 py-3 md:py-5 bg-white text-black text-[9px] md:text-[10px] font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95 uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-2xl shadow-white/10"
              >
                Restore Link
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


