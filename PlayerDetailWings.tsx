import React from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Flame,
  Building2,
  X,
  PlusCircle,
  Trash2,
  Sparkles,
  Calculator,
} from 'lucide-react';
import { Player } from '../types/soccer';
import { calculateCareerRating, calculateCategoryAverage } from '../utils/calculator';
import { PlayerAvatar } from './PlayerAvatar';

interface PlayerDetailWingsProps {
  player: Player;
  allPlayers: Player[];
  onClose: () => void;
  onOpenAddStat: (player: Player) => void;
  onDeletePlayer: (player: Player) => void;
  onOpenRatingBreakdown: (player: Player) => void;
}

export const PlayerDetailWings: React.FC<PlayerDetailWingsProps> = ({
  player,
  allPlayers,
  onClose,
  onOpenAddStat,
  onDeletePlayer,
  onOpenRatingBreakdown,
}) => {
  const ratingData = calculateCareerRating(player);
  const isLegends = player.category === 'legends';

  // Calculate position averages for comparison
  const avgGoals = calculateCategoryAverage(allPlayers, player.category, player.position, 'goals').average;
  const avgAssists = calculateCategoryAverage(allPlayers, player.category, player.position, 'assists').average;
  const avgTrophies = calculateCategoryAverage(allPlayers, player.category, player.position, 'trophies').average;

  const baseStatKeys = new Set(['goals', 'assists', 'trophies', 'clubs']);
  const customStats = Object.entries(player.stats).filter(([k]) => !baseStatKeys.has(k));

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-between p-3 sm:p-5 md:p-8 pointer-events-none"
      style={{
        perspective: '1200px',
      }}
    >
      {/* ================= LEFT WING: HOLOGRAPHIC CARD FLIP ================= */}
      <motion.div
        initial={{
          opacity: 0,
          rotateY: -80,
          x: -60,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          rotateY: 0,
          x: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          rotateY: -80,
          x: -60,
          scale: 0.9,
        }}
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 22,
          mass: 0.85,
        }}
        style={{
          transformOrigin: 'right center',
          transformStyle: 'preserve-3d',
        }}
        className="pointer-events-auto relative w-72 sm:w-80 md:w-88 max-h-[85vh] overflow-y-auto rounded-2xl bg-slate-950/92 backdrop-blur-2xl border border-white/15 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col gap-4 text-slate-100"
      >
        {/* Holographic Sheen Sweep Reflection */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden opacity-30"
          style={{
            background:
              'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 55%, transparent 80%)',
            backgroundSize: '200% 200%',
            animation: 'sheen 3s ease-in-out infinite',
          }}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded ${
                isLegends
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
              }`}
            >
              {player.category === 'legends' ? 'Classic Legend' : 'Modern Star'}
            </span>
            <span className="text-xs text-slate-400 font-tactical">
              {player.nationality} ({player.countryCode})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset pitch camera (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Name & Kit Number */}
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-none">
              {player.name}
            </h2>
            <span className="text-xl font-bold font-tactical text-amber-400">
              #{player.kitNumber}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate font-medium">{player.currentOrFamousClub}</span>
          </p>
        </div>

        {/* Career Rating Showcase (Python Weighted Formula) */}
        <div
          className={`relative rounded-xl p-4 border overflow-hidden transition-all duration-300 ${
            isLegends
              ? 'bg-gradient-to-br from-amber-950/50 via-slate-900/90 to-slate-950 border-amber-500/40 shadow-lg shadow-amber-950/20'
              : 'bg-gradient-to-br from-cyan-950/50 via-slate-900/90 to-slate-950 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Career Rating
            </span>
            <button
              onClick={() => onOpenRatingBreakdown(player)}
              className="text-[11px] font-tactical text-amber-400 hover:underline flex items-center gap-1"
            >
              <Calculator className="w-3 h-3" />
              Formula Info
            </button>
          </div>

          <div className="flex items-end gap-3">
            <div className="text-5xl font-black font-display tracking-tighter text-white">
              {ratingData.score}
            </div>
            <div className="text-[11px] text-slate-400 pb-1 leading-tight">
              Weighted role rating
              <br />
              <span className="text-amber-400/90 font-medium">
                {player.position === 'midfielders' ? 'Assists & Playmaking Favored' : 'Lethal Finishing Favored'}
              </span>
            </div>
          </div>

          {/* Formula String Snippet */}
          <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 truncate">
            Code: {ratingData.formula}
          </div>
        </div>

        {/* Notes / Python Trivia */}
        {player.notes && (
          <div className="rounded-lg bg-white/5 border border-white/5 p-3 text-xs text-slate-300 italic">
            "{player.notes}"
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/10">
          <button
            onClick={() => onOpenAddStat(player)}
            className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-tactical text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Stat
          </button>
          <button
            onClick={() => onDeletePlayer(player)}
            className="py-2 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900 active:scale-95 border border-rose-800/40 text-rose-300 font-tactical text-xs font-semibold transition-all flex items-center gap-1"
            title="Temporary removal (can be reset anytime)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </motion.div>

      {/* ================= CENTER: ZOOM FOCUS HERO AVATAR ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.75, y: 25 }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 22,
        }}
        className="hidden lg:flex flex-col items-center justify-center pointer-events-auto"
      >
        <PlayerAvatar player={player} size="hero" isSelected />
        <button
          onClick={onClose}
          className="mt-4 px-5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-white text-xs font-tactical font-bold border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-105"
        >
          ← Reset Pitch View (Esc)
        </button>
      </motion.div>

      {/* ================= RIGHT WING: HOLOGRAPHIC CARD FLIP ================= */}
      <motion.div
        initial={{
          opacity: 0,
          rotateY: 80,
          x: 60,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          rotateY: 0,
          x: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          rotateY: 80,
          x: 60,
          scale: 0.9,
        }}
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 22,
          mass: 0.85,
          delay: 0.08,
        }}
        style={{
          transformOrigin: 'left center',
          transformStyle: 'preserve-3d',
        }}
        className="pointer-events-auto relative w-72 sm:w-80 md:w-88 max-h-[85vh] overflow-y-auto rounded-2xl bg-slate-950/92 backdrop-blur-2xl border border-white/15 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col gap-4 text-slate-100"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Career Statistics
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-tactical uppercase font-bold">
            {player.position}
          </span>
        </div>

        {/* Grid of Main Stats with animated entries */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Goals */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col shadow-xs">
            <span className="text-[11px] text-slate-400 font-medium">Goals</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-tactical text-white">
                {player.stats.goals ?? 0}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  (player.stats.goals ?? 0) >= avgGoals ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {(player.stats.goals ?? 0) >= avgGoals ? '▲' : '▼'} vs {avgGoals} avg
              </span>
            </div>
          </div>

          {/* Assists */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col shadow-xs">
            <span className="text-[11px] text-slate-400 font-medium">Assists</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-tactical text-cyan-300">
                {player.stats.assists ?? 0}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  (player.stats.assists ?? 0) >= avgAssists ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {(player.stats.assists ?? 0) >= avgAssists ? '▲' : '▼'} vs {avgAssists} avg
              </span>
            </div>
          </div>

          {/* Trophies */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col shadow-xs">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Trophies</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-tactical text-amber-300">
                {player.stats.trophies ?? 0}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  (player.stats.trophies ?? 0) >= avgTrophies ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                vs {avgTrophies} avg
              </span>
            </div>
          </div>

          {/* Clubs */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col shadow-xs">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>Clubs</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-tactical text-white">
                {player.stats.clubs ?? 0}
              </span>
              <span className="text-[10px] text-slate-500">teams</span>
            </div>
          </div>
        </div>

        {/* Custom Appended Stats */}
        {customStats.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Custom Appended Stats
            </span>
            <div className="grid grid-cols-2 gap-2">
              {customStats.map(([key, val]) => (
                <div
                  key={key}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between"
                >
                  <span className="text-xs text-emerald-200 capitalize truncate">{key}</span>
                  <span className="text-xs font-bold font-tactical text-white">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Context & Positional Role */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between">
            <span>Squad Category:</span>
            <span className="font-semibold text-slate-200 capitalize">{player.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tactical Role:</span>
            <span className="font-semibold text-slate-200 capitalize">{player.position}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Goal Contributions:</span>
            <span className="font-bold font-tactical text-amber-300">
              {(player.stats.goals || 0) + (player.stats.assists || 0)}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          Click on the pitch grass or press <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">Esc</kbd> to return to full pitch view.
        </p>
      </motion.div>
    </div>
  );
};
