"use client";

import { useSyncExternalStore } from "react";
import { initialGames, type Game } from "./games-data";

const STORAGE_KEY = "playboxd-games";
const CHANGE_EVENT = "playboxd-games-change";

let cachedText: string | null = null;
let cachedGames: Game[] = initialGames;

function readGames() {
  if (typeof window === "undefined") return initialGames;

  const savedText = window.localStorage.getItem(STORAGE_KEY);

  if (savedText === cachedText) return cachedGames;

  cachedText = savedText;

  if (!savedText) {
    cachedGames = initialGames;
    return cachedGames;
  }

  try {
    cachedGames = JSON.parse(savedText) as Game[];
  } catch {
    cachedGames = initialGames;
  }

  return cachedGames;
}

function subscribeToGames(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };

  window.addEventListener("storage", onStorageChange);
  window.addEventListener(CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", onStorageChange);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function saveGames(games: Game[]) {
  if (typeof window === "undefined") return;

  cachedGames = games;
  cachedText = JSON.stringify(games);

  window.localStorage.setItem(STORAGE_KEY, cachedText);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useSavedGames() {
  return useSyncExternalStore(subscribeToGames, readGames, () => initialGames);
}
