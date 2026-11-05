import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Trash2, AlertTriangle, UserX, MinusCircle } from 'lucide-react';
import { Player } from '../../types/soccer';

interface DeleteModalProps {
  players: Player[];
  targetPlayer: Player | null;
  onDeletePlayer: (playerId: string) => void;
  onDeleteStat: (playerId: string, statName: string) => void;
  onClose: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  players,
  targetPlayer,
  onDeletePlayer,
  onDeleteStat,
  onClose,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    targetPlayer?.id || players[0]?.id || ''
  );
  const [deleteMode, setDeleteMode] = useState<'player' | 'stat'>('player');
  const [selectedStatKey, setSelectedStatKey] = useState<string>('goals');

  const activePlayer = players.find((p) => p.id === selectedPlayerId) || players[0];

  const handleConfirm = () => {
    if (!activePlayer) return;

    if (deleteMode === 'player') {
      onDeletePlayer(activePlayer.id);
    } else {
      onDeleteStat(activePlayer.id, selectedStatKey);
    }
    onClose();
  };

  const statKeys = activePlayer ? Object.keys(activePlayer.stats) : [];

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
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-tight">
                Menu 6 | Delete Items from Dictionary
              </h2>
              <p className="text-xs text-slate-400 font-tactical">
                Temporary removal of players or specific stats from session
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

        {/* Temporary session badge */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4 flex items-center gap-2 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Deletions only apply to this active session. You can restore all players at any time using "Reset Roster".
          </span>
        </div>

        {/* Player Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Player:
            </label>
            <select
              value={selectedPlayerId}
              onChange={(e) => {
                setSelectedPlayerId(e.target.value);
                const p = players.find((x) => x.id === e.target.value);
                if (p && Object.keys(p.stats).length > 0) {
                  setSelectedStatKey(Object.keys(p.stats)[0]);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:outline-hidden focus:border-rose-400"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category.toUpperCase()} · {p.position})
                </option>
              ))}
            </select>
          </div>

          {/* Deletion Type Toggle (Player vs Stat) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              What do you want to remove?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeleteMode('player')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  deleteMode === 'player'
                    ? 'bg-rose-950/40 border-rose-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <UserX className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Remove Entire Player</div>
                  <div className="text-[10px] text-slate-400">Remove pawn from pitch</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeleteMode('stat')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  deleteMode === 'stat'
                    ? 'bg-rose-950/40 border-rose-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <MinusCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Remove Single Stat</div>
                  <div className="text-[10px] text-slate-400">e.g. goals, trophies</div>
                </div>
              </button>
            </div>
          </div>

          {/* If Stat mode: choose which stat to delete */}
          {deleteMode === 'stat' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Which stat to remove from {activePlayer?.name}?
              </label>
              <select
                value={selectedStatKey}
                onChange={(e) => setSelectedStatKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:outline-hidden focus:border-rose-400 capitalize"
              >
                {statKeys.map((k) => (
                  <option key={k} value={k}>
                    {k.toUpperCase()} (Current: {activePlayer?.stats[k]})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Confirmation Summary */}
          {activePlayer && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300">
              {deleteMode === 'player' ? (
                <div>
                  Are you sure you want to remove{' '}
                  <strong className="text-white font-bold">{activePlayer.name}</strong> from{' '}
                  <span className="capitalize">{activePlayer.category}</span> {activePlayer.position}?
                </div>
              ) : (
                <div>
                  Are you sure you want to delete the stat{' '}
                  <strong className="text-rose-400 uppercase font-bold">{selectedStatKey}</strong> from{' '}
                  <span className="text-white font-bold">{activePlayer.name}</span>?
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-tactical text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Confirm Removal
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
