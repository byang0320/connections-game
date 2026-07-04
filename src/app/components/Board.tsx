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
    const [selectedIDs, setSelectedIDs] = useState<string[]>([]); // Array of selected tiles
    const [solvedGroupIDs, setSolvedGroupIDs] = useState<string[]>([]); // Array of solved groups
    const [mistakesRemaining, setMistakesRemaining] = useState(4); // Mistakes remaining
    const [cannotPlay, setCannotPlay] = useState(false); // For greying out the Submit button immediately after a wrong move
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
        setCannotPlay(false);
    };

    function clearSelection() {
        setSelectedIDs([]);
    }

    function handleMistake() {
        setMistakesRemaining((currentMistakes) => {
            const nextMistakes = currentMistakes - 1;

            if (nextMistakes <= 0) {
                setSolvedGroupIDs((currentSolvedIDs) => {
                    // Determine which categories have yet to be solved
                    const remainingGroupIDs = puzzle.groups.map((group) => group.id).filter((groupID) => !currentSolvedIDs.includes(groupID));
                    // Then append it onto what the user has already solved
                    return [...currentSolvedIDs, ...remainingGroupIDs];
                });

                setSelectedIDs([]);
                return 0;
            }

            return nextMistakes;
        });
        setCannotPlay(true);
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
            handleMistake();
        } else {
            mistakesRemaining > 1 ? alert("Not quite. Try another group.") : alert("Not quite!");
            handleMistake();
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

            {/* Mistakes remaining text */}
            <p className="text-center text-xl">Mistakes Remaining: {mistakesRemaining}</p>
            
            {/* Guess Controls if there are still unsolved categories and mistakes remaining */}
            {(unsolvedWords.length > 0 && mistakesRemaining > 0) && <GuessControls selectedCount={selectedIDs.length} onSubmit={submitGuess} onClear={clearSelection} cannotPlay={cannotPlay}/>}

            {/* If the game ended, show ending text */}
            {unsolvedWords.length === 0 && 
                (mistakesRemaining > 0 ? 
                <p className="text-center text-xl font-bold">You solved the board!</p> : 
                <p className="text-center text-xl font-bold">Better luck next time!</p>)
            }
        </div>
    );
}