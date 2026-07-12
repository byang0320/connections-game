// For TypeScript
interface GuessControlsProps {
    selectedCount: number,
    onShuffle: () => void,
    onSubmit: () => void,
    onClear: () => void,
    cannotPlay: boolean,
}

export default function GuessControls({selectedCount, onShuffle, onSubmit, onClear, cannotPlay}: GuessControlsProps) {
    const cannotClear = selectedCount === 0;
    const cannotSubmit = selectedCount !== 4 || cannotPlay;
    const buttonClasses = "rounded px-5 py-2 transition cursor-pointer disabled:cursor-default disabled:opacity-50";

    return (
        <div className="flex gap-4 justify-center">
            <button onClick={onShuffle} className={`${buttonClasses} border border-gray-300`}>Shuffle Tiles</button>

            <button onClick={onClear} disabled={cannotClear} className={`${buttonClasses} border border-gray-300`}>Deselect All</button>
            
            <button onClick={onSubmit} disabled={cannotSubmit} className={`${buttonClasses} bg-green-600 text-white`}>Submit Guess</button>
        </div>
    );
}