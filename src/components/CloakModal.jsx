import React, { useState, useEffect } from 'react';
import { X, Shield, Eye, Check, ExternalLink, Zap } from 'lucide-react';
import { getCloakConfig, saveCloakConfig } from '../utils/storage.js';

export const CloakModal = ({ isOpen, onClose }) => {
  const [preset, setPreset] = useState('none');
  const [customTitle, setCustomTitle] = useState('');
  const [customIcon, setCustomIcon] = useState('');
  const [panicKey, setPanicKey] = useState('Escape');
  const [panicUrl, setPanicUrl] = useState('https://classroom.google.com');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getCloakConfig();
      setPreset(config.preset || 'none');
      setCustomTitle(config.customTitle || '');
      setCustomIcon(config.customIcon || '');
      setPanicKey(config.panicKey || 'Escape');
      setPanicUrl(config.panicUrl || 'https://classroom.google.com');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const config = {
      preset,
      customTitle: preset === 'custom' ? customTitle : undefined,
      customIcon: preset === 'custom' ? customIcon : undefined,
      panicKey,
      panicUrl,
    };
    saveCloakConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-lg">Tab Cloak & Panic Button</h3>
              <p className="text-xs text-slate-400">Mask browser title, favicon, or set instant panic key</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs text-slate-300">
          {/* Preset Disguises */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Tab Mask Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'Default (Unblocked Games)' },
                { id: 'google_classroom', label: 'Google Classroom' },
                { id: 'google_docs', label: 'Google Docs' },
                { id: 'wikipedia', label: 'Wikipedia' },
                { id: 'canvas', label: 'Canvas LMS' },
                { id: 'custom', label: 'Custom Title & Icon' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPreset(p.id)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    preset === p.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom title/icon inputs if custom chosen */}
          {preset === 'custom' && (
            <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <label className="font-semibold text-slate-300">Fake Tab Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. History Homework Notes"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1 text-slate-100"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300">Fake Favicon URL</label>
                <input
                  type="url"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1 text-slate-100 font-mono"
                />
              </div>
            </div>
          )}

          {/* Panic Key Settings */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Panic Hotkey Redirect</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-400">Trigger Key</label>
                <select
                  value={panicKey}
                  onChange={(e) => setPanicKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-1 text-slate-100 font-mono"
                >
                  <option value="Escape">Escape Key</option>
                  <option value="` font-mono">Backtick (`)</option>
                  <option value="F2">F2 Key</option>
                  <option value="p">Letter P</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-400">Panic Redirect URL</label>
                <input
                  type="url"
                  value={panicUrl}
                  onChange={(e) => setPanicUrl(e.target.value)}
                  placeholder="https://classroom.google.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-1 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Cloak Settings Applied!</span>
              </span>
            ) : (
              <span className="text-slate-500 text-[11px]">Pressing key immediately redirects window location</span>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
              >
                Apply Cloak
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
