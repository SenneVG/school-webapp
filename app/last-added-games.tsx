"use client";

import { useSavedGames } from "./use-saved-games";

export default function LastAddedGames() {
  const games = useSavedGames();
  const lastAddedGames = games.slice(-3).reverse();

  if (games.length === 0) {
    return (
      <p className="mt-4 rounded-md border p-4 text-black/60">
        No games have been added yet.
      </p>
    );
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {lastAddedGames.map((game) => (
        <div
          key={game.id}
          className={`rounded-md border p-4 ${
            game.picture
              ? "min-h-44 bg-cover bg-center text-white"
              : "text-black"
          }`}
          style={
            game.picture
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.7)), url(${game.picture})`,
                }
              : undefined
          }
        >
          <div className="flex h-full min-h-36 flex-col justify-end">
            <h3 className="font-bold">{game.title}</h3>
            <p
              className={`mt-2 text-sm ${
                game.picture ? "text-white/75" : "text-black/60"
              }`}
            >
              {game.status}
            </p>
            <p className="mt-4 text-2xl font-bold">
              {game.score === null ? "No score" : `${game.score}/10`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
