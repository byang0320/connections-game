// Temporary "database"

// For now, publishing a new puzzle means...
// Create src/lib/puzzles/puzzle2.ts
// Export it
// Add it to the puzzles array

import { p1 } from "./puzzle1";
import { samplePuzzle } from "./samplePuzzle";

export const puzzles = [p1, samplePuzzle];