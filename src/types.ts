export type GameCategory =
  | 'All'
  | 'Action'
  | 'Arcade'
  | 'Puzzle'
  | 'Retro'
  | 'Sports'
  | 'Driving'
  | 'Strategy'
  | 'Favorites'
  | 'Custom';

export interface Game {
  id: string;
  title: string;
  category: GameCategory;
  description: string;
  iframeUrl?: string;
  srcDoc?: string;
  thumbnail?: string;
  badge?: 'HOT' | 'POPULAR' | 'NEW' | 'CLASSIC' | 'FEATURED';
  rating: number;
  plays: number;
  tags: string[];
  controls: string[];
  isCustom?: boolean;
  author?: string;
  addedAt?: string;
}

export type CloakPreset = 'none' | 'google_classroom' | 'google_docs' | 'wikipedia' | 'canvas';

export interface CloakConfig {
  preset: CloakPreset;
  customTitle?: string;
  customIcon?: string;
  panicKey: string; // e.g. 'Escape' or 'Backquote'
  panicUrl: string; // e.g. 'https://classroom.google.com'
}

export interface GameUserData {
  isFavorite: boolean;
  likedStatus?: 'liked' | 'disliked' | null;
  highScore?: number;
  notes?: string;
  lastPlayed?: string;
}
