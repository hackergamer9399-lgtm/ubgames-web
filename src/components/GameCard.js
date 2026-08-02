import React from 'react';
import { Play, Heart, Star, Sparkles, Trash2, Tag } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onPlay,
  onToggleFavorite,
  onDeleteCustom,
}) => {
  return (
    <div className="group relative bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col overflow-hidden">
      {/* Thumbnail Header */}
      <div
        className="relative h-40 w-full overflow-hidden flex items-center justify-center cursor-pointer"
        style={{ background: game.thumbnail }}
        onClick={() => onPlay(game)}
      >
        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 text-[10px] font-bold text-slate-300">
          <Tag className="w-3 h-3 text-cyan-400" />
          <span>{game.category}</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md border transition-all ${
            isFavorite
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-rose-400'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Custom Game Badge & Delete Option */}
        {game.isCustom && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
            <span className="bg-indigo-950/90 text-indigo-300 border border-indigo-700/60 text-[9px] font-extrabold px-2 py-0.5 rounded-md">
              USER CUSTOM
            </span>
          </div>
        )}

        {/* Big Hover Play Icon */}
        <div className="z-10 w-12 h-12 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 scale-90 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onPlay(game)}
              className="font-bold text-slate-100 text-base group-hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer"
            >
              {game.title}
            </h3>
            {game.isCustom && onDeleteCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete custom game "${game.title}"?`)) {
                    onDeleteCustom(game.id);
                  }
                }}
                title="Delete Custom Game"
                className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Rating, Plays & Tags */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1 font-semibold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{game.rating ? game.rating.toFixed(1) : '5.0'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
            <span>{(game.plays || 1).toLocaleString()} plays</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => onPlay(game)}
          className="w-full py-2 px-3 rounded-xl bg-slate-800 group-hover:bg-cyan-500 text-slate-200 group-hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play Now</span>
        </button>
      </div>
    </div>
  );
};
