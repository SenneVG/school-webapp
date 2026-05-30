import Link from "next/link";
import LastAddedGames from "./last-added-games";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="min-h-[72vh] bg-[linear-gradient(to_right,rgba(0,0,0,0.76),rgba(0,0,0,0.25)),url('/hero-switch.jpg')] bg-cover bg-center px-6 py-8 text-white">
        <nav className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Playboxd
          </Link>
          <div className="flex gap-2">
            <Link
              href="/"
              className="button-hover rounded-md bg-white px-4 py-2 text-black"
            >
              Home
            </Link>
            <Link
              href="/games"
              className="button-hover rounded-md border border-white px-4 py-2"
            >
              Games
            </Link>
          </div>
        </nav>

        <div className="mx-auto mt-24 max-w-4xl">
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight">
            Playboxd
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">
            Keep track of the games you play, score your favourites, and save
            what you want to play next.
          </p>

          <Link
            href="/games"
            className="button-hover mt-8 inline-block rounded-md bg-white px-5 py-3 font-semibold text-black"
          >
            Go to games
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold">Last added games</h2>
          <LastAddedGames />
        </div>
      </section>
    </main>
  );
}
