import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, UserPlus, Info, Sparkles } from 'lucide-react';
import { EraCategory, Player, PositionCategory } from '../../types/soccer';

interface AddPlayerModalProps {
  onAddPlayer: (newPlayer: Player) => void;
  onClose: () => void;
}

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
  onAddPlayer,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EraCategory>('stars');
  const [position, setPosition] = useState<PositionCategory>('forwards');
  const [club, setClub] = useState('');
  const [nationality, setNationality] = useState('World');
  const [kitNumber, setKitNumber] = useState<number>(10);
  const [goals, setGoals] = useState<number>(50);
  const [assists, setAssists] = useState<number>(30);
  const [trophies, setTrophies] = useState<number>(4);
  const [clubs, setClubs] = useState<number>(2);
  const [customStatName, setCustomStatName] = useState('');
  const [customStatValue, setCustomStatValue] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Position coordinates based on squad category and role
    // Legends on left (x: 18 - 42), Stars on right (x: 58 - 82)
    const basePitchX = category === 'legends' ? (position === 'midfielders' ? 24 : 40) : (position === 'midfielders' ? 76 : 60);
    // Randomize slight jitter so players don't overlap exactly
    const jitterX = (Math.random() - 0.5) * 8;
    const jitterY = (Math.random() - 0.5) * 40;
    const targetY = Math.min(88, Math.max(15, 50 + jitterY));

    const statsObj: Record<string, number> = {
      goals: Number(goals) || 0,
      assists: Number(assists) || 0,
      trophies: Number(trophies) || 0,
      clubs: Number(clubs) || 1,
    };

    if (customStatName.trim()) {
      statsObj[customStatName.trim().toLowerCase()] = Number(customStatValue) || 0;
    }

    const newPlayer: Player = {
      id: `player_${Date.now()}`,
      name: name.trim(),
      category,
      position,
      kitNumber: Number(kitNumber) || 10,
      nationality: nationality.trim() || 'Global',
      countryCode: nationality.slice(0, 2).toUpperCase() || 'UN',
      currentOrFamousClub: club.trim() || 'Free Agent',
      stats: statsObj as any,
      fieldCoordinates: {
        x: Math.round(basePitchX + jitterX),
        y: Math.round(targetY),
      },
      style: {
        skinTone: '#e0b59b',
        hairColor: '#0f172a',
        hairStyle: 'short',
        kitPrimaryColor: category === 'legends' ? '#eab308' : '#06b6d4',
        kitSecondaryColor: '#0f172a',
        bootColor: '#ffffff',
      },
      notes: notes.trim() || 'Newly scouted squad addition',
    };

    onAddPlayer(newPlayer);
    onClose();
  };

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
        className="relative w-full max-w-xl rounded-2xl bg-slate-950 border border-white/15 shadow-2xl p-6 text-white overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-tight">
                Menu 3 | Add Player to Dictionary
              </h2>
              <p className="text-xs text-slate-400 font-tactical">
                Temporary session addition directly to the tactical pitch
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

        {/* Temporary session notice */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4 flex items-center gap-2 text-xs text-amber-300">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Added players are temporary in-memory for this session and can be reset anytime using the top "Reset Roster" button.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Player Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Player Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ronaldinho, Thierry Henry, Bukayo Saka"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:outline-hidden focus:border-emerald-400"
            />
          </div>

          {/* Squad Category & Tactical Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Squad Section *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EraCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:outline-hidden focus:border-emerald-400"
              >
                <option value="legends">Legends (Left Half)</option>
                <option value="stars">Modern Stars (Right Half)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Position *
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as PositionCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:outline-hidden focus:border-emerald-400"
              >
                <option value="midfielders">Midfielder</option>
                <option value="forwards">Forward</option>
              </select>
            </div>
          </div>

          {/* Club, Nationality, Kit Number */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Primary Club
              </label>
              <input
                type="text"
                placeholder="e.g. Arsenal"
                value={club}
                onChange={(e) => setClub(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Nationality
              </label>
              <input
                type="text"
                placeholder="e.g. Brazil"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Jersey #
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={kitNumber}
                onChange={(e) => setKitNumber(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
              />
            </div>
          </div>

          {/* Initial Core Stats */}
          <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Core Career Stats (Python Dictionary Values)
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Goals</label>
                <input
                  type="number"
                  min="0"
                  value={goals}
                  onChange={(e) => setGoals(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white font-tactical font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Assists</label>
                <input
                  type="number"
                  min="0"
                  value={assists}
                  onChange={(e) => setAssists(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-cyan-300 font-tactical font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Trophies</label>
                <input
                  type="number"
                  min="0"
                  value={trophies}
                  onChange={(e) => setTrophies(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-amber-300 font-tactical font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Clubs</label>
                <input
                  type="number"
                  min="1"
                  value={clubs}
                  onChange={(e) => setClubs(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white font-tactical font-bold"
                />
              </div>
            </div>
          </div>

          {/* Optional Custom Initial Stat (from Python add_player prompt) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Custom Stat Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. speed, caps, dribbles"
                value={customStatName}
                onChange={(e) => setCustomStatName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Custom Stat Value
              </label>
              <input
                type="number"
                value={customStatValue}
                onChange={(e) => setCustomStatValue(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-tactical"
              />
            </div>
          </div>

          {/* Player Bio Trivia / Note */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Player Note / Trivia
            </label>
            <input
              type="text"
              placeholder="e.g. 2002 World Cup Champion & Samba Magician"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-display font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Spawn Player on Pitch
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
