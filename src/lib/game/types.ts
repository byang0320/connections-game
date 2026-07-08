export type PuzzleGroup = {
  id: string;
  category: string;
  difficulty: number;
  words: string[];
};

export type Puzzle = {
  id: string;
  title: string;
  puzzleNumber: number;
  publishedAt: string; // for example, 2026-07-04
  description?: string;
  groups: PuzzleGroup[];
};

export type GuessResult =
  | {
      status: "correct";
      group: PuzzleGroup;
    }
  | {
      status: "one-away";
    }
  | {
      status: "incorrect";
    };

// A tile is the version of a word that the React board displays.
export type Tile = {
  id: string;
  text: string;
  groupId: string;
};