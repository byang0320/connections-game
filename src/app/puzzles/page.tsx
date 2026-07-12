// Path: /puzzles

import PuzzleCard from "../components/PuzzleCard";
import { getPuzzleSummaries } from "@/lib/puzzles/queries";

export const metadata = {
    title: 'Puzzle Catalog',
    description: 'Puzzle Catalog',
};

export default function PuzzlesPage() {
    const puzzles = getPuzzleSummaries();

    return (
        <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold">All Puzzles</h1>
                <p className="text-gray-600">Browse my custom Connections boards, newest first.</p>
            </header>
            
            <section className="space-y-4">
                {puzzles.map((puzzle) => (
                    <PuzzleCard key={puzzle.id} puzzle={puzzle} />
                ))}
            </section>
        </main>
    );
}