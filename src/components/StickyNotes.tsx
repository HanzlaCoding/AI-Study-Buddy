"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotes, Note, Priority } from "@/context/NotesContext";
import clsx from "clsx";

interface StickyNotesProps {
  onClose?: () => void;
}

export default function StickyNotes({ onClose }: StickyNotesProps) {
  const { notes, addNote, deleteNote } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const sortedNotes = [...notes].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.createdAt - a.createdAt;
  });

  const handleAddNote = () => {
    if (!newTitle.trim() && !newBody.trim()) return;
    addNote({
      title: newTitle.trim(),
      body: newBody.trim(),
      priority: newPriority,
    });
    setIsModalOpen(false);
    setNewTitle("");
    setNewBody("");
    setNewPriority("medium");
  };

  const priorityStyles: Record<Priority, string> = {
    high: "bg-red-500/10 border-red-500/20 shadow-[0_4px_24px_rgba(239,68,68,0.05)]",
    medium: "bg-amber-500/10 border-amber-500/20 shadow-[0_4px_24px_rgba(245,158,11,0.05)]",
    low: "bg-emerald-500/10 border-emerald-500/20 shadow-[0_4px_24px_rgba(16,185,129,0.05)]",
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-6 md:p-8 font-sans relative">
      <div className="flex items-center justify-between mb-6 cursor-default">
        <h3 className="text-xs tracking-widest text-zinc-500 uppercase font-medium">Notes</h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-600 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none pb-20 space-y-4">
        {sortedNotes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-3">
             <p className="text-sm font-light">No notes captured.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {sortedNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0 }}
                  className={clsx(
                    "relative p-4 rounded-xl backdrop-blur-md border transition-all duration-300 group",
                    priorityStyles[note.priority]
                  )}
                >
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                  {note.title && <h4 className="text-zinc-200 font-semibold text-sm mb-1.5 pr-6">{note.title}</h4>}
                  {note.body && <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">{note.body}</p>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-6 left-6 right-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-zinc-200 text-sm font-medium backdrop-blur-xl"
      >
        <Plus size={16} /> Add New Thought
      </button>

      {/* Add Note Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#09090B]/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-[#0C0C0E]/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-5 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {(["high", "medium", "low"] as Priority[]).map((p) => {
                    const colors = {
                      high: "bg-red-500",
                      medium: "bg-amber-500",
                      low: "bg-emerald-500"
                    };
                    return (
                      <button
                        key={p}
                        onClick={() => setNewPriority(p)}
                        className={clsx(
                          "w-4 h-4 rounded-full transition-all flex items-center justify-center",
                          colors[p],
                          newPriority === p ? "ring-2 ring-white/20 ring-offset-2 ring-offset-[#0C0C0E] scale-110" : "opacity-40 hover:opacity-100"
                        )}
                      />
                    );
                  })}
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <input
                autoFocus
                type="text"
                placeholder="Title (Optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-transparent border-none text-zinc-100 text-lg font-medium placeholder:text-zinc-600 focus:ring-0 outline-none"
              />

              <textarea
                placeholder="Capture your thought..."
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                rows={4}
                className="w-full bg-transparent border-none text-zinc-300 text-sm placeholder:text-zinc-600/50 focus:ring-0 outline-none resize-none scrollbar-none"
              />

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAddNote}
                  disabled={!newTitle.trim() && !newBody.trim()}
                  className="px-6 py-2 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
