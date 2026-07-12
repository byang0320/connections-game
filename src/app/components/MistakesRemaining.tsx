interface MistakesRemainingProps {
    mistakes: number,
    numeric: boolean,
}

// Dots or numeric
export default function MistakesRemaining({ mistakes, numeric }: MistakesRemainingProps) {
    if (numeric) {
        return <p className="text-center text-xl">Mistakes Remaining: {mistakes}</p>;
    }
    return (
        <div className="flex items-center justify-center gap-4 text-xl">
            <span>Mistakes Remaining:</span>
            <div className="flex gap-3">
                {Array.from({ length: mistakes }, (_, i) => (
                    <div key={i} className="h-5 w-5 rounded-full bg-gray-600" />
                ))}
            </div>
        </div>
        
    );
}