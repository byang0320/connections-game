// For TypeScript
interface WordTileProps {
    word: string,
    selected: boolean,
    onClick: () => void, // Doesn't actually return anything
}

export default function WordTile({word, selected, onClick}: WordTileProps) {
    // CSS settings
    const buttonColor = `h-20 rounded-lg border font-semibold transition-colors ${selected ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-100 border-gray-300"}`;
    
    return (
        <button onClick={onClick} className={buttonColor}>{word}</button>
    );
}