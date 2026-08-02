import React, { useState, useMemo } from 'react';
import { Game, GameCategory } from '../types';
import { GameCard } from './GameCard';
import { SearchX, ArrowUpDown, PlusCircle, Sparkles } from 'lucide-react';

interface GameGridProps {
  games: Game[];
  selectedCategory: GameCategory;
  searchQuery: string;
  favorites: string[];
  onSelectGame: (game: Game) => void;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  onRemoveCustomGame?: (e: React.MouseEvent, gameId: string) => void;
  onOpenAddModal: () => void;
  onClearSearch: () => void;
}

type SortOption = 'popular' | 'rating' | 'title' | 'newest';

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  selectedCategory,
  searchQuery,
  favorites,
  onSelectGame,
  onToggleFavorite,
  onRemoveCustomGame,
  onOpenAddModal,
  onClearSearch,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Category filter
    if (selectedCategory === 'Favorites') {
      result = result.filter((g) => favorites.includes(g.id));
    } else if (selectedCategory === 'Custom') {
      result = result.filter((g) => g.isCustom);
    } else if (selectedCategory !== 'All') {
      result = result.filter((g) => g.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'popular') return b.plays - a.plays;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'newest') return (b.isCustom ? 1 : 0) - (a.isCustom ? 1 : 0);
      return 0;
    });

    return result;
  }, [games, selectedCategory, searchQuery, favorites, sortBy]);

  return (
    <main className="flex-1 p-4 lg:p-8 flex flex-col gap-6">
      {/* Category Banner & Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <span>
                {selectedCategory === 'All'
                  ? 'All Unblocked Games'
                  : selectedCategory === 'Favorites'
                  ? 'My Favorite Games'
                  : selectedCategory === 'Custom'
                  ? 'Custom Iframe Games'
                  : `${selectedCategory} Games`}
              </span>
            </h2>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-0.5 rounded-full">
              {filteredGames.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? (
              <span>Matching search for &ldquo;{searchQuery}&rdquo;</span>
            ) : selectedCategory === 'Favorites' ? (
              <span>Your saved favorite games for instant access</span>
            ) : selectedCategory === 'Custom' ? (
              <span>Custom HTML5 & Iframe games saved in JSON library</span>
            ) : (
              <span>Play instantly in browser with full controls & state support</span>
            )}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sort by:</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-900 text-xs font-medium text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="title">Title (A-Z)</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Game Cards Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isFavorite={favorites.includes(game.id)}
              onSelectGame={onSelectGame}
              onToggleFavorite={onToggleFavorite}
              onRemoveCustomGame={onRemoveCustomGame}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-4 border border-slate-700/50">
            <SearchX className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-1">
            No Games Found
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            {searchQuery
              ? `We couldn't find any games matching "${searchQuery}". Try searching another keyword or clear search.`
              : selectedCategory === 'Favorites'
              ? 'You have not added any games to your favorites yet. Click the heart icon on any game card!'
              : selectedCategory === 'Custom'
              ? 'You have not added any custom iframe games yet. Paste any iframe URL or embed code to start!'
              : 'No games available in this category yet.'}
          </p>

          <div className="flex items-center gap-3">
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                Clear Search Filter
              </button>
            )}
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Custom Game</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
