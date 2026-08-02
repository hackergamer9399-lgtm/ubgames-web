import React from 'react';
import { GameCategory } from '../types';
import { Search, Plus, Shield, MessageSquarePlus, Gamepad2, X, Sparkles } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: GameCategory;
  setSelectedCategory: (cat: GameCategory) => void;
  onOpenAddModal: () => void;
  onOpenCloakModal: () => void;
  onOpenRequestModal: () => void;
  totalGamesCount: number;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenAddModal,
  onOpenCloakModal,
  onOpenRequestModal,
  totalGamesCount,
  favoritesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Branding */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  Unblocked Games
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                  JSON Embeds
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {totalGamesCount} Free HTML5 & Iframe Arcade Games
              </p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenCloakModal}
              title="Tab Cloak / Panic Disguise"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={onOpenAddModal}
              title="Add Custom Game"
              className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by game title, category, or tag..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Quick Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={onOpenCloakModal}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700/80 text-emerald-400 border border-slate-700/80 hover:border-emerald-500/40 transition-all shadow-sm"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Panic / Cloak</span>
          </button>

          <button
            onClick={onOpenRequestModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80 transition-all"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-purple-400" />
            <span>Request</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
