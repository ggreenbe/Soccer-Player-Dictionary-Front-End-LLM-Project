import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ListTree, Copy, Check, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { Player } from '../../types/soccer';
import { exportAsPythonDictionary } from '../../utils/calculator';

interface FullContentsModalProps {
  players: Player[];
  onSelectPlayerToZoom: (player: Player) => void;
  onClose: () => void;
}

export const FullContentsModal: React.FC<FullContentsModalProps> = ({
  players,
  onSelectPlayerToZoom,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'visual_tree' | 'python_code'>('visual_tree');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    legends: true,
    'legends-midfielders': true,
    'legends-forwards': true,
    stars: true,
    'stars-midfielders': true,
    'stars-forwards': true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const pythonCode = exportAsPythonDictionary(players);

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlayersByGroup = (cat: 'legends' | 'stars', pos: 'midfielders' | 'forwards') =>
    players.filter((p) => p.category === cat && p.position === pos);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative w-full max-w-3xl rounded-2xl bg-slate-950 border border-white/15 shadow-2xl p-6 text-white overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ListTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-tight">
                Menu 2 | List Full Contents
              </h2>
              <p className="text-xs text-slate-400 font-tactical">
                Complete interactive Python dictionary structure & export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-white/10 text-xs font-tactical">
              <button
                onClick={() => setViewMode('visual_tree')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'visual_tree' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tree View
              </button>
              <button
                onClick={() => setViewMode('python_code')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'python_code' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Python Code
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {viewMode === 'python_code' ? (
            <div className="relative rounded-xl bg-slate-900 border border-white/10 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-slate-400">
                <span className="text-[11px]">csp2_dictionary_project.py format</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-tactical text-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Python Code!' : 'Copy to Clipboard'}</span>
                </button>
              </div>
              <pre>{pythonCode}</pre>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {/* Legends Section */}
              <div className="rounded-xl bg-slate-900/80 border border-amber-500/30 overflow-hidden">
                <button
                  onClick={() => toggleSection('legends')}
                  className="w-full px-4 py-2.5 flex items-center justify-between bg-amber-950/30 hover:bg-amber-950/50 transition-colors text-amber-300 font-bold font-display uppercase tracking-wider text-sm"
                >
                  <div className="flex items-center gap-2">
                    {expandedSections['legends'] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span>"legends" ({players.filter((p) => p.category === 'legends').length} Players)</span>
                  </div>
                </button>

                {expandedSections['legends'] && (
                  <div className="p-3 space-y-3">
                    {/* Midfielders */}
                    <div className="pl-4 border-l-2 border-amber-500/40 space-y-2">
                      <span className="text-amber-400 font-bold tracking-wide">
                        "midfielders":
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {getPlayersByGroup('legends', 'midfielders').map((player) => (
                          <div
                            key={player.id}
                            className="p-2.5 rounded-lg bg-slate-950/70 border border-white/10 flex items-center justify-between group hover:border-amber-400/50 transition-colors"
                          >
                            <div>
                              <div className="font-sans font-bold text-white text-xs">
                                {player.name}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span>G: {player.stats.goals}</span>
                                <span>A: {player.stats.assists}</span>
                                <span>T: {player.stats.trophies}</span>
                                <span>C: {player.stats.clubs}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                onSelectPlayerToZoom(player);
                                onClose();
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-amber-400 text-slate-950 transition-all hover:scale-105"
                              title="Zoom on pitch"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Forwards */}
                    <div className="pl-4 border-l-2 border-amber-500/40 space-y-2">
                      <span className="text-amber-400 font-bold tracking-wide">
                        "forwards":
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {getPlayersByGroup('legends', 'forwards').map((player) => (
                          <div
                            key={player.id}
                            className="p-2.5 rounded-lg bg-slate-950/70 border border-white/10 flex items-center justify-between group hover:border-amber-400/50 transition-colors"
                          >
                            <div>
                              <div className="font-sans font-bold text-white text-xs">
                                {player.name}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span>G: {player.stats.goals}</span>
                                <span>A: {player.stats.assists}</span>
                                <span>T: {player.stats.trophies}</span>
                                <span>C: {player.stats.clubs}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                onSelectPlayerToZoom(player);
                                onClose();
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-amber-400 text-slate-950 transition-all hover:scale-105"
                              title="Zoom on pitch"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stars Section */}
              <div className="rounded-xl bg-slate-900/80 border border-cyan-500/30 overflow-hidden">
                <button
                  onClick={() => toggleSection('stars')}
                  className="w-full px-4 py-2.5 flex items-center justify-between bg-cyan-950/30 hover:bg-cyan-950/50 transition-colors text-cyan-300 font-bold font-display uppercase tracking-wider text-sm"
                >
                  <div className="flex items-center gap-2">
                    {expandedSections['stars'] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span>"stars" ({players.filter((p) => p.category === 'stars').length} Players)</span>
                  </div>
                </button>

                {expandedSections['stars'] && (
                  <div className="p-3 space-y-3">
                    {/* Midfielders */}
                    <div className="pl-4 border-l-2 border-cyan-500/40 space-y-2">
                      <span className="text-cyan-400 font-bold tracking-wide">
                        "midfielders":
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {getPlayersByGroup('stars', 'midfielders').map((player) => (
                          <div
                            key={player.id}
                            className="p-2.5 rounded-lg bg-slate-950/70 border border-white/10 flex items-center justify-between group hover:border-cyan-400/50 transition-colors"
                          >
                            <div>
                              <div className="font-sans font-bold text-white text-xs">
                                {player.name}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span>G: {player.stats.goals}</span>
                                <span>A: {player.stats.assists}</span>
                                <span>T: {player.stats.trophies}</span>
                                <span>C: {player.stats.clubs}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                onSelectPlayerToZoom(player);
                                onClose();
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-cyan-400 text-slate-950 transition-all hover:scale-105"
                              title="Zoom on pitch"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Forwards */}
                    <div className="pl-4 border-l-2 border-cyan-500/40 space-y-2">
                      <span className="text-cyan-400 font-bold tracking-wide">
                        "forwards":
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {getPlayersByGroup('stars', 'forwards').map((player) => (
                          <div
                            key={player.id}
                            className="p-2.5 rounded-lg bg-slate-950/70 border border-white/10 flex items-center justify-between group hover:border-cyan-400/50 transition-colors"
                          >
                            <div>
                              <div className="font-sans font-bold text-white text-xs">
                                {player.name}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span>G: {player.stats.goals}</span>
                                <span>A: {player.stats.assists}</span>
                                <span>T: {player.stats.trophies}</span>
                                <span>C: {player.stats.clubs}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                onSelectPlayerToZoom(player);
                                onClose();
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-cyan-400 text-slate-950 transition-all hover:scale-105"
                              title="Zoom on pitch"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
