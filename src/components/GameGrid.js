import React from 'react';
import { GameCard } from './GameCard.js';
import { Gamepad2, Plus, SearchX } from 'lucide-react';

export const GameGrid = ({
  games,
  favoritesList,
  onPlayGame,
  onToggleFavorite,
  onDeleteCustom,
  categoryTitle,
  onOpenAddModal,
}) => {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-slate-900/40 rounded-3xl border border-slate-800 border-dashed">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
          <SearchX className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-200 mb-1">No games found</h3>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          We couldn't find any games in "{categoryTitle}" matching your current query. You can add a custom iframe game or request a new title!
        </p>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Game</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-extrabold text-slate-100 tracking-tight">
            {categoryTitle}
          </h2>
          <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded-full">
            {games.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isFavorite={favoritesList.includes(game.id)}
            onPlay={onPlayGame}
            onToggleFavorite={onToggleFavorite}
            onDeleteCustom={onDeleteCustom}
          />
        ))}
      </div>
    </div>
  );
};
