"use client";
import { useState, useEffect, useRef } from "react";
import WordTile from "./WordTile";
import GuessControls from "./GuessControls";
import SolvedGroup from "./SolvedGroup";
import MistakesRemaining from "./MistakesRemaining";

import type { Puzzle, Tile } from "../../lib/game/types";
import { checkGuess, getAllTiles, shuffleTiles } from "../../lib/game/puzzleEngine";

// Eventually... add an option to configure these on a settings page
const MISTAKES_ALLOWED = 4;
const IS_NUMERIC = false;
const ERROR_DURATION_SECONDS = 5;

interface BoardProps {
    puzzle: Puzzle,
}

// For localStorage state persistence
type SavedBoardState = {
    selectedIDs: string[];
    solvedGroupIDs: string[];
    mistakesRemaining: number;
    cannotPlay: boolean;
    tileOrder: Tile[];
};

export default function Board({ puzzle }: BoardProps) {
    // Array of selected tiles
    const [selectedIDs, setSelectedIDs] = useState<string[]>([]);

    // Array of solved groups
    const [solvedGroupIDs, setSolvedGroupIDs] = useState<string[]>([]);

    // Mistakes remaining
    const [mistakesRemaining, setMistakesRemaining] = useState(MISTAKES_ALLOWED);

    // For greying out the Submit button immediately after a wrong move
    const [cannotPlay, setCannotPlay] = useState(false);

    // For showing incorrect selection messages
    const [incorrectMessage, setIncorrectMessage] = useState("");

    // Current order of all tiles
    const [tileOrder, setTileOrder] = useState<Tile[]>([]);


    // Whether we have finished checking localStorage
    const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

    // Unique localStorage entry for every puzzle
    const storageKey = `connections-progress:${puzzle.id}`;

    // Load data from localStorage
    useEffect(() => {
        const unshuffledTileOrder = getAllTiles(puzzle);
        const savedJSON = localStorage.getItem(storageKey);
        if (savedJSON) {
            try {
                const savedState = JSON.parse(savedJSON) as SavedBoardState;
                const savedStateLooksValid = Array.isArray(savedState.selectedIDs) && Array.isArray(savedState.solvedGroupIDs) && Array.isArray(savedState.tileOrder) && savedState.tileOrder.length === unshuffledTileOrder.length;
                if (savedStateLooksValid) {
                    setSelectedIDs(savedState.selectedIDs);
                    setSolvedGroupIDs(savedState.solvedGroupIDs);
                    setMistakesRemaining(savedState.mistakesRemaining);
                    setCannotPlay(savedState.cannotPlay);
                    setTileOrder(savedState.tileOrder);

                    setHasLoadedProgress(true);
                    return;
                }
            } catch {
                // Saved JSON is corrupted, so throw it away
                localStorage.removeItem(storageKey);
            }
        }
        
        // No valid saved game exists, so create one with random initial order
        setTileOrder(shuffleTiles(unshuffledTileOrder));
        setHasLoadedProgress(true);
    }, [storageKey, puzzle]);
    
    // Run whenever any of the dependent states changes
    useEffect(() => {
        if (!hasLoadedProgress) {
            return;
        }
        const stateToSave: SavedBoardState = {selectedIDs, solvedGroupIDs, mistakesRemaining, cannotPlay, tileOrder};
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }, [hasLoadedProgress, storageKey, selectedIDs, solvedGroupIDs, mistakesRemaining, cannotPlay, tileOrder]);

    // Resets all state information (equivalent to a memory clear)
    function handleRestart() {
        localStorage.removeItem(storageKey);

        setSelectedIDs([]);
        setSolvedGroupIDs([]);
        setMistakesRemaining(MISTAKES_ALLOWED);
        setCannotPlay(false);
        setIncorrectMessage("");

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        // New randomized board
        setTileOrder(shuffleTiles(getAllTiles(puzzle)));
    }



    // Determine which categories have already been solved in the order that they solved
    const solvedGroups = solvedGroupIDs.map((groupID) => puzzle.groups.find((group) => group.id === groupID)).filter((group): group is Puzzle["groups"][number] => group !== undefined);

    // Calculate what tiles still remain unsolved
    const solvedGroupsSet = new Set(solvedGroupIDs);
    const unsolvedWords = tileOrder.filter((tile) => !solvedGroupsSet.has(tile.groupId));

    // toggleSelection toggles a particular tile if not already four tiles have been toggled
    function toggleSelection(id: string) {
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

    // Shuffle unsolved tiles
    function handleShuffle() {
        setTileOrder((current) => shuffleTiles(current));
    }

    // Clear selected tiles when "Deselect All" is clicked
    function clearSelection() {
        setSelectedIDs([]);
    }

    function handleMistake() {
        setMistakesRemaining((currentMistakes) => {
            const nextMistakes = currentMistakes - 1;

            // Fail, so reveal all remaining categories
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

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // submitGuess determines if a submitted guess is a valid category
    // It moves words from unsolvedWords to the solvedGroupIDs set
    function submitGuess() {
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

    // Temporary loading text while the puzzle loads
    if (!hasLoadedProgress) {
        return (
            <div className="py-10 text-center text-gray-500">Loading puzzle...</div>
        )
    }

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
                        {unsolvedWords.map((word) => <WordTile key={word.id} word={word.text} selected={selectedIDs.includes(word.id)} onClick={() => toggleSelection(word.id)} selectedCount={selectedIDs.length}/>)}
                    </div>
                </div>
            }

            {/* Mistakes remaining text */}
            <MistakesRemaining mistakes={mistakesRemaining} numeric={IS_NUMERIC} />
            
            {/* Guess Controls if there are still unsolved categories and mistakes remaining */}
            {(unsolvedWords.length > 0 && mistakesRemaining > 0) && <GuessControls selectedCount={selectedIDs.length} onShuffle={handleShuffle} onSubmit={submitGuess} onClear={clearSelection} cannotPlay={cannotPlay}/>}

            {/* If the game ended, show ending text and a button to restart (can be changed later) */}
            {unsolvedWords.length === 0 && 
                <div className="space-y-4 text-center">
                    <p className="text-xl font-bold">
                        {mistakesRemaining > 0 ? "You solved the board!" : "Better luck next time!"}
                    </p>

                    <button onClick={handleRestart} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">Restart Puzzle</button>
                </div>
            }
        </div>
    );
}