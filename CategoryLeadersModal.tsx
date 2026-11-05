import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Crown, Medal, Eye } from 'lucide-react';
import { EraCategory, Player } from '../../types/soccer';
import { findCategoryLeader } from '../../utils/calculator';
import { PlayerAvatar } from '../PlayerAvatar';

interface CategoryLeadersModalProps {
  players: Player[];
  onSelectPlayerToZoom: (player: Player) => void;
  onClose: () => void;
}

export const CategoryLeadersModal: React.FC<CategoryLeadersModalProps> = ({
  players,
  onSelectPlayerToZoom,
  onClose,
}) => {
  const [category, setCategory] = useState<EraCategory>('legends');
  const [statName, setStatName] = useState<string>('goals');

  const { leader, statValue } = findCategoryLeader(players, category, statName);

  // Sort all players in this category descending by this stat
  const sortedPlayers = players
    .filter((p) => p.category === category)
    .sort((a, b) => (b.stats[statName] || 0) - (a.stats[statName] || 0));

  const statOptions = [
    { key: 'goals', label: 'Goals (Golden Boot)' },
    { key: 'assists', label: 'Assists (Playmaker)' },
    { key: 'trophies', label: 'Trophies (Silverware)' },
    { key: 'clubs', label: 'Clubs (Journeyman)' },
  ];

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
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-tight">
                Menu 7 | Category Leaders
              </h2>
              <p className="text-xs text-slate-400 font-tactical">
                Discover the all-time leaders in Goals, Assists, Trophies, & Clubs
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

        {/* Category & Stat Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Era Category Switch */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Squad Category:
            </label>
            <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setCategory('legends')}
                className={`flex-1 py-1.5 text-xs font-tactical font-bold rounded-lg transition-colors ${
                  category === 'legends' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Legends Squad
              </button>
              <button
                onClick={() => setCategory('stars')}
                className={`flex-1 py-1.5 text-xs font-tactical font-bold rounded-lg transition-colors ${
                  category === 'stars' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Modern Stars
              </button>
            </div>
          </div>

          {/* Stat Metric */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Stat Category:
            </label>
            <select
              value={statName}
              onChange={(e) => setStatName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-medium"
            >
              {statOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Spotlight Podium Winner Card */}
        {leader && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-950 border border-amber-500/40 mb-6 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <PlayerAvatar player={leader} size="thumb" />
                <div className="absolute -top-2 -left-2 p-1 rounded-full bg-amber-400 text-slate-950 shadow-md">
                  <Crown className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-tactical uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  #1 {category.toUpperCase()} LEADER
                </span>
                <h3 className="text-2xl font-black font-display text-white mt-1">
                  {leader.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {leader.currentOrFamousClub} · {leader.position}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-tactical">
                Total {statName}
              </span>
              <div className="text-4xl font-black font-display text-amber-300 tracking-tight">
                {statValue}
              </div>
              <button
                onClick={() => {
                  onSelectPlayerToZoom(leader);
                  onClose();
                }}
                className="mt-1 text-xs text-cyan-400 hover:underline flex items-center justify-end gap-1 font-tactical"
              >
                <Eye className="w-3 h-3" />
                View on Pitch
              </button>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
            <Medal className="w-3.5 h-3.5 text-amber-400" />
            Squad Leaderboard Ranking
          </div>

          <div className="space-y-1.5">
            {sortedPlayers.map((p, idx) => {
              const val = p.stats[statName] || 0;
              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    idx === 0
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center text-xs font-tactical font-black ${
                        idx === 0
                          ? 'text-amber-400'
                          : idx === 1
                          ? 'text-slate-300'
                          : idx === 2
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold font-sans text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {p.position} · {p.currentOrFamousClub}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black font-tactical text-white">{val}</span>
                    <button
                      onClick={() => {
                        onSelectPlayerToZoom(p);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Zoom on pitch"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
