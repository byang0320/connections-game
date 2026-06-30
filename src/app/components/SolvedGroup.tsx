// To be able to use SolvedCategory object
import { SolvedCategory } from "./Board";

interface SolvedGroupProps {
  group: SolvedCategory,
}

export default function SolvedGroup({ group }: SolvedGroupProps) {
  return (
    <div className="rounded-lg bg-yellow-100 p-4">
      <h2 className="text-lg font-bold">{group.title}</h2>

      <div className="mt-2 flex flex-wrap gap-2">
        {group.words.map((word) => <span key={word.id} className="rounded bg-yellow-200 px-3 py-1 text-sm font-medium">{word.text}</span>)}
      </div>
    </div>
  );
}