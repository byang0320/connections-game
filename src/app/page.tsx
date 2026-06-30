import Board from "./components/Board";
import { samplePuzzle } from "./lib/samplePuzzle";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">
        {samplePuzzle.title}
      </h1>

      <Board puzzle={samplePuzzle} />
    </main>
  );
}