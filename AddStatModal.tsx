import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, PlusSquare, Sparkles } from 'lucide-react';
import { Player } from '../../types/soccer';
import { calculateCareerRating } from '../../utils/calculator';

interface AddStatModalProps {
  players: Player[];
  targetPlayer: Player | null;
  onUpdateStat: (playerId: string, statName: string, value: number) => void;
  onClose: () => void;
}

export const AddStatModal: React.FC<AddStatModalProps> = ({
  players,
  targetPlayer,
  onUpdateStat,
  onClose,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    targetPlayer?.id || players[0]?.id || ''
  );
  const [statType, setStatType] = useState<string>('goals');
  const [customStatName, setCustomStatName] = useState<string>('');
  const [statValue, setStatValue] = useState<number>(0);

  const activePlayer = players.find((p) => p.id === selectedPlayerId) || players[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlayer) return;

    const finalStatKey =
      statType === '__custom__' ? customStatName.trim().toLowerCase() : statType;
    if (!finalStatKey) return;

    onUpdateStat(activePlayer.id, finalStatKey, Number(statValue));
    onClose();
  };

  const currentStatVal = activePlayer
    ? statType === '__custom__'
      ? activePlayer.stats[customStatName.toLowerCase()] ?? 0
      : activePlayer.stats[statType] ?? 0
    : 0;

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
        className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-white/15 shadow-2xl p-6 text-white overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <PlusSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-tight">
                Menu 4 | Add / Update Player Stat
              </h2>
              <p className="text-xs text-slate-400 font-tactical">
                Modify existing career totals or define new custom attributes
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Player Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Player:
            </label>
            <select
              value={selectedPlayerId}
              onChange={(e) => {
                setSelectedPlayerId(e.target.value);
                const p = players.find((x) => x.id === e.target.value);
                if (p) {
                  setStatValue(p.stats[statType] ?? 0);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:outline-hidden focus:border-purple-400"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category.toUpperCase()} · {p.position})
                </option>
              ))}
            </select>
          </div>

          {/* Stat Key Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Stat Attribute:
            </label>
            <select
              value={statType}
              onChange={(e) => {
                setStatType(e.target.value);
                if (e.target.value !== '__custom__' && activePlayer) {
                  setStatValue(activePlayer.stats[e.target.value] ?? 0);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:outline-hidden focus:border-purple-400"
            >
              <option value="goals">Goals</option>
              <option value="assists">Assists</option>
              <option value="trophies">Trophies</option>
              <option value="clubs">Clubs</option>
              {activePlayer &&
                Object.keys(activePlayer.stats)
                  .filter((k) => !['goals', 'assists', 'trophies', 'clubs'].includes(k))
                  .map((k) => (
                    <option key={k} value={k}>
                      {k.toUpperCase()} (Custom)
                    </option>
                  ))}
              <option value="__custom__">+ Add Brand New Custom Stat...</option>
            </select>
          </div>

          {/* Custom Stat Name input */}
          {statType === '__custom__' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                New Stat Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. international_caps, clean_sheets, dribbles"
                value={customStatName}
                onChange={(e) => setCustomStatName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:outline-hidden focus:border-purple-400"
              />
            </div>
          )}

          {/* Numeric Value */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Numeric Value:
              </label>
              <span className="text-[11px] text-slate-400 font-tactical">
                Current: <strong className="text-white">{currentStatVal}</strong>
              </span>
            </div>
            <input
              type="number"
              required
              value={statValue}
              onChange={(e) => setStatValue(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-base font-tactical font-bold text-white focus:outline-hidden focus:border-purple-400"
            />
          </div>

          {/* Live Preview of Player & Career Rating */}
          {activePlayer && (
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-tactical text-slate-400">
                  Player Snapshot
                </span>
                <div className="text-sm font-bold text-white">{activePlayer.name}</div>
                <div className="text-xs text-slate-400">
                  {activePlayer.category} · {activePlayer.position}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-tactical text-amber-400">
                  Current Rating
                </span>
                <div className="text-2xl font-black font-display text-white">
                  {calculateCareerRating(activePlayer).score}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-display font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Update Player Dictionary Entry
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
