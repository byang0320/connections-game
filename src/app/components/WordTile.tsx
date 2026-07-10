// For TypeScript
interface WordTileProps {
    word: string,
    selected: boolean,
    onClick: () => void,
    selectedCount: number,
}

export default function WordTile({word, selected, onClick, selectedCount}: WordTileProps) {
    // CSS settings
    const buttonColor = `h-20 rounded-lg border font-semibold transition-colors ${(selectedCount === 4 && !selected) ? "" : "cursor-pointer"} ${selected ? "bg-gray-600 text-white border-gray-600" : "bg-white border-gray-300"}`;
    
    return (
        <button onClick={onClick} className={buttonColor}>{word}</button>
    );
}