"use client";
import { useState } from "react";
import WordTile from "./WordTile";
import GuessControls from "./GuessControls";
import SolvedGroup from "./SolvedGroup";

import type { Puzzle, Tile } from "../../lib/game/types";
import { checkGuess } from "../../lib/game/puzzleEngine";

interface BoardProps {
    puzzle: Puzzle,
    initialTileOrder: Tile[], // Received from page.tsx
}

export default function Board({puzzle, initialTileOrder}: BoardProps) {
    const [selectedIDs, setSelectedIDs] = useState<string[]>([]);
    const [solvedGroupIDs, setSolvedGroupIDs] = useState<string[]>([]);
    const [tileOrder] = useState(initialTileOrder); // Initial random shuffle of tiles

    // Determine which categories have already been solved in the order that they solved
    const solvedGroups = solvedGroupIDs.map((groupID) => puzzle.groups.find((group) => group.id === groupID)).filter((group): group is Puzzle["groups"][number] => group !== undefined);

    // Calculate what tiles still remain unsolved
    const solvedGroupsSet = new Set(solvedGroupIDs);
    const unsolvedWords = tileOrder.filter((tile) => !solvedGroupsSet.has(tile.groupId));

    // toggleSelection toggles a particular tile if not already four tiles have been toggled
    const toggleSelection = (id: string) => {
        setSelectedIDs((current) => {
            if (current.includes(id)) {
                // Return the array with all elements intact except for id (effectively untoggles it)
                return current.filter((wordID) => wordID !== id);
            }

            // Cannot select a tile if >= 4 are already selected
            if (current.length >= 4) {
                return current;
            }

            // Otherwise, if not already selected and less than four, return the same array but with id added on
            return [...current, id];
        });
    };

    function clearSelection() {
        setSelectedIDs([]);
    }

    // submitGuess contains all the logic to actually calculating if a submission is a correct category
    // It moves words from unsolvedWords to the solvedGroupIDs set
    const submitGuess = () => {
        const result = checkGuess(selectedIDs, puzzle, solvedGroupIDs);
        if (result.status === "correct") {
            setSolvedGroupIDs((current) => [...current, result.group.id]);
            setSelectedIDs([]);
        } else if (result.status === "one-away") {
            // If one away or incorrect, push an alert message
            alert("One away...");
        } else {
            alert("Not quite. Try another group.");
        }
    };

    return (
        <div className="space-y-6">
            {/* First cover the solved groups */}
            {solvedGroups.map((group) => <SolvedGroup key={group.id} group={group} />)}

            {/* Then cover the remaining unsolved tiles, if any remain */}
            {unsolvedWords.length > 0 && 
                <div className="grid grid-cols-4 gap-3">
                    {unsolvedWords.map((word) => <WordTile key={word.id} word={word.text} selected={selectedIDs.includes(word.id)} onClick={() => toggleSelection(word.id)}/>)}
                </div>
            }
            
            {/* Guess Controls at the bottom of the board if there are still unsolved categories */}
            {unsolvedWords.length > 0 && <GuessControls selectedCount={selectedIDs.length} onSubmit={submitGuess} onClear={clearSelection}/>}

            {/* Otherwise, display "You solved the board!" */}
            {unsolvedWords.length === 0 && <p className="text-center text-xl font-bold">You solved the board!</p>}
        </div>
    );
}