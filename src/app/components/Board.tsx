"use client";
import {useState} from "react";
import WordTile from "./WordTile";
import GuessControls from "./GuessControls";
import SolvedGroup from "./SolvedGroup";

// TODO: update this with Chat's instructions

// Every word has an ID and its actual text
export interface Word {
    id: string,
    text: string,
}

// A solved category has an ID, the category name, and the words in it
// export so we're able to access it in SolvedGroup.tsx
export interface SolvedCategory {
    id: string,
    title: string,
    words: Word[],
}

interface PuzzleGroup {
    category: string,
    difficulty: number,
    words: string[],
}

interface Puzzle {
    id: string,
    title: string,
    groups: PuzzleGroup[],
}

interface BoardProps {
    puzzle: Puzzle,
}

// // For TypeScript (outdated)
// interface BoardProps {
//     words: Word[],

//     // solvedGroups is optional! Array of solved categories
//     solvedGroups?: SolvedCategory[],

//     // Optional function that takes an array of selected tiles and computes to see if the category is correct
//     onSubmitGuess?: (selectedIDs: string[]) => void,
// }

export default function Board({puzzle}: BoardProps) {
    const [selectedIDs, setSelectedIDs] = useState<string[]>([]);
    const [solvedGroups, setSolvedGroups] = useState<SolvedCategory[]>([]);
    const [message, setMessage] = useState("");

    // Give every word a stable ID based on its group and position within group
    const allGroups: SolvedCategory[] = puzzle.groups.map((group, groupIndex) => ({
        id: `group-${groupIndex}`,
        title: group.category,
        words: group.words.map((text, wordIndex) => ({
            id: `${groupIndex}-${wordIndex}`,
            text: text,
        })),
    }));

    // Create a set of the solved groups (we don't care about order)
    const solvedGroupIDs = new Set(solvedGroups.map((group) => group.id));

    // We are flattening the unsolved words into a static array
    const unsolvedWords = allGroups.filter((group) => !solvedGroupIDs.has(group.id)).flatMap((group) => group.words);

    // toggleSelection toggles a particular tile if not already four tiles have been toggled
    const toggleSelection = (id: string) => {
        setSelectedIDs((current) => {
            if (current.includes(id)) {
                // Return the array with all elements intact except for id (effectively untoggles it)
                return current.filter((wordID) => wordID != id);
            }

            // Cannot select a tile if >= 4 are already selected
            if (current.length >= 4) {
                return current;
            }

            // Otherwise, if not already selected and less than four,
            // return the same array but with id added on
            return [...current, id];
        });
    };

    function clearSelection() {
        setSelectedIDs([]);
        setMessage("");
    }

    // submitGuess contains all the logic to actually calculating if a submission is a correct category
    // It moves words from unsolvedWords to the solvedGroupIDs set
    const submitGuess = () => {
        if (selectedIDs.length !== 4) {
            return;
        }

        // Finds the group among all solution groups to see if any exactly matches
        // Returns null if no matching group is found (i.e. the player is incorrect)
        const matchingGroup = allGroups.find((group) => {
            // If we're iterating through an already solved group, just continue
            if (solvedGroupIDs.has(group.id)) {
                return false;
            }

            const groupWordIDs = group.words.map((word) => word.id);

            // Checks that the input (selectedIDs) not only is the same length as one of the solution categories,
            // but also that every word in said category is in their response too
            return (groupWordIDs.length === selectedIDs.length && groupWordIDs.every((id) => selectedIDs.includes(id)));
        });

        if (matchingGroup) {
            setSolvedGroups((current) => [...current, matchingGroup]);
            setSelectedIDs([]);
            setMessage(`Correct: ${matchingGroup.title}`);
        } else {
            setMessage("Not quite. Try another group.");
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
            
            {/* Display a message if there is a non-null one */}
            {message && <p className="text-center font-medium text-gray-700">{message}</p>}            

            {/* Guess Controls at the bottom of the board if there are still unsolved categories */}
            {unsolvedWords.length > 0 && <GuessControls selectedCount={selectedIDs.length} onSubmit={submitGuess} onClear={clearSelection}/>}

            {/* Otherwise, display "You solved the board!" */}
            {unsolvedWords.length === 0 && <p className="text-center text-xl font-bold">You solved the board!</p>}
        </div>
    );
}