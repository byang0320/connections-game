// For TypeScript
interface GuessControlsProps {
    selectedCount: number,
    onSubmit: () => void,
    onClear: () => void,
}

const submitButton = "rounded bg-green-600 px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50";
const clearButton = "rounded border border-gray-300 px-5 py-2 hover:bg-gray-100";

export default function GuessControls({selectedCount, onSubmit, onClear}: GuessControlsProps) {
    return (
        <div className="flex gap-4 justify-center">
            <button onClick={onSubmit} disabled={selectedCount !== 4} className={submitButton}>Submit Guess</button>

            <button onClick={onClear} className={clearButton}>Deselect All</button>
        </div>
    );
}