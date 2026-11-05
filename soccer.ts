export type EraCategory = 'legends' | 'stars';
export type PositionCategory = 'midfielders' | 'forwards';

export interface PlayerStats {
  goals: number;
  assists: number;
  trophies: number;
  clubs: number;
  [customStat: string]: number;
}

export interface PlayerCaricatureStyle {
  skinTone: string;
  hairColor: string;
  hairStyle: 'curls' | 'buzz' | 'ponytail' | 'short' | 'afro' | 'bald' | 'flow';
  kitPrimaryColor: string;
  kitSecondaryColor: string;
  bootColor: string;
  customImage?: string;
}

export interface Player {
  id: string;
  name: string;
  category: EraCategory;
  position: PositionCategory;
  kitNumber: number;
  nationality: string;
  countryCode: string; // ISO 2-letter for flag or emoji
  currentOrFamousClub: string;
  stats: PlayerStats;
  fieldCoordinates: {
    x: number; // 0 to 100 percentage across the pitch
    y: number; // 0 to 100 percentage down the pitch
  };
  style: PlayerCaricatureStyle;
  notes?: string;
}

export type PythonPlayersDictionary = {
  legends: {
    midfielders: Record<string, PlayerStats>;
    forwards: Record<string, PlayerStats>;
  };
  stars: {
    midfielders: Record<string, PlayerStats>;
    forwards: Record<string, PlayerStats>;
  };
};

export type ActiveModal =
  | null
  | 'career_rating'
  | 'list_contents'
  | 'add_player'
  | 'add_stat'
  | 'category_averages'
  | 'delete_item'
  | 'category_leaders'
  | 'reset_roster';
