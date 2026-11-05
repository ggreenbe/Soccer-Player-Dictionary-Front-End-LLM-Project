import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, BarChart3, TrendingUp, Users } from 'lucide-react';
import { EraCategory, Player, PositionCategory } from '../../types/soccer';
import { calculateCategoryAverage } from '../../utils/calculator';

interface CategoryAveragesModalProps {
  players: Player[];
  onClose: () => void;
}

export const CategoryAveragesModal: React.FC<CategoryAveragesModalProps> = ({
  players,
  onClose,
}) => {
  const [category, setCategory] = useState<EraCategory>('legends');
  const [position, setPosition] = useState<PositionCategory>('midfielders');
  const [statName, setStatName] = useState<string>('goals');

  // Compute stats for current selection
  const { average, count, sum } = calculateCategoryAverage(players, category, position, statName);

  // Filter squad players for detail list
  const categoryPlayers = players.filter((p) => p.category === category && p.position === position);

  // Available stats from active players
  const availableStats = Array.from(
    new Set(players.flatMap((p) => Object.keys(p.stats)))
  );

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
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-tight">
                Menu 5 | Category Stat Averages
              </h2>
              <p className="text-xs text-slate-400 font-tactical">
                Positional averages using Python integer division math
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

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* Era Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              1. Era / Squad:
            </label>
            <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setCategory('legends')}
                className={`flex-1 py-1.5 text-xs font-tactical font-bold rounded-lg transition-colors ${
                  category === 'legends' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Legends
              </button>
              <button
                onClick={() => setCategory('stars')}
                className={`flex-1 py-1.5 text-xs font-tactical font-bold rounded-lg transition-colors ${
                  category === 'stars' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stars
              </button>
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              2. Position:
            </label>
            <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setPosition('midfielders')}
                className={`flex-1 py-1.5 text-xs font-tactical font-bold rounded-lg transition-colors ${
                  position === 'midfielders' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Midfielders
              </button>
              <button
                onClick={() => setPosition('forwards')}
                className={`flex-1 py-1.5 text-xs font-tactical font-bold rounded-lg transition-colors ${
                  position === 'forwards' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Forwards
              </button>
            </div>
          </div>

          {/* Stat Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              3. Stat Target:
            </label>
            <select
              value={statName}
              onChange={(e) => setStatName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white capitalize font-medium"
            >
              {availableStats.map((st) => (
                <option key={st} value={st}>
                  {st.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Big Metric Showcase */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Calculated Average
            </span>
            <div className="text-4xl sm:text-5xl font-black font-display text-white mt-1">
              {average}{' '}
              <span className="text-base font-tactical text-slate-400 capitalize">
                {statName}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Across <strong className="text-white">{count}</strong> {category} {position}
            </p>
          </div>

          {/* Math breakdown */}
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-emerald-400">
            <div className="text-slate-400 text-[10px] uppercase font-tactical">
              Python Integer Division
            </div>
            <div className="mt-0.5">
              average = {sum} // {count} = <strong className="text-white text-sm">{average}</strong>
            </div>
          </div>
        </div>

        {/* Players List with individual contributions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Squad Players ({categoryPlayers.length})
            </span>
            <span>Individual {statName.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categoryPlayers.map((p) => {
              const val = p.stats[statName] ?? 0;
              const isAboveAvg = val >= average;
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white font-sans">{p.name}</div>
                    <div className="text-[10px] text-slate-400">{p.currentOrFamousClub}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black font-tactical text-white">{val}</span>
                    <span
                      className={`block text-[9px] font-bold ${
                        isAboveAvg ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {isAboveAvg ? '▲ Above Avg' : '▼ Below Avg'}
                    </span>
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
