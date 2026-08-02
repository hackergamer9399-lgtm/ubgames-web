import React, { useState } from 'react';
import { Game, GameCategory } from '../types';
import { X, Plus, FileCode, Download, Upload, Check, AlertCircle, Play } from 'lucide-react';
import { exportGamesJSON, importGamesJSON } from '../utils/storage';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: Omit<Game, 'id' | 'isCustom' | 'rating' | 'plays'>) => void;
  onRefreshGames: () => void;
}

const CATEGORIES: GameCategory[] = [
  'Action',
  'Arcade',
  'Puzzle',
  'Retro',
  'Sports',
  'Driving',
  'Strategy',
];

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onAddGame,
  onRefreshGames,
}) => {
  const [embedMode, setEmbedMode] = useState<'url' | 'code'>('url');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GameCategory>('Arcade');
  const [description, setDescription] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [controlsInput, setControlsInput] = useState('');
  const [previewActive, setPreviewActive] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse iframeUrl or srcDoc from raw code if in code mode
    let finalUrl = iframeUrl.trim();
    let finalSrcDoc = srcDoc.trim();

    if (embedMode === 'code' && finalSrcDoc.includes('<iframe')) {
      // Check if it has a src attribute inside the iframe code
      const srcMatch = finalSrcDoc.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1].startsWith('http')) {
        finalUrl = srcMatch[1];
        finalSrcDoc = '';
      }
    }

    if (!finalUrl && !finalSrcDoc) {
      setStatusMsg({ text: 'Please provide either a valid Iframe URL or HTML embed code.', type: 'error' });
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const controls = controlsInput
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    onAddGame({
      title: title.trim(),
      category,
      description: description.trim() || 'Custom user embedded iframe game',
      iframeUrl: finalUrl || undefined,
      srcDoc: finalSrcDoc || undefined,
      thumbnail: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
      tags: tags.length ? tags : ['Custom', category],
      controls: controls.length ? controls : ['Use keyboard & mouse to play'],
    });

    setStatusMsg({ text: 'Game added successfully to JSON library!', type: 'success' });
    setTimeout(() => {
      onClose();
      resetForm();
    }, 1200);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIframeUrl('');
    setSrcDoc('');
    setTagsInput('');
    setControlsInput('');
    setPreviewActive(false);
    setStatusMsg(null);
  };

  const handleExport = () => {
    const json = exportGamesJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unblocked_custom_games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!jsonInput.trim()) return;
    const success = importGamesJSON(jsonInput);
    if (success) {
      setStatusMsg({ text: 'Successfully imported games from JSON!', type: 'success' });
      onRefreshGames();
      setTimeout(() => {
        setShowImport(false);
        setJsonInput('');
        setStatusMsg(null);
      }, 1500);
    } else {
      setStatusMsg({ text: 'Failed to import JSON. Ensure valid format.', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Add Custom Iframe Game</h3>
              <p className="text-xs text-slate-400">Save custom iframe game to JSON library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Mode Selector / Import Export Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setEmbedMode('url');
                setShowImport(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                embedMode === 'url' && !showImport
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Iframe Direct URL
            </button>
            <button
              type="button"
              onClick={() => {
                setEmbedMode('code');
                setShowImport(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                embedMode === 'code' && !showImport
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HTML Embed Code
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowImport(!showImport)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Import JSON View */}
        {showImport ? (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400" /> Paste JSON Games Array
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[ { "title": "My Game", "iframeUrl": "https://...", "category": "Arcade" } ]'
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={handleImportSubmit}
              className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all"
            >
              Confirm Import JSON
            </button>
          </div>
        ) : (
          /* Add Form */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Game Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pixel Runner 3D"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GameCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Short Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Fun unblocked game where you..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {embedMode === 'url' ? (
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Iframe Source URL *</label>
                <input
                  type="url"
                  value={iframeUrl}
                  onChange={(e) => setIframeUrl(e.target.value)}
                  placeholder="https://example.com/embed/game"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Raw HTML Iframe Code *</label>
                <textarea
                  value={srcDoc}
                  onChange={(e) => setSrcDoc(e.target.value)}
                  placeholder='<iframe src="https://..." width="100%" height="500px"></iframe>'
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="3D, Fast, Physics"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Controls (one per line)</label>
                <input
                  type="text"
                  value={controlsInput}
                  onChange={(e) => setControlsInput(e.target.value)}
                  placeholder="Arrow Keys - Move"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Test Preview */}
            {previewActive && (
              <div className="mt-2 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 h-64">
                <iframe
                  src={iframeUrl || undefined}
                  srcDoc={srcDoc || undefined}
                  title="Game Preview"
                  className="w-full h-full border-none"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-2">
              <button
                type="button"
                onClick={() => setPreviewActive(!previewActive)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>{previewActive ? 'Hide Preview' : 'Test Iframe Preview'}</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all"
              >
                Add Game to JSON
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
