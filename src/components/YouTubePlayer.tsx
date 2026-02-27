"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Maximize, 
  Minimize, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Settings,
  FastForward,
  Rewind,
} from "lucide-react";

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
  
  // Custom Control States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Advanced feature States
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState("Auto");
  const [toast, setToast] = useState<{message: React.ReactNode, id: number} | null>(null);

  const showToast = useCallback((message: React.ReactNode) => {
    setToast({ message, id: Date.now() });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFocusBrokenRef = useRef(false);

  const handleUserActivity = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      handleUserActivity();
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [isPlaying, handleUserActivity]);

  // Keyboard Event Listeners for Video Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (like the fear modal)
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      switch(e.code) {
        case "Space":
          e.preventDefault(); // Prevent page scroll
          if (playerRef.current) {
             const state = playerRef.current.getPlayerState();
             if (state === 1) {
               playerRef.current.pauseVideo();
             } else {
               playerRef.current.playVideo();
             }
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (playerRef.current) {
            const time = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(time + 5, true);
            showToast(<div className="flex items-center gap-1 opacity-80"><FastForward size={14} strokeWidth={2.5} /></div>);
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (playerRef.current) {
            const time = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(Math.max(0, time - 5), true);
            showToast(<div className="flex items-center gap-1 opacity-80"><Rewind size={14} strokeWidth={2.5} /></div>);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(prev => {
            const next = Math.min(100, prev + 10);
            playerRef.current?.setVolume(next);
            if (next === 100 && prev === 100) showToast("Volume Maximum");
            else showToast(`Volume: ${next}%`);
            setIsMuted(next === 0);
            if (next > 0) playerRef.current?.unMute();
            return next;
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(prev => {
            const next = Math.max(0, prev - 10);
            playerRef.current?.setVolume(next);
            if (next === 0 && prev === 0) showToast("Volume Muted");
            else showToast(`Volume: ${next}%`);
            setIsMuted(next === 0);
            if (next === 0) playerRef.current?.mute();
            return next;
          });
          break;
      }
      
      handleUserActivity(); // Show controls on keypress
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUserActivity, showToast]);

  // Initialize or update player
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const loadAPI = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    };

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player("player-container", {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            setDuration(event.target.getDuration());
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            onStateChange(event.data);
            setIsPlaying(event.data === 1); // 1 is Playing
            
            if (event.data === 1) { // Normal play
              // Enforce pause if resumed via Bluetooth/Airpods while focus is broken
              if (isFocusBrokenRef.current) {
                event.target.pauseVideo();
                return;
              }
              requestFullscreen();
            }
          },
          onError: (error: any) => {
            console.error("YouTube Player Error:", error);
          }
        },
      });
    };

    const requestFullscreen = async () => {
      const wrapper = wrapperRef.current;
      if (wrapper && !document.fullscreenElement && window.innerWidth < 1024) {
        try {
          if (wrapper.requestFullscreen) {
            await wrapper.requestFullscreen();
          } else if ((wrapper as any).webkitRequestFullscreen) {
            await (wrapper as any).webkitRequestFullscreen();
          }
          
          // Lock to landscape if supported
          if (window.screen?.orientation && (window.screen.orientation as any).lock) {
            await (window.screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch (err) {
          console.warn("Fullscreen/Orientation lock failed:", err);
        }
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      loadAPI();
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Progress Tracker
    interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const time = playerRef.current.getCurrentTime();
        if (!isNaN(time)) setCurrentTime(time);
        
        // Duration might change for livestreams or slow loads
        const dur = playerRef.current.getDuration();
        if (!isNaN(dur) && dur > 0) setDuration(dur);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [videoId, onStateChange]);

  // Handle Focus Loss
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (playerRef.current?.pauseVideo) {
          playerRef.current.pauseVideo();
        }
        setIsFocusBroken(true);
        isFocusBrokenRef.current = true;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Handle Fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // If we exit fullscreen, try to unlock orientation
      if (!document.fullscreenElement && (window.screen?.orientation as any)?.unlock) {
        (window.screen.orientation as any).unlock();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const resumeFocus = () => {
    setIsFocusBroken(false);
    isFocusBrokenRef.current = false;
    if (playerRef.current?.playVideo) {
      playerRef.current.playVideo();
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        try {
          if (wrapper.requestFullscreen) {
            await wrapper.requestFullscreen();
          } else if ((wrapper as any).webkitRequestFullscreen) {
            await (wrapper as any).webkitRequestFullscreen();
          }
          if (window.screen?.orientation && (window.screen.orientation as any).lock) {
            await (window.screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch {}
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    playerRef.current?.seekTo(time, true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value);
    setVolume(v);
    playerRef.current?.setVolume(v);
    setIsMuted(v === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      playerRef.current?.unMute();
      playerRef.current?.setVolume(volume || 50);
      setIsMuted(false);
    } else {
      playerRef.current?.mute();
      setIsMuted(true);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    playerRef.current?.setPlaybackRate(nextRate);
    showToast(`Speed: ${nextRate}x`);
  };

  const handleQualitySelect = (quality: string) => {
    setCurrentQuality(quality);
    setShowQualityMenu(false);
    showToast(`Quality set to ${quality}`);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div 
      ref={wrapperRef} 
      className="relative w-full h-full bg-black shadow-2xl group flex items-center justify-center overflow-hidden"
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
    >
      <div className="relative w-full aspect-video pointer-events-auto">
        <div id="player-container" className="absolute inset-0 w-full h-full transform-gpu" />
        {/* Interaction Layer */}
        <div className="absolute inset-0 z-10 cursor-pointer" onClick={handlePlayPause} />
      </div>
      
      {children}
      
      {/* Toast Notification HUD */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-8 right-8 z-[9999] pointer-events-none"
          >
            <div className="bg-black/50 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full shadow-lg">
              <div className="text-white/90 text-[10px] font-semibold tracking-wider uppercase flex items-center justify-center">
                {toast.message}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Control Bar */}
      <AnimatePresence>
        {(showControls || !isPlaying) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 z-[9500] bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 pb-6 px-6 pointer-events-auto"
          >
            {/* Progress Slider */}
            <div className="relative w-full group/seek h-6 flex items-center mb-4">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white/20 rounded-full w-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white/60"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <input 
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
              />
              <motion.div 
                className="absolute h-3 w-3 bg-white rounded-full shadow-lg pointer-events-none z-10 scale-0 group-hover/seek:scale-100 transition-transform"
                style={{ left: `calc(${duration > 0 ? (currentTime / duration) * 100 : 0}% - 6px)` }}
              />
            </div>

            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <button onClick={handlePlayPause} className="text-white hover:scale-110 transition-transform">
                  {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-0.5" />}
                </button>

                <button onClick={() => playerRef.current?.seekTo(currentTime - 10, true)} className="text-white/70 hover:text-white transition-colors">
                  <RotateCcw size={20} />
                </button>

                <div className="flex items-center gap-3 group/volume">
                  <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300 flex items-center">
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-full accent-white h-1 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="text-zinc-400 text-xs font-medium tabular-nums">
                  <span className="text-white">{formatTime(currentTime)}</span> / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <button 
                  onClick={cyclePlaybackRate}
                  className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white hover:bg-white/10 transition-colors uppercase tracking-widest"
                >
                  {playbackRate}x
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="text-white/70 hover:text-white transition-colors flex items-center justify-center p-1"
                  >
                    <Settings size={20} className={showQualityMenu ? "text-white rotate-45 transition-transform duration-300" : "transition-transform duration-300"} />
                  </button>
                  
                  <AnimatePresence>
                    {showQualityMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full right-0 mb-3 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-2xl py-2 flex flex-col min-w-[120px] shadow-2xl overflow-hidden"
                      >
                         {/* Hardcoded qualities for visual effect */}
                         {["Auto", "1080p60", "720p60", "480p", "360p"].map((q) => (
                           <button
                             key={q}
                             onClick={() => handleQualitySelect(q)}
                             className={`px-4 py-2 text-xs font-bold uppercase tracking-widest text-left transition-colors ${currentQuality === q ? "text-[#2b7fff] bg-[#2b7fff]/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                           >
                             {q}
                           </button>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors p-1">
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isFocusBroken && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-md md:backdrop-blur-[120px] overflow-hidden transform-gpu"
          >
            <div className="text-center p-4 md:p-12 max-w-lg w-full flex flex-col items-center justify-center h-full">
              <div className="flex flex-row items-center gap-3 md:gap-4 mb-4 md:mb-8">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3 md:p-5 rounded-full bg-white/5 border border-white/10 shrink-0 transform-gpu"
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


