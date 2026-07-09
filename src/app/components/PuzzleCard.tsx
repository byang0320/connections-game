// Puzzle card shown in /puzzles

import Link from "next/link";
import type { PuzzleSummary } from "@/lib/game/types";

interface PuzzleCardProps {
    puzzle: PuzzleSummary,
}

const colors = [
  {
    bg: "bg-yellow-100",
    hover: "hover:bg-yellow-200",
  },
  {
    bg: "bg-green-100",
    hover: "hover:bg-green-200",
  },
  {
    bg: "bg-blue-100",
    hover: "hover:bg-blue-200",
  },
  {
    bg: "bg-purple-100",
    hover: "hover:bg-purple-200",
  },
];

export default function PuzzleCard({ puzzle }: PuzzleCardProps) {
    const color = colors[(puzzle.puzzleNumber + 3) % colors.length];
    return (
        <article>
            <Link href={`/puzzles/${puzzle.id}`} className={`block rounded-lg border border-gray-300 p-5 transition-colors ${color.bg} ${color.hover}`}>
                <h2 className="text-xl font-semibold">
                    Puzzle #{puzzle.puzzleNumber}: {puzzle.title}
                </h2>

                <p className="text-sm text-gray-500">
                    {puzzle.publishedAt}
                </p>

                {puzzle.description && (
                    <p className="mt-2 text-gray-600">
                        {puzzle.description}
                    </p>
                )}
            </Link>
        </article>
    );
}