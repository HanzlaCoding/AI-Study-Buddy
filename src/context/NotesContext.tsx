"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Priority = "high" | "medium" | "low";

export interface Note {
  id: string;
  title: string;
  body: string;
  priority: Priority;
  createdAt: number;
}

interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  deleteNote: (id: string) => void;
  hasNewNote: boolean;
  setHasNewNote: (status: boolean) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasNewNote, setHasNewNote] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("deep-work-floating-notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse notes", e);
      }
    }
    const savedBadge = localStorage.getItem("deep-work-has-new-note");
    if (savedBadge === "true") setHasNewNote(true);
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("deep-work-floating-notes", JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("deep-work-has-new-note", hasNewNote ? "true" : "false");
    }
  }, [hasNewNote, isLoaded]);

  const addNote = (noteData: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setNotes((prev) => [...prev, newNote]);
    setHasNewNote(true);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, hasNewNote, setHasNewNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
