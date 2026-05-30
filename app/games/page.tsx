"use client";

import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import type { Game, GameStatus } from "../games-data";
import { saveGames, useSavedGames } from "../use-saved-games";

const statuses: GameStatus[] = ["Playing", "Finished", "Want to play"];
type SortOrder = "Date added" | "Highest score" | "Lowest score";

export default function GamesPage() {
  const games = useSavedGames();
  const [showForm, setShowForm] = useState(false);
  const [editingGameId, setEditingGameId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [score, setScore] = useState("");
  const [status, setStatus] = useState<GameStatus>("Playing");
  const [picture, setPicture] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | GameStatus>("All");
  const [minimumScore, setMinimumScore] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>("Date added");
  const isEditing = editingGameId !== null;

  const filteredGames = games
    .filter((game) => {
      const scoreFilterIsDefault = minimumScore === 0;
      const matchesName = game.title
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || game.status === statusFilter;
      const matchesScore =
        game.score === null ? scoreFilterIsDefault : game.score >= minimumScore;

      return matchesName && matchesStatus && matchesScore;
    })
    .sort((a, b) => {
      if (sortOrder === "Date added") return b.id - a.id;
      if (a.score === null && b.score === null) return 0;
      if (a.score === null) return 1;
      if (b.score === null) return -1;

      if (sortOrder === "Highest score") return b.score - a.score;
      return a.score - b.score;
    });

  function resetForm() {
    setTitle("");
    setScore("");
    setStatus("Playing");
    setPicture("");
  }

  function closeForm() {
    resetForm();
    setEditingGameId(null);
    setShowForm(false);
  }

  function openAddForm() {
    resetForm();
    setEditingGameId(null);
    setShowForm(true);
  }

  function openEditForm(game: Game) {
    setEditingGameId(game.id);
    setTitle(game.title);
    setScore(game.score === null ? "" : String(game.score));
    setStatus(game.status);
    setPicture(game.picture ?? "");
    setShowForm(true);
  }

  function saveGame(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.trim() === "") return;

    const savedGame = {
      id: editingGameId ?? Date.now(),
      title: title.trim(),
      score: status === "Want to play" ? null : Number(score),
      status,
      picture,
    };

    if (isEditing) {
      saveGames(
        games.map((game) => (game.id === editingGameId ? savedGame : game)),
      );
    } else {
      saveGames([...games, savedGame]);
    }

    closeForm();
  }

  function removeGame(id: number) {
    saveGames(games.filter((game) => game.id !== id));
  }

  function choosePicture(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setPicture(String(reader.result));
    };

    reader.readAsDataURL(file);
  }

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-black">
      <nav className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Playboxd
        </Link>
        <div className="flex gap-2">
          <Link href="/" className="button-hover rounded-md border px-4 py-2">
            Home
          </Link>
          <Link
            href="/games"
            className="button-hover rounded-md bg-black px-4 py-2 text-white"
          >
            Games
          </Link>
        </div>
      </nav>

      <section className="mx-auto mt-12 max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold">Games</h1>
          <button
            onClick={openAddForm}
            className="button-hover rounded-md bg-black px-4 py-2 font-semibold text-white"
          >
            Add game
          </button>
        </div>

        {showForm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
            <form
              onSubmit={saveGame}
              className="w-full max-w-xl space-y-4 rounded-md bg-white p-5 shadow-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">
                  {isEditing ? "Edit game" : "Add game"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  className="button-hover rounded-md border px-3 py-2 text-sm"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-semibold">Name</span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Game title"
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold">State</span>
                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as GameStatus)
                    }
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  >
                    {statuses.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-semibold">Score</span>
                  <input
                    value={status === "Want to play" ? "" : score}
                    onChange={(event) => setScore(event.target.value)}
                    disabled={status === "Want to play"}
                    min="0"
                    max="10"
                    required={status !== "Want to play"}
                    type="number"
                    className="mt-1 w-full rounded-md border px-3 py-2 disabled:bg-gray-100"
                    placeholder={
                      status === "Want to play" ? "No score yet" : undefined
                    }
                  />
                </label>

                <div>
                  <span className="text-sm font-semibold">Picture</span>
                  {picture ? (
                    <div className="mt-3 flex items-center gap-3 rounded-md border p-2">
                      <div
                        className="h-14 w-14 rounded-md bg-gray-100 bg-cover bg-center"
                        style={{ backgroundImage: `url(${picture})` }}
                      />
                      <span className="flex-1 text-sm text-black/60">
                        Picture added
                      </span>
                      <button
                        type="button"
                        onClick={() => setPicture("")}
                        className="button-hover rounded-md border border-red-300 px-2 py-1 text-sm text-red-500"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        id="picture"
                        onChange={choosePicture}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                      />
                      <label
                        htmlFor="picture"
                        className="button-hover mt-1 block cursor-pointer rounded-md border border-black bg-white px-3 py-2 text-center font-semibold text-blue-600"
                      >
                        Choose file
                      </label>
                    </>
                  )}
                </div>
              </div>

              <button className="button-hover rounded-md bg-black px-4 py-2 font-semibold text-white">
                {isEditing ? "Save" : "Add"}
              </button>
            </form>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 rounded-md border p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label>
            <span className="text-sm font-semibold">Name</span>
            <input
              value={nameFilter}
              onChange={(event) => setNameFilter(event.target.value)}
              placeholder="Search"
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>

          <label>
            <span className="text-sm font-semibold">State</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "All" | GameStatus)
              }
              className="mt-1 w-full rounded-md border px-3 py-2"
            >
              <option>All</option>
              {statuses.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-semibold">Minimum score</span>
            <input
              value={minimumScore}
              onChange={(event) => setMinimumScore(Number(event.target.value))}
              min="0"
              max="10"
              type="number"
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>

          <label>
            <span className="text-sm font-semibold">Sort</span>
            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              className="mt-1 w-full rounded-md border px-3 py-2"
            >
              <option>Date added</option>
              <option>Highest score</option>
              <option>Lowest score</option>
            </select>
          </label>
        </div>

        <div className="mt-6 space-y-3">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="flex items-center justify-between gap-4 rounded-md border p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-gray-100 bg-cover bg-center font-bold"
                  style={
                    game.picture
                      ? { backgroundImage: `url(${game.picture})` }
                      : undefined
                  }
                >
                  {game.picture ? "" : game.title.charAt(0)}
                </div>

                <div>
                  <h2 className="font-bold">{game.title}</h2>
                  <p className="text-sm text-black/60">
                    {game.status} -{" "}
                    {game.score === null ? "No score" : `${game.score}/10`}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(game)}
                  className="button-hover rounded-md border px-3 py-2 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeGame(game.id)}
                  className="button-hover rounded-md border border-red-300 px-3 py-2 text-sm text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {games.length === 0 ? (
          <p className="mt-6 rounded-md border p-4 text-black/60">
            No games have been added yet.
          </p>
        ) : null}

        {games.length > 0 && filteredGames.length === 0 ? (
          <p className="mt-6 rounded-md border p-4 text-black/60">
            No games match these filters.
          </p>
        ) : null}
      </section>
    </main>
  );
}
