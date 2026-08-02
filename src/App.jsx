import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { GameGrid } from './components/GameGrid.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import { RequestModal } from './components/RequestModal.jsx';
import { Footer } from './components/Footer.jsx';
import {
  getAllGames,
  getFavoritesList,
  toggleFavorite,
  removeCustomGame,
  getCloakConfig,
  applyCloak,
} from './utils/storage.js';

export function App() {
  const [games, setGames] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Load games & apply initial cloak configuration
  const loadGameData = () => {
    const all = getAllGames();
    setGames(all);
    setFavoritesList(getFavoritesList());
  };

  useEffect(() => {
    loadGameData();
    const cloakConfig = getCloakConfig();
    applyCloak(cloakConfig);

    // Global Panic Key Listener
    const handleKeyDown = (e) => {
      const config = getCloakConfig();
      if (config.panicKey && e.key === config.panicKey) {
        window.location.href = config.panicUrl || 'https://classroom.google.com';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFavorite = (gameId) => {
    toggleFavorite(gameId);
    setFavoritesList(getFavoritesList());
  };

  const handleDeleteCustom = (gameId) => {
    removeCustomGame(gameId);
    if (activeGame?.id === gameId) {
      setActiveGame(null);
    }
    loadGameData();
  };

  // Filter games based on search query and category
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Category filter
      if (selectedCategory === 'Favorites') {
        if (!favoritesList.includes(game.id)) return false;
      } else if (selectedCategory === 'Popular') {
        if (!game.plays || game.plays < 1000) return false;
      } else if (selectedCategory === 'Custom') {
        if (!game.isCustom) return false;
      } else if (selectedCategory !== 'All') {
        if (game.category !== selectedCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(query);
        const matchesCategory = game.category.toLowerCase().includes(query);
        const matchesDesc = game.description.toLowerCase().includes(query);
        const matchesTags = game.tags?.some((t) => t.toLowerCase().includes(query));

        return matchesTitle || matchesCategory || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [games, selectedCategory, searchQuery, favoritesList]);

  const customCount = useMemo(() => games.filter((g) => g.isCustom).length, [games]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenRequestModal={() => setIsRequestModalOpen(true)}
        totalGamesCount={games.length}
        favoritesCount={favoritesList.length}
      />

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Sidebar */}
        {!activeGame && (
          <Sidebar
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveGame(null);
            }}
            favoritesCount={favoritesList.length}
            customCount={customCount}
            totalCount={games.length}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeGame ? (
            <GamePlayer
              game={activeGame}
              onBack={() => setActiveGame(null)}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favoritesList.includes(activeGame.id)}
            />
          ) : (
            <GameGrid
              games={filteredGames}
              favoritesList={favoritesList}
              onPlayGame={(game) => setActiveGame(game)}
              onToggleFavorite={handleToggleFavorite}
              onDeleteCustom={handleDeleteCustom}
              categoryTitle={
                searchQuery
                  ? `Search results for "${searchQuery}"`
                  : selectedCategory === 'All'
                  ? 'All Unblocked Games'
                  : selectedCategory
              }
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onGameAdded={loadGameData}
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

export default App;
