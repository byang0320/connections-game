// For TypeScript
interface GuessControlsProps {
    selectedCount: number,
    onShuffle: () => void,
    onSubmit: () => void,
    onClear: () => void,
    cannotPlay: boolean,
}

const shuffleButton = "rounded border border-gray-300 px-5 py-2 cursor-pointer";
const submitButton = "rounded bg-green-600 px-5 py-2 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
const clearButton = "rounded border border-gray-300 px-5 py-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

export default function GuessControls({selectedCount, onShuffle, onSubmit, onClear, cannotPlay}: GuessControlsProps) {
    return (
        <div className="flex gap-4 justify-center">
            <button onClick={onShuffle} className={shuffleButton}>Shuffle Tiles</button>

            <button onClick={onClear} disabled={selectedCount === 0} className={clearButton}>Deselect All</button>

            <button onClick={onSubmit} disabled={selectedCount !== 4 || cannotPlay} className={submitButton}>Submit Guess</button>
        </div>
    );
}