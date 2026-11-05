import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Crown,
  BarChart3,
  ListTree,
  UserPlus,
  PlusSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Trophy,
  Shield,
  Layers,
  ArrowLeft,
  TrendingUp,
  Percent,
  Copy,
  Check,
  Code,
  Sparkles,
} from 'lucide-react';
import { ActiveModal, EraCategory, Player, PositionCategory } from '../types/soccer';
import {
  calculateCareerRating,
  rankPlayersByCareerRating,
  rankPlayersByStat,
  rankPlayersByPositionalDelta,
  RankedPlayerCareer,
  RankedPlayerStat,
  RankedPlayerAverageDelta,
} from '../utils/calculator';
import { PlayerAvatar } from './PlayerAvatar';

interface RankedCarouselViewProps {
  players: Player[];
  activeFunction: ActiveModal;
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  onCloseToPitch: () => void;
  onOpenAddPlayer: () => void;
  onOpenAddStat: (player?: Player) => void;
  onOpenDelete: (player?: Player) => void;
  onOpenFullContentsTree: () => void;
  onDeletePlayerDirect: (playerId: string) => void;
  onDeleteStatDirect: (playerId: string, statName: string) => void;
  onChangeFunction: (fn: ActiveModal) => void;
}

export const RankedCarouselView: React.FC<RankedCarouselViewProps> = ({
  players,
  activeFunction,
  selectedPlayer,
  onSelectPlayer,
  onCloseToPitch,
  onOpenAddPlayer,
  onOpenAddStat,
  onOpenDelete,
  onOpenFullContentsTree,
  onDeletePlayerDirect,
  onDeleteStatDirect,
  onChangeFunction,
}) => {
  // Navigation & Scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copiedPlayerId, setCopiedPlayerId] = useState<string | null>(null);

  // Sub-filter tabs for Leaders & Averages & Filter by Era
  const [leaderStat, setLeaderStat] = useState<'goals' | 'assists' | 'trophies' | 'clubs'>('goals');
  const [averagesFocus, setAveragesFocus] = useState<'composite' | 'goals' | 'assists' | 'trophies'>('composite');
  const [eraFilter, setEraFilter] = useState<'all' | 'legends' | 'stars'>('all');

  // Filter players based on eraFilter if selected
  const filteredPlayers = useMemo(() => {
    if (eraFilter === 'all') return players;
    return players.filter((p) => p.category === eraFilter);
  }, [players, eraFilter]);

  // Compute rankings based on active function
  const rankedData = useMemo(() => {
    if (activeFunction === 'category_leaders') {
      return rankPlayersByStat(filteredPlayers, leaderStat);
    }
    if (activeFunction === 'category_averages') {
      return rankPlayersByPositionalDelta(filteredPlayers, averagesFocus);
    }
    // Default to career rating or general ranking
    return rankPlayersByCareerRating(filteredPlayers);
  }, [filteredPlayers, activeFunction, leaderStat, averagesFocus]);

  // Sync current index when selectedPlayer changes
  useEffect(() => {
    if (selectedPlayer) {
      const idx = rankedData.findIndex((item) => item.player.id === selectedPlayer.id);
      if (idx !== -1 && idx !== currentIndex) {
        setCurrentIndex(idx);
      }
    }
  }, [selectedPlayer, rankedData]);

  // Scroll to active index
  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, rankedData.length - 1));
    setCurrentIndex(clampedIndex);
    if (rankedData[clampedIndex]) {
      onSelectPlayer(rankedData[clampedIndex].player);
    }

    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const targetCard = container.children[clampedIndex] as HTMLElement;
      if (targetCard) {
        const containerWidth = container.offsetWidth;
        const cardLeft = targetCard.offsetLeft;
        const cardWidth = targetCard.offsetWidth;
        container.scrollTo({
          left: cardLeft - containerWidth / 2 + cardWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scrollToIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        scrollToIndex(currentIndex + 1);
      } else if (e.key === 'Escape') {
        onCloseToPitch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, rankedData.length]);

  // Copy individual player's python dictionary
  const handleCopyPlayerDict = (player: Player) => {
    const dictSnippet = `'${player.id}': ${JSON.stringify(player.stats, null, 4)}`.replace(/"/g, "'");
    navigator.clipboard.writeText(dictSnippet);
    setCopiedPlayerId(player.id);
    setTimeout(() => setCopiedPlayerId(null), 2000);
  };

  // Function Title Metadata
  const getHeaderMeta = () => {
    switch (activeFunction) {
      case 'career_rating':
        return {
          title: 'Career Rating Matrix',
          subtitle: 'Weighted evaluation formula (Goals × W1 + Assists × W2 + Trophies × W3) ÷ Divisor',
          icon: <Calculator className="w-5 h-5 text-amber-400" />,
          accent: 'amber',
        };
      case 'category_leaders':
        return {
          title: 'Category Leaders Standings',
          subtitle: 'Ranking the elite performers by individual statistical dominance',
          icon: <Crown className="w-5 h-5 text-yellow-400" />,
          accent: 'yellow',
        };
      case 'category_averages':
        return {
          title: 'Positional Averages & Delta',
          subtitle: 'Player statistical output benchmarked against their position & era group mean',
          icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
          accent: 'blue',
        };
      case 'list_contents':
        return {
          title: 'Full Roster Dictionary Tree',
          subtitle: 'Inspection of active Python dictionary key-values and attribute structures',
          icon: <ListTree className="w-5 h-5 text-cyan-400" />,
          accent: 'cyan',
        };
      case 'add_player':
        return {
          title: 'Scouting & Player Roster Addition',
          subtitle: 'Temporarily recruit new athletes into the pitch & dictionary engine',
          icon: <UserPlus className="w-5 h-5 text-emerald-400" />,
          accent: 'emerald',
        };
      case 'add_stat':
        return {
          title: 'Stat Metrics Append Engine',
          subtitle: 'Add or modify numerical metrics on any active athlete',
          icon: <PlusSquare className="w-5 h-5 text-purple-400" />,
          accent: 'purple',
        };
      case 'delete_item':
        return {
          title: 'Roster Trimmer & Metric Deletion',
          subtitle: 'Temporarily remove players or individual stats from the active session',
          icon: <Trash2 className="w-5 h-5 text-rose-400" />,
          accent: 'rose',
        };
      default:
        return {
          title: 'Ranked Carousel Standings',
          subtitle: 'Interactive horizontally scrolling broadcast rankings',
          icon: <Trophy className="w-5 h-5 text-amber-400" />,
          accent: 'amber',
        };
    }
  };

  const meta = getHeaderMeta();
  const activeItem = rankedData[currentIndex] || rankedData[0];

  return (
    <div className="relative w-full min-h-[720px] md:min-h-[780px] lg:min-h-[820px] flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#070b14] via-[#091122] to-[#05080e] shadow-[0_20px_70px_rgba(0,0,0,0.85)] select-none">
      {/* Stadium Floodlight Ambient Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-emerald-950/20 to-transparent" />
      </div>

      {/* ================= TOP BROADCAST SUB-HEADER ================= */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        {/* Left: Function Info */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/15 shadow-inner">
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-white/50 font-tactical">
                FUNCTION SCREEN
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-tactical font-bold">
                {rankedData.length} PLAYERS
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-white flex items-center gap-2">
              {meta.title}
            </h2>
          </div>
        </div>

        {/* Center / Right: Dynamic Sub-Filters based on Active Function */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Leaders Sub-Tabs */}
          {activeFunction === 'category_leaders' && (
            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-tactical font-semibold">
              <button
                onClick={() => setLeaderStat('goals')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  leaderStat === 'goals'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ⚽ Goals
              </button>
              <button
                onClick={() => setLeaderStat('assists')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  leaderStat === 'assists'
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🎯 Assists
              </button>
              <button
                onClick={() => setLeaderStat('trophies')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  leaderStat === 'trophies'
                    ? 'bg-yellow-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🏆 Trophies
              </button>
              <button
                onClick={() => setLeaderStat('clubs')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  leaderStat === 'clubs'
                    ? 'bg-emerald-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🛡️ Clubs
              </button>
            </div>
          )}

          {/* Stat Averages Sub-Tabs */}
          {activeFunction === 'category_averages' && (
            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-tactical font-semibold">
              <button
                onClick={() => setAveragesFocus('composite')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  averagesFocus === 'composite'
                    ? 'bg-blue-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Overall Delta
              </button>
              <button
                onClick={() => setAveragesFocus('goals')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  averagesFocus === 'goals'
                    ? 'bg-blue-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Goals vs Avg
              </button>
              <button
                onClick={() => setAveragesFocus('assists')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  averagesFocus === 'assists'
                    ? 'bg-blue-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Assists vs Avg
              </button>
              <button
                onClick={() => setAveragesFocus('trophies')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  averagesFocus === 'trophies'
                    ? 'bg-blue-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Trophies vs Avg
              </button>
            </div>
          )}

          {/* Full Contents: Toggle Raw Tree View */}
          {activeFunction === 'list_contents' && (
            <button
              onClick={onOpenFullContentsTree}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-tactical font-bold transition-all shadow-md active:scale-95"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Full Python Tree / Code</span>
            </button>
          )}

          {/* Add Player quick trigger */}
          {activeFunction === 'add_player' && (
            <button
              onClick={onOpenAddPlayer}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-tactical font-black text-xs hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Player to Pitch</span>
            </button>
          )}

          {/* Era Filter Chips */}
          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-tactical">
            <button
              onClick={() => setEraFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                eraFilter === 'all'
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({players.length})
            </button>
            <button
              onClick={() => setEraFilter('legends')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                eraFilter === 'legends'
                  ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40 font-bold'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              Legends ({players.filter((p) => p.category === 'legends').length})
            </button>
            <button
              onClick={() => setEraFilter('stars')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                eraFilter === 'stars'
                  ? 'bg-cyan-400/25 text-cyan-300 border border-cyan-400/40 font-bold'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              Stars ({players.filter((p) => p.category === 'stars').length})
            </button>
          </div>

          {/* Return to Tactical Pitch Button */}
          <button
            onClick={onCloseToPitch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 hover:border-white/40 text-slate-200 hover:text-white text-xs font-tactical font-bold transition-all shadow-md active:scale-95 ml-1"
            title="Return to Tactical Pitch Field (Esc)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tactical Pitch</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-400">Esc</span>
          </button>
        </div>
      </div>

      {/* ================= HORIZONTAL CAROUSEL CONTAINER ================= */}
      <div className="relative flex-1 flex items-center justify-center py-4 px-2 sm:px-6">
        {/* Navigation Arrow Left */}
        <button
          onClick={() => scrollToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="absolute left-2 sm:left-4 z-30 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-90"
          title="Previous Player (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          onClick={() => scrollToIndex(currentIndex + 1)}
          disabled={currentIndex === rankedData.length - 1}
          className="absolute right-2 sm:right-4 z-30 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-90"
          title="Next Player (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollContainerRef}
          className="w-full flex items-center gap-6 sm:gap-10 overflow-x-auto py-4 px-8 scroll-smooth no-scrollbar"
          style={{
            scrollSnapType: 'x mandatory',
          }}
        >
          {rankedData.map((item, idx) => {
            const player = item.player;
            const isLegends = player.category === 'legends';
            const isFocused = idx === currentIndex;
            const rank = item.rank;

            // Render rank styling
            const isGold = rank === 1;
            const isSilver = rank === 2;
            const isBronze = rank === 3;

            return (
              <div
                key={player.id}
                onClick={() => scrollToIndex(idx)}
                className={`relative shrink-0 snap-center transition-all duration-300 cursor-pointer ${
                  isFocused
                    ? 'scale-100 opacity-100 z-20'
                    : 'scale-[0.93] opacity-65 hover:opacity-90 z-10'
                }`}
                style={{
                  width: 'min(94vw, 860px)',
                }}
              >
                {/* Master Card Glass Stage */}
                <div
                  className={`relative rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-2xl border transition-all duration-300 shadow-2xl ${
                    isFocused
                      ? isLegends
                        ? 'bg-slate-950/92 border-amber-400/40 shadow-[0_20px_50px_rgba(251,191,36,0.18)]'
                        : 'bg-slate-950/92 border-cyan-400/40 shadow-[0_20px_50px_rgba(56,189,248,0.18)]'
                      : 'bg-slate-950/60 border-white/10'
                  }`}
                >
                  {/* Subtle Card Holographic Sheen */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden opacity-15"
                    style={{
                      background:
                        'linear-gradient(120deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)',
                      backgroundSize: '200% 200%',
                    }}
                  />

                  {/* 3-Column Layout: [LEFT WING] [CENTER 3D FIGURINE] [RIGHT WING] */}
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                    {/* ================= LEFT WING: RANK & PRIMARY FOCAL STAT ================= */}
                    <div className="w-full md:w-64 lg:w-72 flex flex-col justify-between shrink-0 text-left space-y-3">
                      {/* Rank Badge Header */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center justify-center px-3 py-1 rounded-xl font-tactical font-black text-sm tracking-wider shadow-md ${
                            isGold
                              ? 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-400/30'
                              : isSilver
                              ? 'bg-gradient-to-r from-slate-200 via-gray-300 to-slate-400 text-slate-950 shadow-slate-300/30'
                              : isBronze
                              ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white'
                              : 'bg-white/10 border border-white/15 text-slate-200'
                          }`}
                        >
                          RANK #{String(rank).padStart(2, '0')}
                        </span>

                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg border ${
                            isLegends
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          }`}
                        >
                          {player.category.toUpperCase()} •{' '}
                          {player.position === 'midfielders' ? 'MID' : 'FWD'}
                        </span>
                      </div>

                      {/* Player Name & Identity */}
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight">
                          {player.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-300 font-tactical">
                          <span className="font-bold text-amber-300">#{player.kitNumber}</span>
                          <span>•</span>
                          <span>
                            {player.countryCode} {player.nationality}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-[140px] text-slate-400">
                            {player.currentOrFamousClub}
                          </span>
                        </div>
                      </div>

                      {/* Function-Specific Focal Stat Block */}
                      <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 space-y-1">
                        {/* 1. CAREER RATING */}
                        {activeFunction === 'career_rating' && (
                          <>
                            <div className="text-[10px] uppercase font-tactical font-bold text-amber-300/80 tracking-wider">
                              Weighted Career Score
                            </div>
                            <div className="text-4xl sm:text-5xl font-black font-display tracking-tight text-amber-300">
                              {(item as RankedPlayerCareer).rating?.score ??
                                calculateCareerRating(player).score}
                            </div>
                            <div className="text-[11px] text-slate-400 font-tactical leading-snug">
                              {(item as RankedPlayerCareer).rating?.explanation}
                            </div>
                          </>
                        )}

                        {/* 2. CATEGORY LEADERS */}
                        {activeFunction === 'category_leaders' && (
                          <>
                            <div className="text-[10px] uppercase font-tactical font-bold text-yellow-300/80 tracking-wider">
                              Leading Metric: {leaderStat.toUpperCase()}
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl sm:text-5xl font-black font-display tracking-tight text-yellow-300">
                                {player.stats[leaderStat] ?? 0}
                              </span>
                              <span className="text-xs font-tactical uppercase text-slate-300 font-bold">
                                {leaderStat}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-tactical">
                              {rank === 1
                                ? `🌟 Top overall leader for ${leaderStat}`
                                : `Ranked #${rank} among all athletes`}
                            </div>
                          </>
                        )}

                        {/* 3. STAT AVERAGES */}
                        {activeFunction === 'category_averages' && (
                          <>
                            <div className="text-[10px] uppercase font-tactical font-bold text-blue-300/80 tracking-wider">
                              Group Benchmark Performance
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span
                                className={`text-3xl sm:text-4xl font-black font-display tracking-tight ${
                                  (item as RankedPlayerAverageDelta).deltaPct >= 0
                                    ? 'text-emerald-400'
                                    : 'text-rose-400'
                                }`}
                              >
                                {(item as RankedPlayerAverageDelta).deltaPct >= 0 ? '+' : ''}
                                {(item as RankedPlayerAverageDelta).deltaPct}%
                              </span>
                              <span className="text-xs font-tactical text-slate-300">vs Avg</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-tactical">
                              Group: {(item as RankedPlayerAverageDelta).positionGroup}
                            </div>
                          </>
                        )}

                        {/* 4. FULL CONTENTS / OTHERS */}
                        {(activeFunction === 'list_contents' ||
                          activeFunction === 'add_player' ||
                          activeFunction === 'add_stat' ||
                          activeFunction === 'delete_item') && (
                          <>
                            <div className="text-[10px] uppercase font-tactical font-bold text-cyan-300/80 tracking-wider">
                              Dictionary Identification
                            </div>
                            <div className="text-xl sm:text-2xl font-bold font-tactical text-cyan-200">
                              '{player.id}'
                            </div>
                            <div className="text-[11px] text-slate-400 font-tactical">
                              Position: {player.category} / {player.position}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* ================= CENTER: 3D FIGURINE STAGE ================= */}
                    <div className="relative shrink-0 flex flex-col items-center justify-center my-2 md:my-0">
                      {/* Scaled Player Avatar with Static 3D Turf Pedestal */}
                      <div className="relative flex items-center justify-center w-52 sm:w-60 md:w-64 h-80 sm:h-92">
                        <PlayerAvatar
                          player={player}
                          isSelected={isFocused}
                          size="hero"
                        />
                      </div>
                    </div>

                    {/* ================= RIGHT WING: MINIMAL STATS BREAKDOWN ================= */}
                    <div className="w-full md:w-64 lg:w-72 flex flex-col justify-between shrink-0 space-y-3 text-left">
                      {/* Stat Wing Card */}
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-black/45 border border-white/10 space-y-3">
                        {/* 1. Career Rating Right Wing: Formula Breakdown */}
                        {activeFunction === 'career_rating' && (
                          <>
                            <div className="text-[10px] uppercase font-tactical font-bold text-white/50 tracking-wider">
                              Formula Contribution
                            </div>
                            <div className="space-y-1.5 text-xs font-tactical">
                              <div className="flex items-center justify-between py-1 border-b border-white/5">
                                <span className="text-slate-400">Goals Points:</span>
                                <span className="text-amber-300 font-bold">
                                  {player.stats.goals} ×{' '}
                                  {(item as RankedPlayerCareer).rating?.weights.goals ?? 5}
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-1 border-b border-white/5">
                                <span className="text-slate-400">Assists Points:</span>
                                <span className="text-cyan-300 font-bold">
                                  {player.stats.assists} ×{' '}
                                  {(item as RankedPlayerCareer).rating?.weights.assists ?? 3}
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-1 border-b border-white/5">
                                <span className="text-slate-400">Trophies Points:</span>
                                <span className="text-yellow-300 font-bold">
                                  {player.stats.trophies} ×{' '}
                                  {(item as RankedPlayerCareer).rating?.weights.trophies ?? 5}
                                </span>
                              </div>
                              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                                <span>Formula Divisor:</span>
                                <span className="font-bold text-white">
                                  ÷ {(item as RankedPlayerCareer).rating?.weights.divisor ?? 30}
                                </span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* 2. Category Leaders Right Wing: Supporting Stats Grid */}
                        {activeFunction === 'category_leaders' && (
                          <>
                            <div className="text-[10px] uppercase font-tactical font-bold text-white/50 tracking-wider">
                              Secondary Metrics
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs font-tactical">
                              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-[10px] text-slate-400 uppercase">Goals</div>
                                <div className="text-base font-bold text-white">
                                  {player.stats.goals}
                                </div>
                              </div>
                              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-[10px] text-slate-400 uppercase">Assists</div>
                                <div className="text-base font-bold text-white">
                                  {player.stats.assists}
                                </div>
                              </div>
                              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-[10px] text-slate-400 uppercase">Trophies</div>
                                <div className="text-base font-bold text-white">
                                  {player.stats.trophies}
                                </div>
                              </div>
                              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-[10px] text-slate-400 uppercase">Clubs</div>
                                <div className="text-base font-bold text-white">
                                  {player.stats.clubs}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* 3. Stat Averages Right Wing: Comparison Bars */}
                        {activeFunction === 'category_averages' && (
                          <>
                            <div className="text-[10px] uppercase font-tactical font-bold text-white/50 tracking-wider">
                              Player vs Position Average
                            </div>
                            <div className="space-y-2 text-xs font-tactical">
                              <div>
                                <div className="flex justify-between text-[11px] mb-0.5">
                                  <span className="text-slate-400">Goals:</span>
                                  <span className="text-white font-bold">
                                    {player.stats.goals} vs{' '}
                                    {(item as RankedPlayerAverageDelta).benchmarkStats?.goalsAvg ??
                                      0}
                                  </span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                  <div
                                    className="h-full bg-blue-400 rounded-full"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        (player.stats.goals /
                                          Math.max(
                                            1,
                                            (item as RankedPlayerAverageDelta).benchmarkStats
                                              ?.goalsAvg || 1
                                          )) *
                                          50
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-[11px] mb-0.5">
                                  <span className="text-slate-400">Assists:</span>
                                  <span className="text-white font-bold">
                                    {player.stats.assists} vs{' '}
                                    {(item as RankedPlayerAverageDelta).benchmarkStats?.assistsAvg ??
                                      0}
                                  </span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                  <div
                                    className="h-full bg-cyan-400 rounded-full"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        (player.stats.assists /
                                          Math.max(
                                            1,
                                            (item as RankedPlayerAverageDelta).benchmarkStats
                                              ?.assistsAvg || 1
                                          )) *
                                          50
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-[11px] mb-0.5">
                                  <span className="text-slate-400">Trophies:</span>
                                  <span className="text-white font-bold">
                                    {player.stats.trophies} vs{' '}
                                    {(item as RankedPlayerAverageDelta).benchmarkStats?.trophiesAvg ??
                                      0}
                                  </span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-400 rounded-full"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        (player.stats.trophies /
                                          Math.max(
                                            1,
                                            (item as RankedPlayerAverageDelta).benchmarkStats
                                              ?.trophiesAvg || 1
                                          )) *
                                          50
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* 4. Full Contents / Delete Right Wing: Raw Dictionary & Actions */}
                        {(activeFunction === 'list_contents' ||
                          activeFunction === 'add_player' ||
                          activeFunction === 'add_stat' ||
                          activeFunction === 'delete_item') && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-tactical font-bold text-white/50 tracking-wider">
                                Python Dict Entry
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyPlayerDict(player);
                                }}
                                className="flex items-center gap-1 text-[10px] font-tactical px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                              >
                                {copiedPlayerId === player.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Dict</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="text-[11px] font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-xl border border-white/5 overflow-x-auto">
                              {JSON.stringify(player.stats, null, 2)}
                            </pre>
                          </>
                        )}

                        {/* Quick Contextual Actions on Card */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenAddStat(player);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-tactical font-semibold text-slate-200 transition-all active:scale-95"
                          >
                            <PlusSquare className="w-3.5 h-3.5 text-purple-400" />
                            <span>+ Stat</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Temporarily remove ${player.name} from the pitch?`)) {
                                onDeletePlayerDirect(player.id);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all active:scale-95"
                            title="Temporarily delete player from roster"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= BOTTOM FILMSTRIP QUICK JUMP RIBBON ================= */}
      <div className="relative z-20 px-4 sm:px-6 py-2.5 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between gap-4">
        {/* Navigation Info */}
        <div className="flex items-center gap-2 text-xs font-tactical font-bold text-slate-300">
          <span className="text-amber-400">PLAYER {currentIndex + 1}</span>
          <span className="text-white/40">/</span>
          <span className="text-white/70">{rankedData.length}</span>
          <span className="hidden sm:inline text-white/40">• (Use ← → Arrow Keys)</span>
        </div>

        {/* Filmstrip thumbnails */}
        <div className="flex-1 max-w-xl overflow-x-auto no-scrollbar flex items-center gap-1.5 px-2">
          {rankedData.map((item, idx) => {
            const p = item.player;
            const isSelected = idx === currentIndex;
            return (
              <button
                key={p.id}
                onClick={() => scrollToIndex(idx)}
                className={`group shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-tactical transition-all duration-200 border ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md scale-105'
                    : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="text-[10px] opacity-75">#{item.rank}</span>
                <span className="truncate max-w-[80px]">
                  {p.name.split(' ').slice(-1)[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Jump to Top / #1 */}
        <button
          onClick={() => scrollToIndex(0)}
          className="text-xs font-tactical font-bold text-amber-300 hover:text-amber-200 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 active:scale-95 transition-all"
        >
          Jump to #1
        </button>
      </div>
    </div>
  );
};
