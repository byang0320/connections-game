"use client";
import { useState, useEffect, useRef } from "react";
import WordTile from "./WordTile";
import GuessControls from "./GuessControls";
import SolvedGroup from "./SolvedGroup";

import type { Puzzle, Tile } from "../../lib/game/types";
import { checkGuess } from "../../lib/game/puzzleEngine";

const MISTAKES_ALLOWED = 4;
const ERROR_DURATION_SECONDS = 5;

interface BoardProps {
    puzzle: Puzzle,
    initialTileOrder: Tile[], // Received from page.tsx
}

export default function Board({puzzle, initialTileOrder}: BoardProps) {
    const [selectedIDs, setSelectedIDs] = useState<string[]>([]); // Array of selected tiles
    const [solvedGroupIDs, setSolvedGroupIDs] = useState<string[]>([]); // Array of solved groups
    const [mistakesRemaining, setMistakesRemaining] = useState(MISTAKES_ALLOWED); // Mistakes remaining
    const [cannotPlay, setCannotPlay] = useState(false); // For greying out the Submit button immediately after a wrong move
    const [incorrectMessage, setIncorrectMessage] = useState(""); // For showing incorrect selection messages
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
            setCannotPlay(false);
            return [...current, id];
        });
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

    // Use ref hook to show incorrect guess error messages for 5 seconds
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    function showError(message: string) {
        setIncorrectMessage(message);

        // Get rid of any existing timeouts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Show error message for 5 seconds before clearing everything
        timeoutRef.current = setTimeout(() => {
            setIncorrectMessage("");
            timeoutRef.current = null;
        }, ERROR_DURATION_SECONDS * 1000);
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // submitGuess determines if a submitted guess is a valid category
    // It moves words from unsolvedWords to the solvedGroupIDs set
    const submitGuess = () => {
        const result = checkGuess(selectedIDs, puzzle, solvedGroupIDs);
        if (result.status === "correct") {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            setIncorrectMessage("");
            setSolvedGroupIDs((current) => [...current, result.group.id]);
            setSelectedIDs([]);
        } else if (result.status === "one-away") {
            // Show a temporary notification for an incorrect guess
            showError("One away...");
            handleMistake();
        } else {
            showError("Not quite. Try another group.");
            handleMistake();
        }
    };

    return (
        <div className="space-y-6">
            {/* First cover the solved groups */}
            {solvedGroups.map((group) => <SolvedGroup key={group.id} group={group} />)}

            {/* Then cover the remaining unsolved tiles, if any remain */}
            {unsolvedWords.length > 0 && 
                <div className="relative">
                    {/* Incorrect guess notification on top of unsolved portion of grid */}
                    {incorrectMessage && (
                        <div role="alert" className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white shadow-lg">{incorrectMessage}</div>
                    )}
                    {/* Unsolved tiles */}
                    <div className="grid grid-cols-4 gap-3">
                        {unsolvedWords.map((word) => <WordTile key={word.id} word={word.text} selected={selectedIDs.includes(word.id)} onClick={() => toggleSelection(word.id)}/>)}
                    </div>
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