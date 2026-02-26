"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Track {
  id: string;
  name: string;
  thumbnail?: string;
  author?: string;
}

export const STREAMS: Track[] = [
  { id: "jfKfPfyJRdk", name: "Tokyo Lofi Rain" },
  { id: "n61ULEU7JV0", name: "Deep Space Hum" },
  { id: "M7FIvfx5J10", name: "40Hz Focus Binaural" }
];

interface AudioContextType {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  activeStreamId: string;
  setActiveStreamId: (id: string) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  currentTrack: Track;
  playlist: Track[];
  setPlaylist: (playlist: Track[]) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStreamId, setActiveStreamId] = useState(STREAMS[0].id);
  const [volume, setVolume] = useState(50);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>(STREAMS);

  const currentTrack = playlist.find(s => s.id === activeStreamId) || playlist[0] || STREAMS[0];

  return (
    <AudioContext.Provider value={{
      isPlaying,
      setIsPlaying,
      activeStreamId,
      setActiveStreamId,
      volume,
      setVolume,
      isPanelOpen,
      setIsPanelOpen,
      currentTrack,
      playlist,
      setPlaylist
    }}>
      {children}
      
      {/* Global Hidden Player */}
      {isPlaying && (
        <div className="hidden">
           <iframe
            width="100"
            height="100"
            src={`https://www.youtube.com/embed/${activeStreamId}?autoplay=1&mute=0`}
            allow="autoplay"
          ></iframe>
        </div>
      )}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
