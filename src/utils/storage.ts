import { CloakConfig, Game, GameUserData } from '../types';
import initialGames from '../data/games.json';

const FAVORITES_KEY = 'ubg_favorites';
const USER_DATA_KEY = 'ubg_user_data';
const CUSTOM_GAMES_KEY = 'ubg_custom_games';
const CLOAK_CONFIG_KEY = 'ubg_cloak_config';
const GAME_REQUESTS_KEY = 'ubg_game_requests';

// Get all combined games (initial JSON + user custom games)
export function getAllGames(): Game[] {
  const custom = getCustomGames();
  const initial = initialGames as Game[];
  return [...custom, ...initial];
}

// Get custom games from localStorage
export function getCustomGames(): Game[] {
  try {
    const data = localStorage.getItem(CUSTOM_GAMES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save a new custom game
export function addCustomGame(newGame: Omit<Game, 'id' | 'isCustom' | 'rating' | 'plays'> & { id?: string }): Game {
  const customGames = getCustomGames();
  const game: Game = {
    ...newGame,
    id: newGame.id || `custom-${Date.now()}`,
    isCustom: true,
    rating: 5.0,
    plays: 1,
    addedAt: new Date().toISOString(),
  };

  const updated = [game, ...customGames];
  localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(updated));
  return game;
}

// Remove a custom game
export function removeCustomGame(id: string): void {
  const customGames = getCustomGames().filter((g) => g.id !== id);
  localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(customGames));
}

// Export custom games as JSON string
export function exportGamesJSON(): string {
  const custom = getCustomGames();
  return JSON.stringify(custom, null, 2);
}

// Import custom games from JSON string
export function importGamesJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return false;

    const existing = getCustomGames();
    const existingIds = new Set(existing.map((g) => g.id));

    const validNewGames: Game[] = [];
    for (const item of parsed) {
      if (item.title && (item.iframeUrl || item.srcDoc)) {
        const id = item.id && !existingIds.has(item.id) ? item.id : `imported-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        validNewGames.push({
          id,
          title: item.title,
          category: item.category || 'Arcade',
          description: item.description || 'Custom imported game',
          iframeUrl: item.iframeUrl,
          srcDoc: item.srcDoc,
          thumbnail: item.thumbnail || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          rating: item.rating || 5.0,
          plays: item.plays || 1,
          tags: item.tags || ['Imported', 'Custom'],
          controls: item.controls || ['Mouse/Keyboard'],
          isCustom: true,
        });
      }
    }

    if (validNewGames.length > 0) {
      localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify([...validNewGames, ...existing]));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Get User Data for a specific game (Favorites, Notes, High Score, Like/Dislike)
export function getGameUserData(gameId: string): GameUserData {
  try {
    const allDataRaw = localStorage.getItem(USER_DATA_KEY);
    const allData = allDataRaw ? JSON.parse(allDataRaw) : {};
    const favs = getFavoritesList();

    return {
      isFavorite: favs.includes(gameId),
      likedStatus: allData[gameId]?.likedStatus || null,
      highScore: allData[gameId]?.highScore || 0,
      notes: allData[gameId]?.notes || '',
      lastPlayed: allData[gameId]?.lastPlayed || undefined,
    };
  } catch {
    return { isFavorite: false };
  }
}

export function saveGameUserData(gameId: string, updates: Partial<GameUserData>): void {
  try {
    const allDataRaw = localStorage.getItem(USER_DATA_KEY);
    const allData = allDataRaw ? JSON.parse(allDataRaw) : {};

    allData[gameId] = {
      ...(allData[gameId] || {}),
      ...updates,
      lastPlayed: new Date().toISOString(),
    };

    localStorage.setItem(USER_DATA_KEY, JSON.stringify(allData));
  } catch (err) {
    console.error('Failed to save game user data:', err);
  }
}

// Favorites list
export function getFavoritesList(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(gameId: string): boolean {
  const favs = getFavoritesList();
  const index = favs.indexOf(gameId);
  let isFav = false;

  if (index >= 0) {
    favs.splice(index, 1);
    isFav = false;
  } else {
    favs.push(gameId);
    isFav = true;
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return isFav;
}

// Cloak Config
export function getCloakConfig(): CloakConfig {
  try {
    const raw = localStorage.getItem(CLOAK_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    preset: 'none',
    panicKey: 'Escape',
    panicUrl: 'https://classroom.google.com',
  };
}

export function saveCloakConfig(config: CloakConfig): void {
  localStorage.setItem(CLOAK_CONFIG_KEY, JSON.stringify(config));
  applyCloak(config);
}

export function applyCloak(config: CloakConfig): void {
  const faviconEl = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
  faviconEl.type = 'image/x-icon';
  faviconEl.rel = 'shortcut icon';

  if (config.preset === 'google_classroom') {
    document.title = 'Classes - Google Classroom';
    faviconEl.href = 'https://ssl.gstatic.com/classroom/favicon.png';
  } else if (config.preset === 'google_docs') {
    document.title = 'Google Docs - Untitled document';
    faviconEl.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
  } else if (config.preset === 'wikipedia') {
    document.title = 'Wikipedia, the free encyclopedia';
    faviconEl.href = 'https://en.wikipedia.org/static/favicon/wikipedia.ico';
  } else if (config.preset === 'canvas') {
    document.title = 'Dashboard - Canvas LMS';
    faviconEl.href = 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico';
  } else if (config.customTitle) {
    document.title = config.customTitle;
    if (config.customIcon) faviconEl.href = config.customIcon;
  } else {
    document.title = 'Unblocked Games Hub - Instant HTML5 Games';
    faviconEl.href = '/favicon.ico';
  }

  if (!document.querySelector("link[rel*='icon']")) {
    document.head.appendChild(faviconEl);
  }
}

// Game Requests
export function addGameRequest(gameName: string, notes: string): void {
  try {
    const raw = localStorage.getItem(GAME_REQUESTS_KEY);
    const requests = raw ? JSON.parse(raw) : [];
    requests.push({
      gameName,
      notes,
      date: new Date().toISOString(),
    });
    localStorage.setItem(GAME_REQUESTS_KEY, JSON.stringify(requests));
  } catch {}
}
