import type {
  GuessResult,
  Puzzle,
  PuzzleGroup,
  Tile,
} from "./types";

// Creates the stable ID used by both the UI and game engine.
export function makeWordId(groupId: string, wordIndex: number): string {
  return `${groupId}-word-${wordIndex}`;
}

// Converts a puzzle into the 16 clickable tiles on the board.
export function getAllTiles(puzzle: Puzzle): Tile[] {
  return puzzle.groups.flatMap((group) =>
    group.words.map((word, wordIndex) => ({
      id: makeWordId(group.id, wordIndex),
      text: word,
      groupId: group.id,
    }))
  );
}

// Returns only tiles belonging to groups that have not been solved yet.
export function getActiveTiles(
  puzzle: Puzzle,
  solvedGroupIds: string[]
): Tile[] {
  const solvedGroups = new Set(solvedGroupIds);

  return getAllTiles(puzzle).filter(
    (tile) => !solvedGroups.has(tile.groupId)
  );
}

export function countWordsMatchingGroup(
  selectedWordIds: string[],
  group: PuzzleGroup
): number {
  const selectedIDs = new Set(selectedWordIds);

  return group.words.reduce((count, _word, wordIndex) => {
    const wordID = makeWordId(group.id, wordIndex);

    return selectedIDs.has(wordID) ? count + 1 : count;
  }, 0);
}

export function isSolvedGroup(
  selectedWordIds: string[],
  group: PuzzleGroup
): boolean {
  const uniqueSelectedIDs = new Set(selectedWordIds);

  return (
    selectedWordIds.length === 4 &&
    uniqueSelectedIDs.size === 4 &&
    countWordsMatchingGroup(selectedWordIds, group) === 4
  );
}

export function checkGuess(
  selectedWordIds: string[],
  puzzle: Puzzle,
  solvedGroupIds: string[] = []
): GuessResult {
  const uniqueSelectedIDs = new Set(selectedWordIds);

  // A guess must contain four different tiles
  if (selectedWordIds.length !== 4 || uniqueSelectedIDs.size !== 4) {
    return { status: "incorrect" };
  }

  const solvedGroups = new Set(solvedGroupIds);

  const unsolvedGroups = puzzle.groups.filter(
    (group) => !solvedGroups.has(group.id)
  );

  const correctGroup = unsolvedGroups.find((group) =>
    isSolvedGroup(selectedWordIds, group)
  );

  if (correctGroup) {
    return {
      status: "correct",
      group: correctGroup,
    };
  }

  const isOneAway = unsolvedGroups.some(
    (group) => countWordsMatchingGroup(selectedWordIds, group) === 3
  );

  if (isOneAway) {
    return { status: "one-away" };
  }

  return { status: "incorrect" };
}

// Returns a new shuffled array without changing the original array
// Useful for scrabling the board at the very beginning
export function shuffleTiles<T>(words: T[]): T[] {
  const shuffledWords = [...words];

  for (let index = shuffledWords.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffledWords[index], shuffledWords[randomIndex]] = [
      shuffledWords[randomIndex],
      shuffledWords[index],
    ];
  }

  return shuffledWords;
}