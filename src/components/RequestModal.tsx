import React, { useState } from 'react';
import { X, MessageSquarePlus, Check, Send } from 'lucide-react';
import { addGameRequest } from '../utils/storage';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose }) => {
  const [gameName, setGameName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;

    addGameRequest(gameName.trim(), notes.trim());
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setGameName('');
      setNotes('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Request a Game</h3>
              <p className="text-xs text-slate-400">Suggest new unblocked iframe games</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-100">Request Received!</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Thank you! Your request for &ldquo;{gameName}&rdquo; has been saved locally.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Game Name *</label>
              <input
                type="text"
                required
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="e.g. Retro Space Shooter 2"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">
                Comments / Embedded URL link (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific link or instructions..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Game Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
