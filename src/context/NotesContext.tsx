"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Priority = "high" | "medium" | "low";

export interface Topic {
  id: string;
  title: string;
  icon?: string;
  createdAt: number;
}

export interface Note {
  id: string;
  topicId: string;
  title: string;
  body: string;
  priority: Priority;
  createdAt: number;
}

const DEFAULT_TOPICS: Topic[] = [
  { id: "default-1", title: "Physics Derivations", createdAt: Date.now() - 2000 },
  { id: "default-2", title: "C Programming Logic", createdAt: Date.now() - 1000 },
  { id: "default-3", title: "Startup Ideas", createdAt: Date.now() },
];

interface NotesContextType {
  topics: Topic[];
  addTopic: (title: string, icon?: string) => void;
  deleteTopic: (id: string) => void;
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  deleteNote: (id: string) => void;
  hasNewNote: boolean;
  setHasNewNote: (status: boolean) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>(DEFAULT_TOPICS);
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasNewNote, setHasNewNote] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTopics = localStorage.getItem("deep-work-floating-topics");
    if (savedTopics) {
      try {
        setTopics(JSON.parse(savedTopics));
      } catch (e) {
        console.error("Failed to parse topics", e);
      }
    }

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
      localStorage.setItem("deep-work-floating-topics", JSON.stringify(topics));
    }
  }, [topics, isLoaded]);

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

  const addTopic = (title: string, icon?: string) => {
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      title,
      icon,
      createdAt: Date.now(),
    };
    setTopics((prev) => [...prev, newTopic]);
  };

  const deleteTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
    // Also delete associated notes
    setNotes((prev) => prev.filter((n) => n.topicId !== id));
  };

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
    <NotesContext.Provider value={{ topics, addTopic, deleteTopic, notes, addNote, deleteNote, hasNewNote, setHasNewNote }}>
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
