// Main backend logic

import type { Puzzle, PuzzleSummary } from "@/lib/game/types";
import { validatePuzzle } from "@/lib/game/puzzleValidation";
import { puzzles } from "./index";

function sortNewestFirst(puzzlesToSort: Puzzle[]): Puzzle[] {
  // Sorts puzzles by most recent coming first
  return [...puzzlesToSort].sort((a, b) => {
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

// Retrieve all puzzles created, sorted by newest first
export function getAllPuzzles(): Puzzle[] {
  return sortNewestFirst(puzzles);
}

// Retrieve one specific puzzle with specific ID
export function getPuzzleByID(puzzleID: string): Puzzle | undefined {
  return puzzles.find((puzzle) => puzzle.id === puzzleID);
}

// Retrieve puzzle with latest date if valid, otherwise just the first puzzle
export function getTodaysPuzzle(): Puzzle {
  const today = new Date().toISOString().slice(0, 10);
  const publishedPuzzles = puzzles.filter((puzzle) => puzzle.publishedAt <= today);
  return sortNewestFirst(publishedPuzzles)[0] ?? sortNewestFirst(puzzles)[0];
}

// Get information about each puzzle
export function getPuzzleSummaries(): PuzzleSummary[] {
  return getAllPuzzles().map((puzzle) => ({
    id: puzzle.id,
    title: puzzle.title,
    puzzleNumber: puzzle.puzzleNumber,
    publishedAt: puzzle.publishedAt,
    description: puzzle.description,
  }));
}

// Validates each puzzle in the array based on puzzleValidation.ts
export function validateAllPuzzles(): string[] {
  return puzzles.flatMap((puzzle) => {
    const errors = validatePuzzle(puzzle);
    return errors.map((error) => `${puzzle.id}: ${error}`);
  });
}