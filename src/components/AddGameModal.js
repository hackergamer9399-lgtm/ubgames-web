import React, { useState } from 'react';
import { X, Plus, Code, Download, Upload, CheckCircle2, FileJson } from 'lucide-react';
import { addCustomGame, exportGamesJSON, importGamesJSON } from '../utils/storage.js';

export const AddGameModal = ({ isOpen, onClose, onGameAdded }) => {
  const [mode, setMode] = useState('iframe'); // 'iframe' | 'srcDoc' | 'json'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'json') {
      const success = importGamesJSON(jsonInput);
      if (success) {
        setStatusMessage('Games imported successfully from JSON!');
        setTimeout(() => {
          onGameAdded();
          onClose();
        }, 800);
      } else {
        setStatusMessage('Error: Invalid JSON format or missing title/iframeUrl!');
      }
      return;
    }

    if (!title) return;

    if (mode === 'iframe' && !iframeUrl) return;
    if (mode === 'srcDoc' && !srcDoc) return;

    const gradients = [
      'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    ];
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];

    addCustomGame({
      title,
      category,
      description: description || 'User-submitted unblocked game iframe embed.',
      iframeUrl: mode === 'iframe' ? iframeUrl : undefined,
      srcDoc: mode === 'srcDoc' ? srcDoc : undefined,
      thumbnail: randomGrad,
      tags: ['Custom', category],
      controls: ['Mouse / Keyboard'],
    });

    setStatusMessage('Game added successfully!');
    setTimeout(() => {
      onGameAdded();
      onClose();
    }, 600);
  };

  const handleExportJSON = () => {
    const jsonStr = exportGamesJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unblocked-games-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-lg">Add Unblocked Game</h3>
              <p className="text-xs text-slate-400">Store iframe URLs or raw HTML embed code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode selector */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('iframe')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'iframe' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            iFrame Web URL
          </button>
          <button
            type="button"
            onClick={() => setMode('srcDoc')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'srcDoc' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HTML / JS Code
          </button>
          <button
            type="button"
            onClick={() => setMode('json')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'json' ? 'bg-indigo-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Import / Export JSON
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-300">
          {mode === 'json' ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-200">Paste Games JSON Array</label>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="flex items-center gap-1 text-cyan-400 hover:underline text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup JSON</span>
                </button>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={7}
                placeholder={`[\n  {\n    "title": "Custom HTML Game",\n    "category": "Arcade",\n    "iframeUrl": "https://example.com/game"\n  }\n]`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Game Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Geometry Dash Lite"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Arcade">Arcade</option>
                    <option value="Action">Action</option>
                    <option value="Sports">Sports</option>
                    <option value="Driving">Driving</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Retro">Retro</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of gameplay"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {mode === 'iframe' ? (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">iFrame Web URL *</label>
                  <input
                    type="url"
                    required
                    value={iframeUrl}
                    onChange={(e) => setIframeUrl(e.target.value)}
                    placeholder="https://scratch.mit.edu/projects/embed/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Raw HTML / JS Code *</label>
                  <textarea
                    required
                    value={srcDoc}
                    onChange={(e) => setSrcDoc(e.target.value)}
                    rows={5}
                    placeholder="<canvas id='c'></canvas><script>...</script>"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
              )}
            </>
          )}

          {statusMessage && (
            <p className="text-xs text-emerald-400 font-semibold text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMessage}</span>
            </p>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
            >
              {mode === 'json' ? 'Import JSON' : 'Save Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
