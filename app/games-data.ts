export type GameStatus = "Playing" | "Finished" | "Want to play";

export type Game = {
  id: number;
  title: string;
  score: number | null;
  status: GameStatus;
  picture?: string;
};

export const initialGames: Game[] = [];
