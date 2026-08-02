import React from 'react';
import {
  Gamepad2,
  Heart,
  Flame,
  Clock,
  Swords,
  Trophy,
  Car,
  Brain,
  Layers,
  Code2,
  Sparkles,
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'All', label: 'All Games', icon: Gamepad2 },
  { id: 'Favorites', label: 'My Favorites', icon: Heart },
  { id: 'Popular', label: 'Trending', icon: Flame },
  { id: 'Action', label: 'Action & Arcade', icon: Swords },
  { id: 'Sports', label: 'Sports & Skill', icon: Trophy },
  { id: 'Driving', label: 'Driving & Racing', icon: Car },
  { id: 'Puzzle', label: 'Puzzle & Logic', icon: Brain },
  { id: 'Retro', label: 'Retro & Classics', icon: Clock },
  { id: 'Custom', label: 'User Custom', icon: Code2 },
];

export const Sidebar = ({
  selectedCategory,
  onSelectCategory,
  favoritesCount,
  customCount,
  totalCount,
}) => {
  return (
    <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2 flex items-center justify-between">
            <span>Categories</span>
            <span className="text-[10px] text-slate-600 font-mono">{totalCount} Games</span>
          </div>

          <nav className="space-y-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              let badge = null;
              if (cat.id === 'Favorites' && favoritesCount > 0) {
                badge = (
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800/50">
                    {favoritesCount}
                  </span>
                );
              } else if (cat.id === 'Custom' && customCount > 0) {
                badge = (
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/50">
                    {customCount}
                  </span>
                );
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                  {badge}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Feature info callout */}
        <div className="hidden md:block p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Unblocked & Safe</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Games are embedded locally via secure standard HTML5 iframes or source bundles stored in a structured JSON database.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/60 hidden md:block">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Engine: React JS</span>
          <span>v2.0 JS</span>
        </div>
      </div>
    </aside>
  );
};
