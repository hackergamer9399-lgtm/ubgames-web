import React, { useState, useEffect, useRef } from 'react';
import { Game, GameUserData } from '../types';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  Heart,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Trophy,
  StickyNote,
  Gamepad2,
  Info,
  Star,
  Check,
} from 'lucide-react';
import { getGameUserData, saveGameUserData } from '../utils/storage';

interface GamePlayerProps {
  game: Game;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  onSelectRelatedGame: (game: Game) => void;
  allGames: Game[];
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  isFavorite,
  onBack,
  onToggleFavorite,
  onSelectRelatedGame,
  allGames,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isTheater, setIsTheater] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [userData, setUserData] = useState<GameUserData>({ isFavorite });
  const [inputHighScore, setInputHighScore] = useState<string>('');
  const [inputNotes, setInputNotes] = useState<string>('');
  const [isNotesSaved, setIsNotesSaved] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);

  // Load user data on game change
  useEffect(() => {
    const data = getGameUserData(game.id);
    setUserData(data);
    setInputHighScore(data.highScore ? String(data.highScore) : '');
    setInputNotes(data.notes || '');
    setIframeKey(Date.now());
  }, [game.id]);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Reload iframe
  const handleReload = () => {
    setIframeKey(Date.now());
  };

  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  // Handle Like / Dislike
  const handleLikeDislike = (status: 'liked' | 'disliked') => {
    const newStatus = userData.likedStatus === status ? null : status;
    saveGameUserData(game.id, { likedStatus: newStatus });
    setUserData((prev) => ({ ...prev, likedStatus: newStatus }));
  };

  // Save High Score
  const handleSaveHighScore = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreNum = parseInt(inputHighScore.trim(), 10) || 0;
    saveGameUserData(game.id, { highScore: scoreNum });
    setUserData((prev) => ({ ...prev, highScore: scoreNum }));
  };

  // Save Notes
  const handleSaveNotes = () => {
    saveGameUserData(game.id, { notes: inputNotes });
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 2000);
  };

  // Related games (same category excluding current)
  const relatedGames = allGames
    .filter((g) => g.id !== game.id && (g.category === game.category || g.tags.some((t) => game.tags.includes(t))))
    .slice(0, 4);

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Top Header Navigation & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Games</span>
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-slate-100">{game.title}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                {game.category}
              </span>
            </div>
          </div>
        </div>

        {/* Player Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={(e) => onToggleFavorite(e, game.id)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleReload}
            title="Reload Game"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-sky-400" />
          </button>

          <button
            onClick={() => setIsTheater(!isTheater)}
            title={isTheater ? 'Default Size' : 'Theater Mode'}
            className={`p-2 rounded-xl border transition-all ${
              isTheater
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {isTheater ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main Iframe Player Container */}
      <div
        ref={containerRef}
        className={`relative w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-center items-center transition-all ${
          isFullscreen
            ? 'h-screen w-screen rounded-none border-none'
            : isTheater
            ? 'h-[80vh]'
            : 'h-[550px] sm:h-[620px]'
        }`}
      >
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={game.iframeUrl}
          srcDoc={game.srcDoc}
          title={game.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
          className="w-full h-full border-none bg-slate-950"
        />
      </div>

      {/* Game Details & User Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Controls */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Game Info & Rating */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{game.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-slate-400">
                  Played {game.plays.toLocaleString()} times
                </span>
              </div>

              {/* Like / Dislike */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLikeDislike('liked')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    userData.likedStatus === 'liked'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Like</span>
                </button>
                <button
                  onClick={() => handleLikeDislike('disliked')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    userData.likedStatus === 'disliked'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" /> Description
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">{game.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {game.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* How to Play & Controls */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-cyan-400" /> Controls & Instructions
            </h4>
            <ul className="space-y-2">
              {game.controls.map((ctrl, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <span>{ctrl}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: High Score Tracker & Personal Notes */}
        <div className="flex flex-col gap-6">
          {/* High Score Tracker */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> Personal High Score
              </h4>
              {userData.highScore ? (
                <span className="text-sm font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg">
                  {userData.highScore} pts
                </span>
              ) : null}
            </div>

            <form onSubmit={handleSaveHighScore} className="flex gap-2">
              <input
                type="number"
                value={inputHighScore}
                onChange={(e) => setInputHighScore(e.target.value)}
                placeholder="Set record score..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shrink-0 transition-all"
              >
                Save
              </button>
            </form>
          </div>

          {/* Game Notes */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <StickyNote className="w-4 h-4 text-purple-400" /> Game Notes & Tips
              </h4>
              {isNotesSaved && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <textarea
              value={inputNotes}
              onChange={(e) => setInputNotes(e.target.value)}
              placeholder="Save level codes, cheat keys, strategy notes..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
            />

            <button
              onClick={handleSaveNotes}
              className="self-end px-3.5 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>

      {/* Related Games Bar */}
      {relatedGames.length > 0 && (
        <div className="mt-4 pt-6 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 mb-4">You Might Also Like</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedGames.map((relGame) => (
              <div
                key={relGame.id}
                onClick={() => onSelectRelatedGame(relGame)}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl cursor-pointer transition-all hover:-translate-y-1 group"
              >
                <div
                  className="h-24 w-full rounded-lg mb-2 flex items-center justify-center font-bold text-white text-xs"
                  style={{ background: relGame.thumbnail }}
                >
                  <span className="group-hover:scale-105 transition-transform">{relGame.title}</span>
                </div>
                <div className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300">
                  {relGame.title}
                </div>
                <div className="text-[10px] text-slate-400">{relGame.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
