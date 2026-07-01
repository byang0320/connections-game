import Board from "./components/Board";
import { samplePuzzle } from "./lib/samplePuzzle";
import { getAllTiles, shuffleTiles } from "../lib/game/puzzleEngine";

// Makes this page generate a fresh shuffled order on each refresh
// tileOrder is built only on the server (here) and reused by the client
export const dynamic = "force-dynamic";

export default function Home() {
  const initialTileOrder = shuffleTiles(getAllTiles(samplePuzzle));

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">{samplePuzzle.title}</h1>
      <Board puzzle={samplePuzzle} initialTileOrder={initialTileOrder} />
    </main>
  );
}