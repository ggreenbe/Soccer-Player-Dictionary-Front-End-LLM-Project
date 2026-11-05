import React from 'react';
import { RotateCcw, ZoomOut, Search, Shield, Zap } from 'lucide-react';
import { Player } from '../types/soccer';

interface BroadcastHeaderProps {
  players: Player[];
  selectedPlayer: Player | null;
  hasModifications: boolean;
  onResetRoster: () => void;
  onClearSelection: () => void;
  onSelectPlayer: (player: Player) => void;
}

export const BroadcastHeader: React.FC<BroadcastHeaderProps> = ({
  players,
  selectedPlayer,
  hasModifications,
  onResetRoster,
  onClearSelection,
  onSelectPlayer,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const legendsCount = players.filter((p) => p.category === 'legends').length;
  const starsCount = players.filter((p) => p.category === 'stars').length;

  const searchResults = searchQuery.trim()
    ? players.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="relative z-30 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Left: Broadcast Title & Squad Counters */}
      <div className="flex items-center gap-4">
        {/* Match Scorebug Badge */}
        <div className="flex items-center rounded-lg bg-slate-900 border border-white/10 overflow-hidden shadow-md">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 font-display font-extrabold text-xs tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            LEGENDS
            <span className="font-tactical font-black text-white ml-0.5">{legendsCount}</span>
          </div>
          <div className="px-2 py-1 text-[11px] font-tactical font-bold text-slate-400 bg-slate-900">
            VS
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-slate-950 font-display font-extrabold text-xs tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            STARS
            <span className="font-tactical font-black text-white ml-0.5">{starsCount}</span>
          </div>
        </div>

        {/* Brand Wordmark (Zone 1 of Top Bar Contract) */}
        <div className="hidden sm:flex flex-col">
          <span className="text-sm md:text-base font-black font-display tracking-tight text-white uppercase flex items-center gap-1.5">
            Tactical Pitch
            <span className="text-xs px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-tactical font-bold">
              EA FC EDITION
            </span>
          </span>
          <span className="text-[11px] text-slate-400 font-tactical">
            Interactive Soccer Player Python Dictionary
          </span>
        </div>
      </div>

      {/* Center / Search bar dropdown */}
      <div className="relative flex-1 max-w-xs hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search player to zoom..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400/80 transition-colors"
          />
        </div>

        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
            {searchResults.map((player) => (
              <button
                key={player.id}
                onClick={() => {
                  onSelectPlayer(player);
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-white/10 transition-colors border-b border-white/5 last:border-none"
              >
                <div>
                  <div className="text-xs font-bold text-white">{player.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {player.category} · {player.position}
                  </div>
                </div>
                <span className="text-[10px] font-tactical text-amber-400 font-bold">
                  #{player.kitNumber}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Reset View & Reset Roster */}
      <div className="flex items-center gap-2">
        {selectedPlayer && (
          <button
            onClick={onClearSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-tactical font-semibold text-slate-200 transition-colors"
            title="Reset pitch zoom"
          >
            <ZoomOut className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Reset Camera</span>
          </button>
        )}

        {/* Temporary Mutation Reset Button */}
        <button
          onClick={onResetRoster}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-tactical font-semibold transition-all ${
            hasModifications
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30 animate-pulse'
              : 'bg-slate-900 text-slate-400 border-white/10 hover:text-slate-200'
          }`}
          title="Restore baseline Python dictionary roster"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{hasModifications ? 'Reset Roster*' : 'Reset Roster'}</span>
        </button>
      </div>
    </header>
  );
};
