interface PuzzleHeaderProps {
    title: string,
    subtitle?: string,
}

export default function PuzzleHeader({title, subtitle}: PuzzleHeaderProps) {
    return (
        <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{title}</h1>

            {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </header>
    );
}