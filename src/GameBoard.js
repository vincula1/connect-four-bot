import React, { useState, useEffect } from 'react';


const GameBoard = () => {
    const [board, setBoard] = useState(createEmptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState('human');

    // Create a board 7x6 grid
    function createEmptyBoard() {
        return Array(6).fill(null).map(() => Array(7).fill(null));
    }

    const handleColumnClick = (columnIndex) => {
        // This function is to find the lowest empty cell on click
        if (currentPlayer !== 'human') return;
        const newBoard = [...board];
        for (let row = board.length - 1; row >= 0; row--) {
            if (!newBoard[row][columnIndex]) {
                newBoard[row][columnIndex] = currentPlayer;
                break;
            }
        }
    
        setBoard(newBoard);
        // Switch turns to the other player
    };

    const handleAIMove = () => {
        // This will contain the minimax algoritm and switch players to human once played.
    };

    useEffect(() => {
        if (currentPlayer === 'ai') {
            handleAIMove();
        }
    }, [currentPlayer]);

    
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, columnIndex) => (
                        <div key={columnIndex} className="cell" onClick={() => handleColumnClick(columnIndex)}>
                            {/* Display player token */}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GameBoard;
