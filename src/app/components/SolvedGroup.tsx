import type { PuzzleGroup } from "../../lib/game/types";

interface SolvedGroupProps {
  group: PuzzleGroup;
}

const colors = {
  0: {
    bg: "bg-yellow-100",
    chip: "bg-yellow-200",
  },
  1: {
    bg: "bg-green-100",
    chip: "bg-green-200",
  },
  2: {
    bg: "bg-blue-100",
    chip: "bg-blue-200",
  },
  3: {
    bg: "bg-purple-100",
    chip: "bg-purple-200",
  },
};

export default function SolvedGroup({ group }: SolvedGroupProps) {
  const color = colors[group.difficulty as keyof typeof colors];
  return (
    <div className={`rounded-lg ${color.bg} p-4`}>
      <h2 className="text-lg font-bold text-center">{group.category}</h2>

      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        {group.words.map((word) => <span key={word} className={`rounded ${color.chip} px-3 py-1 text-sm font-medium`}>{word}</span>)}
      </div>
    </div>
  );
}