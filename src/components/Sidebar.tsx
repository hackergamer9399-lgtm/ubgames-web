import React from 'react';
import { GameCategory } from '../types';
import {
  Gamepad2,
  Flame,
  Star,
  Zap,
  Puzzle,
  History,
  Trophy,
  Car,
  FolderPlus,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: GameCategory;
  setSelectedCategory: (category: GameCategory) => void;
  favoritesCount: number;
  customCount: number;
  totalCount: number;
}

const CATEGORY_ITEMS: { name: GameCategory; label: string; icon: React.ReactNode }[] = [
  { name: 'All', label: 'All Games', icon: <Gamepad2 className="w-4 h-4 text-cyan-400" /> },
  { name: 'Favorites', label: 'My Favorites', icon: <Star className="w-4 h-4 text-amber-400" /> },
  { name: 'Action', label: 'Action & Runner', icon: <Flame className="w-4 h-4 text-rose-400" /> },
  { name: 'Arcade', label: 'Classic Arcade', icon: <Zap className="w-4 h-4 text-emerald-400" /> },
  { name: 'Puzzle', label: 'Puzzle & Brain', icon: <Puzzle className="w-4 h-4 text-purple-400" /> },
  { name: 'Retro', label: 'Retro 8-Bit', icon: <History className="w-4 h-4 text-sky-400" /> },
  { name: 'Driving', label: 'Driving & Drift', icon: <Car className="w-4 h-4 text-orange-400" /> },
  { name: 'Strategy', label: 'Strategy & Board', icon: <Trophy className="w-4 h-4 text-blue-400" /> },
  { name: 'Custom', label: 'Custom Iframe Games', icon: <FolderPlus className="w-4 h-4 text-indigo-400" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  favoritesCount,
  customCount,
  totalCount,
}) => {
  return (
    <aside className="w-full lg:w-64 shrink-0 bg-slate-900/60 lg:bg-slate-900/40 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-4 flex flex-col gap-6">
      {/* Categories Header */}
      <div>
        <div className="flex items-center justify-between px-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /> Categories
          </span>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
            {totalCount} Total
          </span>
        </div>

        {/* Navigation list */}
        <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
          {CATEGORY_ITEMS.map((item) => {
            const isActive = selectedCategory === item.name;
            let badgeCount: number | null = null;
            if (item.name === 'Favorites') badgeCount = favoritesCount;
            if (item.name === 'Custom') badgeCount = customCount;
            if (item.name === 'All') badgeCount = totalCount;

            return (
              <button
                key={item.name}
                onClick={() => setSelectedCategory(item.name)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {badgeCount !== null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-cyan-500/30 text-cyan-200'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Panic Key Notice Box */}
      <div className="hidden lg:block mt-auto p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl shadow-inner">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
          <ShieldAlert className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Quick Disguise Hotkey</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
          Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded font-mono border border-slate-700 font-bold">Esc</kbd> anytime to instantly open Google Classroom / hide tab.
        </p>
      </div>
    </aside>
  );
};
