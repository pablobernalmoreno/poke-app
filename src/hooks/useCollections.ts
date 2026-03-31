import { useCallback, useState } from "react";

const TEAM_MAX = 6;
const LS_FAVORITES = "pokedex:favorites";
const LS_TEAM = "pokedex:team";
const LS_TYPE_ACES = "pokedex:typeAces";

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function loadArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function loadRecord(key: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export interface CollectionsState {
  favorites: Set<string>;
  team: string[];
  typeAces: Record<string, string>;
  toggleFavorite: (name: string) => void;
  addToTeam: (name: string) => void;
  removeFromTeam: (name: string) => void;
  setTypeAce: (type: string, name: string) => void;
  clearTypeAce: (type: string) => void;
  isInTeam: (name: string) => boolean;
  teamFull: boolean;
}

export function useCollections(): CollectionsState {
  const [favorites, setFavorites] = useState<Set<string>>(
    () => (globalThis.window === undefined ? new Set() : loadSet(LS_FAVORITES)),
  );
  const [team, setTeam] = useState<string[]>(
    () => (globalThis.window === undefined ? [] : loadArray(LS_TEAM)),
  );
  const [typeAces, setTypeAces] = useState<Record<string, string>>(
    () => (globalThis.window === undefined ? {} : loadRecord(LS_TYPE_ACES)),
  );

  const toggleFavorite = useCallback((name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      localStorage.setItem(LS_FAVORITES, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const addToTeam = useCallback((name: string) => {
    setTeam((prev) => {
      if (prev.includes(name) || prev.length >= TEAM_MAX) return prev;
      const next = [...prev, name];
      localStorage.setItem(LS_TEAM, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromTeam = useCallback((name: string) => {
    setTeam((prev) => {
      const next = prev.filter((n) => n !== name);
      localStorage.setItem(LS_TEAM, JSON.stringify(next));
      return next;
    });
  }, []);

  const setTypeAce = useCallback((type: string, name: string) => {
    setTypeAces((prev) => {
      const next = { ...prev, [type]: name };
      localStorage.setItem(LS_TYPE_ACES, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearTypeAce = useCallback((type: string) => {
    setTypeAces((prev) => {
      const next = { ...prev };
      delete next[type];
      localStorage.setItem(LS_TYPE_ACES, JSON.stringify(next));
      return next;
    });
  }, []);

  const isInTeam = useCallback(
    (name: string) => team.includes(name),
    [team],
  );

  return {
    favorites,
    team,
    typeAces,
    toggleFavorite,
    addToTeam,
    removeFromTeam,
    setTypeAce,
    clearTypeAce,
    isInTeam,
    teamFull: team.length >= TEAM_MAX,
  };
}
