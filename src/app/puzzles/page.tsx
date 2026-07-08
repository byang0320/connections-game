// Path: /puzzles

import Link from "next/link";
import { getPuzzleSummaries } from "@/lib/puzzles/queries";

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
                    // Can be a custom card later
                    <article key={puzzle.id}>
                        <Link href={`/puzzles/${puzzle.id}`} className="block rounded-lg border border-gray-300 p-5 hover:bg-gray-50">
                            <h2 className="text-xl font-semibold">Puzzle #{puzzle.puzzleNumber}: {puzzle.title}</h2>
                        </Link>
                        <p className="text-sm text-gray-500">{puzzle.publishedAt}</p>

                        {puzzle.description && <p className="mt-2 text-gray-600">{puzzle.description}</p>}
                    </article>
                ))}
            </section>
        </main>
    );
}