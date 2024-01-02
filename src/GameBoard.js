import React, { useState, useEffect } from 'react';

const GameBoard = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('human');

  function createEmptyBoard() {
    return Array(6).fill(null).map(() => Array(7).fill(null));
  }

  function getValidColumns(board) {
    const validColumns = [];
    for (let col = 0; col < 7; col++) {
      if (board[0][col] === null) {
        validColumns.push(col);
      }
    }
    return validColumns;
  }

  function dropToken(board, column, player) {
    const newBoard = board.map(row => [...row]);
    for (let row = newBoard.length - 1; row >= 0; row--) {
      if (!newBoard[row][column]) {
        newBoard[row][column] = player;
        break;
      }
    }
    return newBoard;
  }

  function isTerminal(board) {
    const isBoardFull = board.every(row => row.every(cell => cell !== null));
    if (isBoardFull) {
      return 'tie';
    }
    // Placeholder for checking win condition
    return null;
  }

  const handleColumnClick = (columnIndex) => {
    if (currentPlayer !== 'human') return;
    const newBoard = dropToken(board, columnIndex, 'human');
    setBoard(newBoard);
    setCurrentPlayer('ai');
  };

  const handleAIMove = () => {
    const validColumns = getValidColumns(board);
    const randomColumn = validColumns[Math.floor(Math.random() * validColumns.length)];
    const newBoard = dropToken(board, randomColumn, 'ai');
    setBoard(newBoard);
    setCurrentPlayer('human');
  };

  useEffect(() => {
    if (currentPlayer === 'ai') {
      handleAIMove();
    }
  }, [currentPlayer, board]);

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        row.map((cell, columnIndex) => (
          <div key={`${rowIndex}-${columnIndex}`} className="cell" onClick={() => handleColumnClick(columnIndex)}>
            {cell === 'human' && <div className="token human-token"></div>}
            {cell === 'ai' && <div className="token ai-token"></div>}
          </div>
        ))
      ))}
    </div>
  );
};

export default GameBoard;
