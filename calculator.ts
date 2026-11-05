import { EraCategory, Player, PositionCategory } from '../types/soccer';

export interface RatingBreakdown {
  score: number;
  formula: string;
  weights: {
    goals: number;
    assists: number;
    trophies: number;
    divisor: number;
  };
  explanation: string;
}

/**
 * Exact port of choice 1 from the user's Python code:
 * - legends midfielders: ((goals*8)+(assists*16)+(trophies*12))//40
 * - legends forwards: ((goals*7)+(assists*4)+(trophies*6))//50
 * - stars midfielders: ((goals*12)+(assists*24)+(trophies*18))//35
 * - stars forwards: ((goals*5)+(assists*3)+(trophies*5))//30
 */
export function calculateCareerRating(player: Player): RatingBreakdown {
  const { goals = 0, assists = 0, trophies = 0 } = player.stats;
  const { category, position } = player;

  if (category === 'legends') {
    if (position === 'midfielders') {
      const score = Math.floor((goals * 8 + assists * 16 + trophies * 12) / 40);
      return {
        score,
        formula: '((goals × 8) + (assists × 16) + (trophies × 12)) // 40',
        weights: { goals: 8, assists: 16, trophies: 12, divisor: 40 },
        explanation: 'Midfielders are heavily favored on assists (16x) and trophies (12x) with a tight 40 divisor.',
      };
    } else {
      const score = Math.floor((goals * 7 + assists * 4 + trophies * 6) / 50);
      return {
        score,
        formula: '((goals × 7) + (assists × 4) + (trophies × 6)) // 50',
        weights: { goals: 7, assists: 4, trophies: 6, divisor: 50 },
        explanation: 'Legendary forwards reward goal poachers (7x) and silverware (6x) divided by 50.',
      };
    }
  } else {
    // stars
    if (position === 'midfielders') {
      const score = Math.floor((goals * 12 + assists * 24 + trophies * 18) / 35);
      return {
        score,
        formula: '((goals × 12) + (assists × 24) + (trophies × 18)) // 35',
        weights: { goals: 12, assists: 24, trophies: 18, divisor: 35 },
        explanation: 'Modern star midfielders receive an amplified 24x assist booster and 18x trophy weighting over 35 divisor.',
      };
    } else {
      const score = Math.floor((goals * 5 + assists * 3 + trophies * 5) / 30);
      return {
        score,
        formula: '((goals × 5) + (assists × 3) + (trophies × 5)) // 30',
        weights: { goals: 5, assists: 3, trophies: 5, divisor: 30 },
        explanation: 'Modern star forwards use 5x goals, 3x assists, and 5x trophies over 30 divisor to accommodate younger careers.',
      };
    }
  }
}

/**
 * Exact port of choice 5 (Category Averages):
 * average_stat = avg_sum // len(players[legends_or_stars][pos_choice])
 */
export function calculateCategoryAverage(
  players: Player[],
  category: EraCategory,
  position: PositionCategory,
  statName: string
): { average: number; count: number; sum: number } {
  const filtered = players.filter((p) => p.category === category && p.position === position);
  if (filtered.length === 0) return { average: 0, count: 0, sum: 0 };

  const sum = filtered.reduce((acc, p) => acc + (p.stats[statName] || 0), 0);
  const average = Math.floor(sum / filtered.length);

  return { average, count: filtered.length, sum };
}

/**
 * Exact port of choice 7 (Most Stats in Category):
 * Finds the player with the highest number in a given stat for legends or stars.
 */
export function findCategoryLeader(
  players: Player[],
  category: EraCategory,
  statName: string
): { leader: Player | null; statValue: number; tiedPlayers: Player[] } {
  const filtered = players.filter((p) => p.category === category);
  if (filtered.length === 0) {
    return { leader: null, statValue: 0, tiedPlayers: [] };
  }

  let maxVal = -1;
  let leader: Player | null = null;
  const tied: Player[] = [];

  for (const p of filtered) {
    const val = p.stats[statName] ?? 0;
    if (val > maxVal) {
      maxVal = val;
      leader = p;
      tied.length = 0;
      tied.push(p);
    } else if (val === maxVal && maxVal > 0) {
      tied.push(p);
    }
  }

  return { leader, statValue: Math.max(0, maxVal), tiedPlayers: tied };
}

/**
 * Exports current active players as Python dictionary code
 */
export function exportAsPythonDictionary(players: Player[]): string {
  const dict: Record<string, Record<string, Record<string, Record<string, number>>>> = {
    legends: { midfielders: {}, forwards: {} },
    stars: { midfielders: {}, forwards: {} },
  };

  for (const p of players) {
    dict[p.category][p.position][p.name] = { ...p.stats };
  }

  return `players = ${JSON.stringify(dict, null, 4)}`.replace(/"/g, "'");
}

export interface RankedPlayerCareer {
  rank: number;
  player: Player;
  rating: RatingBreakdown;
}

export function rankPlayersByCareerRating(players: Player[]): RankedPlayerCareer[] {
  const scored = players.map((player) => ({
    player,
    rating: calculateCareerRating(player),
  }));

  scored.sort((a, b) => b.rating.score - a.rating.score);

  return scored.map((item, index) => ({
    rank: index + 1,
    player: item.player,
    rating: item.rating,
  }));
}

export interface RankedPlayerStat {
  rank: number;
  player: Player;
  statName: string;
  statValue: number;
}

export function rankPlayersByStat(players: Player[], statName: string): RankedPlayerStat[] {
  const sorted = [...players].sort((a, b) => {
    const valA = a.stats[statName] ?? 0;
    const valB = b.stats[statName] ?? 0;
    return valB - valA;
  });

  return sorted.map((player, index) => ({
    rank: index + 1,
    player,
    statName,
    statValue: player.stats[statName] ?? 0,
  }));
}

export interface RankedPlayerAverageDelta {
  rank: number;
  player: Player;
  deltaPct: number;
  statName: string;
  playerVal: number;
  averageVal: number;
  positionGroup: string;
  benchmarkStats: {
    goalsAvg: number;
    assistsAvg: number;
    trophiesAvg: number;
  };
}

export function rankPlayersByPositionalDelta(
  players: Player[],
  focusStat: string = 'composite'
): RankedPlayerAverageDelta[] {
  // Precompute group averages for the 4 positional quadrants
  const groups = [
    { cat: 'legends' as EraCategory, pos: 'midfielders' as PositionCategory },
    { cat: 'legends' as EraCategory, pos: 'forwards' as PositionCategory },
    { cat: 'stars' as EraCategory, pos: 'midfielders' as PositionCategory },
    { cat: 'stars' as EraCategory, pos: 'forwards' as PositionCategory },
  ];

  const groupBenchmarks = new Map<string, { goalsAvg: number; assistsAvg: number; trophiesAvg: number }>();

  for (const g of groups) {
    const key = `${g.cat}-${g.pos}`;
    const goalsAvg = calculateCategoryAverage(players, g.cat, g.pos, 'goals').average;
    const assistsAvg = calculateCategoryAverage(players, g.cat, g.pos, 'assists').average;
    const trophiesAvg = calculateCategoryAverage(players, g.cat, g.pos, 'trophies').average;
    groupBenchmarks.set(key, { goalsAvg, assistsAvg, trophiesAvg });
  }

  const results = players.map((player) => {
    const groupKey = `${player.category}-${player.position}`;
    const benchmarks = groupBenchmarks.get(groupKey) || { goalsAvg: 1, assistsAvg: 1, trophiesAvg: 1 };

    let playerVal = 0;
    let averageVal = 0;
    let deltaPct = 0;

    if (focusStat === 'goals') {
      playerVal = player.stats.goals ?? 0;
      averageVal = benchmarks.goalsAvg;
      deltaPct = averageVal > 0 ? Math.round(((playerVal - averageVal) / averageVal) * 100) : 0;
    } else if (focusStat === 'assists') {
      playerVal = player.stats.assists ?? 0;
      averageVal = benchmarks.assistsAvg;
      deltaPct = averageVal > 0 ? Math.round(((playerVal - averageVal) / averageVal) * 100) : 0;
    } else if (focusStat === 'trophies') {
      playerVal = player.stats.trophies ?? 0;
      averageVal = benchmarks.trophiesAvg;
      deltaPct = averageVal > 0 ? Math.round(((playerVal - averageVal) / averageVal) * 100) : 0;
    } else {
      // Composite weighted delta
      const goalsDelta = benchmarks.goalsAvg > 0 ? (player.stats.goals - benchmarks.goalsAvg) / benchmarks.goalsAvg : 0;
      const assistsDelta = benchmarks.assistsAvg > 0 ? (player.stats.assists - benchmarks.assistsAvg) / benchmarks.assistsAvg : 0;
      const trophiesDelta = benchmarks.trophiesAvg > 0 ? (player.stats.trophies - benchmarks.trophiesAvg) / benchmarks.trophiesAvg : 0;
      const compositeRatio = (goalsDelta * 0.45 + assistsDelta * 0.35 + trophiesDelta * 0.20);
      deltaPct = Math.round(compositeRatio * 100);
      playerVal = player.stats.goals;
      averageVal = benchmarks.goalsAvg;
    }

    const groupLabel = `${player.category === 'legends' ? 'Legends' : 'Stars'} ${player.position === 'midfielders' ? 'Midfielders' : 'Forwards'}`;

    return {
      player,
      deltaPct,
      statName: focusStat,
      playerVal,
      averageVal,
      positionGroup: groupLabel,
      benchmarkStats: benchmarks,
    };
  });

  results.sort((a, b) => b.deltaPct - a.deltaPct);

  return results.map((item, idx) => ({
    rank: idx + 1,
    ...item,
  }));
}
