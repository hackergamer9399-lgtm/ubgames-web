import React, { useState, useEffect, useCallback } from 'react';
import { Game, GameCategory } from './types';
import {
  getAllGames,
  getFavoritesList,
  toggleFavorite,
  addCustomGame,
  removeCustomGame,
  getCloakConfig,
  applyCloak,
} from './utils/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GameGrid } from './components/GameGrid';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { CloakModal } from './components/CloakModal';
import { RequestModal } from './components/RequestModal';
import { Footer } from './components/Footer';

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Load initial data
  const refreshGamesData = useCallback(() => {
    const all = getAllGames();
    setGames(all);
    setFavorites(getFavoritesList());
  }, []);

  useEffect(() => {
    refreshGamesData();
    applyCloak(getCloakConfig());
  }, [refreshGamesData]);

  // Global Panic key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const config = getCloakConfig();
        if (config.panicUrl) {
          window.location.href = config.panicUrl;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Favorite toggle handler
  const handleToggleFav = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    toggleFavorite(gameId);
    setFavorites(getFavoritesList());
  };

  // Add custom game handler
  const handleAddCustomGame = (
    newGame: Omit<Game, 'id' | 'isCustom' | 'rating' | 'plays'>
  ) => {
    addCustomGame(newGame);
    refreshGamesData();
  };

  // Remove custom game handler
  const handleRemoveCustomGame = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this custom game?')) {
      removeCustomGame(gameId);
      refreshGamesData();
      if (activeGame?.id === gameId) {
        setActiveGame(null);
      }
    }
  };

  const customCount = games.filter((g) => g.isCustom).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveGame(null);
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenRequestModal={() => setIsRequestModalOpen(true)}
        totalGamesCount={games.length}
        favoritesCount={favorites.length}
      />

      {/* Main Content Layout */}
      {activeGame ? (
        /* Game Player View */
        <GamePlayer
          game={activeGame}
          isFavorite={favorites.includes(activeGame.id)}
          onBack={() => setActiveGame(null)}
          onToggleFavorite={handleToggleFav}
          onSelectRelatedGame={(g) => setActiveGame(g)}
          allGames={games}
        />
      ) : (
        /* Game Explorer Grid View */
        <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
          <Sidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => setSelectedCategory(cat)}
            favoritesCount={favorites.length}
            customCount={customCount}
            totalCount={games.length}
          />

          <GameGrid
            games={games}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            favorites={favorites}
            onSelectGame={(g) => setActiveGame(g)}
            onToggleFavorite={handleToggleFav}
            onRemoveCustomGame={handleRemoveCustomGame}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onClearSearch={() => setSearchQuery('')}
          />
        </div>
      )}

      {/* Footer */}
      <Footer
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenRequestModal={() => setIsRequestModalOpen(true)}
        totalGames={games.length}
      />

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddCustomGame}
        onRefreshGames={refreshGamesData}
      />

      <CloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
      />

      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
}
