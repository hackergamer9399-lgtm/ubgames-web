import React from 'react';
import { Game } from '../types';
import { Star, Play, Heart, Trash2, Code2 } from 'lucide-react';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onSelectGame: (game: Game) => void;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  onRemoveCustomGame?: (e: React.MouseEvent, gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onSelectGame,
  onToggleFavorite,
  onRemoveCustomGame,
}) => {
  const formattedPlays =
    game.plays >= 1000 ? `${(game.plays / 1000).toFixed(1)}k` : `${game.plays}`;

  return (
    <div
      onClick={() => onSelectGame(game)}
      className="group relative bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
    >
      {/* Thumbnail Header Area */}
      <div
        className="relative h-44 w-full overflow-hidden flex items-center justify-center"
        style={{
          background: game.thumbnail || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Center Game Visual Icon / Title initials */}
        <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            {game.isCustom ? (
              <Code2 className="w-6 h-6 text-cyan-300" />
            ) : (
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            )}
          </div>
        </div>

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          {game.badge ? (
            <span
              className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md border ${
                game.badge === 'HOT'
                  ? 'bg-rose-500/90 text-white border-rose-400/50'
                  : game.badge === 'POPULAR'
                  ? 'bg-amber-500/90 text-white border-amber-400/50'
                  : game.badge === 'CLASSIC'
                  ? 'bg-indigo-500/90 text-white border-indigo-400/50'
                  : 'bg-cyan-500/90 text-white border-cyan-400/50'
              }`}
            >
              {game.badge}
            </span>
          ) : (
            <span />
          )}

          {/* Action Buttons (Favorite / Delete Custom) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {game.isCustom && onRemoveCustomGame && (
              <button
                onClick={(e) => onRemoveCustomGame(e, game.id)}
                title="Remove Custom Game"
                className="p-2 rounded-xl bg-slate-950/80 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/50 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={(e) => onToggleFavorite(e, game.id)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                  : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-rose-400 hover:border-slate-700'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Hover overlay with Play Button */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Play className="w-3.5 h-3.5 fill-slate-950" /> Play Now
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
            {game.category}
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {game.description}
        </p>

        {/* Footer Meta */}
        <div className="mt-2 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1 font-semibold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>

          <div className="text-[11px] text-slate-500">
            {formattedPlays} plays
          </div>
        </div>
      </div>
    </div>
  );
};
