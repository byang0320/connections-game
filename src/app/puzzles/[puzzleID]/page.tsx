// Logic for each specific puzzle

import { notFound } from "next/navigation";
import Board from "@/app/components/Board";
import PuzzleHeader from "@/app/components/PuzzleHeader";
import { getAllPuzzles, getPuzzleByID } from "@/lib/puzzles/queries";

import type { Metadata } from "next";
type PuzzlePageProps = {
    params: Promise<{puzzleID: string;}>;
}
export async function generateMetadata({ params }: PuzzlePageProps): Promise<Metadata> {
    const { puzzleID } = await params;
    const puzzle = getPuzzleByID(puzzleID);
    if (!puzzle) {
        return {
        title: "Puzzle Not Found",
        };
    }
    return {
        title: `Puzzle #${puzzle.puzzleNumber}`,
        description: `Puzzle #${puzzle.puzzleNumber}`,
    };
}

export default async function PuzzlePage({ params }: PuzzlePageProps) {
    const { puzzleID } = await params;
    const puzzle = getPuzzleByID(puzzleID);
    if (!puzzle) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
            <PuzzleHeader title={puzzle.title} subtitle={`Puzzle #${puzzle.puzzleNumber}`} />
            <Board puzzle={puzzle} />
        </main>
    );
}

export function generateStaticParams() {
    return getAllPuzzles().map((puzzle) => ({
        puzzleID: puzzle.id,
    }));
}