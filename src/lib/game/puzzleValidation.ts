import type { Puzzle, PuzzleGroup } from "./types";

// Standardize a word before comparing it; for example, "  Apple " becomes "APPLE"
export function normalizeWord(word: string): string {
  return word.trim().toUpperCase();
}

export function hasExactlyFourGroups(puzzle: Puzzle): boolean {
  return puzzle.groups.length === 4;
}

export function hasExactlySixteenWords(puzzle: Puzzle): boolean {
  const totalWords = puzzle.groups.reduce(
    (total, group) => total + group.words.length,
    0
  );

  return totalWords === 16;
}

export function hasDuplicateWords(puzzle: Puzzle): boolean {
  const normalizedWords = puzzle.groups.flatMap((group) =>
    group.words.map(normalizeWord)
  );

  return new Set(normalizedWords).size !== normalizedWords.length;
}

export function validateGroup(group: PuzzleGroup): string[] {
  const errors: string[] = [];

  if (group.id.trim() === "") {
    errors.push("Every group needs an ID.");
  }

  if (group.category.trim() === "") {
    errors.push(`Group "${group.id}" needs a category name.`);
  }

  if (group.words.length !== 4) {
    errors.push(
      `Group "${group.category}" must contain exactly four words.`
    );
  }

  for (const word of group.words) {
    if (word.trim() === "") {
      errors.push(
        `Group "${group.category}" contains an empty word.`
      );
    }
  }

  return errors;
}

// Error checking happens here!
// Returns an empty array when the puzzle is valid. Otherwise, it returns every problem it found.
export function validatePuzzle(puzzle: Puzzle): string[] {
  const errors: string[] = [];

  if (puzzle.id.trim() === "") {
    errors.push("Puzzle needs an ID.");
  }

  if (puzzle.title.trim() === "") {
    errors.push("Puzzle needs a title.");
  }

  if (!hasExactlyFourGroups(puzzle)) {
    errors.push("Puzzle must contain exactly four groups.");
  }

  if (!hasExactlySixteenWords(puzzle)) {
    errors.push("Puzzle must contain exactly sixteen words total.");
  }

  for (const group of puzzle.groups) {
    errors.push(...validateGroup(group));
  }

  if (hasDuplicateWords(puzzle)) {
    errors.push(
      "Puzzle cannot contain duplicate words, ignoring capitalization and whitespace."
    );
  }

  const normalizedCategories = puzzle.groups.map((group) =>
    normalizeWord(group.category)
  );

  if (new Set(normalizedCategories).size !== normalizedCategories.length) {
    errors.push("Puzzle categories must be distinct.");
  }

  const groupIDs = puzzle.groups.map((group) => group.id);

  if (new Set(groupIDs).size !== groupIDs.length) {
    errors.push("Puzzle group IDs must be distinct.");
  }

  const difficulties = puzzle.groups.map((group) => group.difficulty);
  const expectedDifficulties = [0, 1, 2, 3];

  const hasCorrectDifficulties =
    difficulties.length === 4 &&
    expectedDifficulties.every((difficulty) =>
      difficulties.includes(difficulty)
    );

  if (!hasCorrectDifficulties) {
    errors.push(
      "Puzzle difficulties must be unique and must use 0, 1, 2, and 3."
    );
  }

  return errors;
}