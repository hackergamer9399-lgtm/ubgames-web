import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Heart,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  Info,
  Shield,
  Save,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import { getGameUserData, saveGameUserData, toggleFavorite } from '../utils/storage.js';

export const GamePlayer = ({ game, onBack, onToggleFavorite, isFavorite }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const iframeContainerRef = useRef(null);

  // User notes & high score state
  const [userData, setUserData] = useState({ isFavorite: false });
  const [highScore, setHighScore] = useState('');
  const [notes, setNotes] = useState('');
  const [savedStatusMessage, setSavedStatusMessage] = useState('');

  useEffect(() => {
    const data = getGameUserData(game.id);
    setUserData(data);
    setHighScore(data.highScore ? String(data.highScore) : '');
    setNotes(data.notes || '');
  }, [game.id]);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleFullscreen = () => {
    if (iframeContainerRef.current) {
      if (iframeContainerRef.current.requestFullscreen) {
        iframeContainerRef.current.requestFullscreen();
      }
    }
  };

  const handleLikeDislike = (status) => {
    const newStatus = userData.likedStatus === status ? null : status;
    saveGameUserData(game.id, { likedStatus: newStatus });
    setUserData((prev) => ({ ...prev, likedStatus: newStatus }));
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    saveGameUserData(game.id, {
      highScore: Number(highScore) || 0,
      notes: notes,
    });
    setSavedStatusMessage('Saved to local storage!');
    setTimeout(() => setSavedStatusMessage(''), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Arcade</span>
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-100 line-clamp-1">{game.title}</h2>
          <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-mono">
            {game.category}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-rose-400'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleReload}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Reload Frame"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleFullscreen}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 text-xs"
            title="Full Screen"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main Game Screen iFrame Container */}
      <div
        ref={iframeContainerRef}
        className="relative w-full h-[65vh] min-h-[450px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-center items-center"
      >
        {game.srcDoc ? (
          <iframe
            key={iframeKey}
            srcDoc={game.srcDoc}
            title={game.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            allow="fullscreen; autoplay"
          />
        ) : (
          <iframe
            key={iframeKey}
            src={game.iframeUrl}
            title={game.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            allow="fullscreen; autoplay"
          />
        )}
      </div>

      {/* Info, Controls & Personal Log Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Controls */}
        <div className="md:col-span-2 space-y-6">
          {/* Game Info Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">About Game</h3>
              </div>

              {/* Feedback Likes */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLikeDislike('like')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                    userData.likedStatus === 'like'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-emerald-400'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Like</span>
                </button>
                <button
                  onClick={() => handleLikeDislike('dislike')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                    userData.likedStatus === 'dislike'
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Dislike</span>
                </button>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">{game.description}</p>

            {/* Tags */}
            {game.tags && (
              <div className="flex flex-wrap gap-2 pt-2">
                {game.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-950 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-800/80 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Controls Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>How to Play / Controls</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {(game.controls || ['Keyboard Arrow Keys or WASD', 'Mouse Click to interact']).map(
                (ctrl, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/60 font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span>{ctrl}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Right 1 Col: Local Player Notebook & Highscore */}
        <div className="space-y-6">
          <form onSubmit={handleSaveNotes} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">My Game Log</h3>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">My High Score</label>
              <input
                type="number"
                value={highScore}
                onChange={(e) => setHighScore(e.target.value)}
                placeholder="e.g. 1540"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">Personal Cheat Codes / Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Save level codes, passwords, strategies..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Progress Notes</span>
            </button>

            {savedStatusMessage && (
              <p className="text-[11px] text-emerald-400 text-center font-mono animate-fade-in">
                {savedStatusMessage}
              </p>
            )}
          </form>

          {/* Quick Safety Note */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Panic Key Reminder</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">Escape</kbd> anytime to instantly redirect your tab to Google Classroom!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
