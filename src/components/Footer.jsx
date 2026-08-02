import React from 'react';
import { Gamepad2, Shield, Heart, FileJson, Lock } from 'lucide-react';

export const Footer = ({ onOpenCloakModal, onOpenAddModal }) => {
  return (
    <footer className="mt-16 bg-slate-900/80 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-200">Unblocked Games Hub</div>
            <p className="text-[11px] text-slate-500">Pure HTML5, CSS3 & JavaScript Arcade Engine</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-4 text-slate-300 font-medium">
          <button
            onClick={onOpenCloakModal}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cloak Mask</span>
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={onOpenAddModal}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <FileJson className="w-3.5 h-3.5 text-indigo-400" />
            <span>Manage JSON Games</span>
          </button>
        </div>

        {/* Disclaimer / Note */}
        <div className="text-right text-[11px] text-slate-500 max-w-xs">
          All games are hosted via secure sandbox iframes. No restricted external plugins required.
        </div>
      </div>
    </footer>
  );
};
