import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calculator, Sparkles, HelpCircle } from 'lucide-react';
import { Player } from '../../types/soccer';
import { calculateCareerRating } from '../../utils/calculator';

interface CareerRatingModalProps {
  players: Player[];
  selectedPlayer: Player | null;
  onSelectPlayerToZoom: (player: Player) => void;
  onClose: () => void;
}

export const CareerRatingModal: React.FC<CareerRatingModalProps> = ({
  players,
  selectedPlayer,
  onSelectPlayerToZoom,
  onClose,
}) => {
  const [activePlayerId, setActivePlayerId] = useState<string>(
    selectedPlayer ? selectedPlayer.id : players[0]?.id || ''
  );

  const currentPlayer = players.find((p) => p.id === activePlayerId) || players[0];
  const ratingData = currentPlayer ? calculateCareerRating(currentPlayer) : null;

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
        className="relative w-full max-w-2xl rounded-2xl bg-slate-950 border border-white/15 shadow-2xl p-6 text-white overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-tight">
                Menu 1 | Career Stat Rating
              </h2>
              <p className="text-xs text-slate-400 font-tactical">
                Position-weighted rating algorithm from Python dictionary logic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Selector Dropdown & Filter */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Squad Member:
          </label>
          <select
            value={activePlayerId}
            onChange={(e) => setActivePlayerId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:outline-hidden focus:border-amber-400 font-medium"
          >
            <optgroup label="Legends - Midfielders">
              {players
                .filter((p) => p.category === 'legends' && p.position === 'midfielders')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (#{p.kitNumber})
                  </option>
                ))}
            </optgroup>
            <optgroup label="Legends - Forwards">
              {players
                .filter((p) => p.category === 'legends' && p.position === 'forwards')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (#{p.kitNumber})
                  </option>
                ))}
            </optgroup>
            <optgroup label="Modern Stars - Midfielders">
              {players
                .filter((p) => p.category === 'stars' && p.position === 'midfielders')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (#{p.kitNumber})
                  </option>
                ))}
            </optgroup>
            <optgroup label="Modern Stars - Forwards">
              {players
                .filter((p) => p.category === 'stars' && p.position === 'forwards')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (#{p.kitNumber})
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        {/* Active Player Card & Rating Display */}
        {currentPlayer && ratingData && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-tactical px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    {currentPlayer.category} · {currentPlayer.position}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {currentPlayer.nationality}
                  </span>
                </div>
                <h3 className="text-2xl font-black font-display text-white">
                  {currentPlayer.name}
                </h3>
                <p className="text-xs text-slate-400">{currentPlayer.currentOrFamousClub}</p>
              </div>

              {/* Big Career Rating Score */}
              <div className="text-right">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest flex items-center justify-end gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Career Rating
                </div>
                <div className="text-5xl font-black font-display text-white tracking-tight">
                  {ratingData.score}
                </div>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                Exact Python Formula Breakdown
              </h4>

              <div className="p-3 rounded-lg bg-black/60 font-mono text-xs text-emerald-400 border border-emerald-500/20">
                career_rating = {ratingData.formula}
              </div>

              {/* Multiplier Table */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-[10px] text-slate-400 block">Goals ({currentPlayer.stats.goals})</span>
                  <span className="font-tactical font-bold text-white">
                    × {ratingData.weights.goals} = {currentPlayer.stats.goals * ratingData.weights.goals}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-[10px] text-slate-400 block">Assists ({currentPlayer.stats.assists})</span>
                  <span className="font-tactical font-bold text-cyan-300">
                    × {ratingData.weights.assists} = {currentPlayer.stats.assists * ratingData.weights.assists}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-[10px] text-slate-400 block">Trophies ({currentPlayer.stats.trophies})</span>
                  <span className="font-tactical font-bold text-amber-300">
                    × {ratingData.weights.trophies} = {currentPlayer.stats.trophies * ratingData.weights.trophies}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-[10px] text-slate-400 block">Divisor</span>
                  <span className="font-tactical font-bold text-rose-300">
                    // {ratingData.weights.divisor}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic">
                "{ratingData.explanation}"
              </p>
            </div>

            {/* Zoom to Player Button */}
            <button
              onClick={() => {
                onSelectPlayerToZoom(currentPlayer);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Zoom into {currentPlayer.name} on Pitch
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
