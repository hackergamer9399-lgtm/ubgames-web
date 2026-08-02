import React from 'react';
import { Gamepad2, Shield, PlusCircle, MessageSquarePlus, Code } from 'lucide-react';

interface FooterProps {
  onOpenAddModal: () => void;
  onOpenCloakModal: () => void;
  onOpenRequestModal: () => void;
  totalGames: number;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAddModal,
  onOpenCloakModal,
  onOpenRequestModal,
  totalGames,
}) => {
  return (
    <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Branding */}
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-200 font-extrabold text-sm">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>Unblocked Games Hub</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded-md">
              JSON Embed Engine
            </span>
          </div>
          <p className="text-slate-500 text-[11px] max-w-md leading-relaxed">
            Instant browser HTML5 games stored cleanly in a JSON database structure with iframe support, custom embeds, high score tracking, and tab cloaking.
          </p>
        </div>

        {/* Quick Footer Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300 font-medium">
          <button
            onClick={onOpenAddModal}
            className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add Custom Iframe</span>
          </button>
          <button
            onClick={onOpenCloakModal}
            className="hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tab Cloak</span>
          </button>
          <button
            onClick={onOpenRequestModal}
            className="hover:text-purple-300 flex items-center gap-1.5 transition-colors"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-purple-400" />
            <span>Request Game</span>
          </button>
        </div>

        {/* Copyright & Info */}
        <div className="text-center md:text-right text-[11px] text-slate-500 flex flex-col gap-1">
          <div>{totalGames} Games Indexed</div>
          <div className="flex items-center justify-center md:justify-end gap-1">
            <Code className="w-3 h-3 text-slate-400" />
            <span>HTML5 • JS • CSS • JSON</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
