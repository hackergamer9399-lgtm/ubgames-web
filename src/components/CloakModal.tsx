import React, { useState, useEffect } from 'react';
import { CloakConfig, CloakPreset } from '../types';
import { X, Shield, EyeOff, Check, ExternalLink } from 'lucide-react';
import { getCloakConfig, saveCloakConfig } from '../utils/storage';

interface CloakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS: { id: CloakPreset; name: string; title: string; icon: string }[] = [
  {
    id: 'none',
    name: 'Normal (Unblocked Games Hub)',
    title: 'Unblocked Games Hub - Instant HTML5 Games',
    icon: '🎮',
  },
  {
    id: 'google_classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    icon: '📚',
  },
  {
    id: 'google_docs',
    name: 'Google Docs',
    title: 'Google Docs - Untitled document',
    icon: '📄',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    icon: '🌐',
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas LMS',
    icon: '🎓',
  },
];

export const CloakModal: React.FC<CloakModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<CloakConfig>(getCloakConfig());
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getCloakConfig());
      setSavedStatus(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: CloakPreset) => {
    const updated = { ...config, preset };
    setConfig(updated);
    saveCloakConfig(updated);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handlePanicRedirect = () => {
    window.location.href = config.panicUrl || 'https://classroom.google.com';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Tab Cloak & Panic Disguise</h3>
              <p className="text-xs text-slate-400">Change browser tab title & icon for school safety</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedStatus && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Tab cloak setting updated!</span>
          </div>
        )}

        {/* Presets List */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Choose Tab Disguise Preset
          </label>

          <div className="grid grid-cols-1 gap-2">
            {PRESETS.map((p) => {
              const isSelected = config.preset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className={`p-3 rounded-2xl text-left flex items-center justify-between transition-all border ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{p.icon}</span>
                    <div>
                      <div className="text-xs font-bold">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono line-clamp-1">{p.title}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency Panic Key Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-emerald-400" /> Panic Hotkey Redirect
            </span>
            <span className="text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
              Press [Esc]
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Pressing <kbd className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700 font-mono font-bold">Esc</kbd> anywhere on the site will instantly redirect your current tab to Google Classroom.
          </p>

          <button
            onClick={handlePanicRedirect}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test Panic Key Jump Now</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
        >
          Close Settings
        </button>
      </div>
    </div>
  );
};
