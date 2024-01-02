import React, { useState, useEffect } from 'react';

const GameBoard = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('human');

  function createEmptyBoard() {
    return Array(6).fill(null).map(() => Array(7).fill(null));
  }

  function checkHorizontalWin(board, player) {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === player &&
            board[row][col + 1] === player &&
            board[row][col + 2] === player &&
            board[row][col + 3] === player) {
          return true;
        }
      }
    }
  }
  
  function checkVerticalWin(board, player) {
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 3; row++) {
        if (board[row][col] === player &&
            board[row + 1][col] === player &&
            board[row + 2][col] === player &&
            board[row + 3][col] === player) {
          return true;
        }
      }
    }
  }
  
  function checkDiagonalWin(board, player) {
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (board[row][col] === player &&
            board[row + 1][col + 1] === player &&
            board[row + 2][col + 2] === player &&
            board[row + 3][col + 3] === player) {
          return true;
        }
      }
    }
  }
  
  function checkWin(board, player) {
    return checkHorizontalWin(board, player) ||
           checkVerticalWin(board, player) ||
           checkDiagonalWin(board, player);
  }
  

  function isTerminal(board) {
    if (checkWin(board, 'human')) {
      return 'human';
    } else if (checkWin(board, 'ai')) {
      return 'ai';
    } else if (board.every(row => row.every(cell => cell !== null))) {
      return 'tie';
    }
    return null;
  }
  
  
  function minimax(board, depth, alpha, beta, isMaximizing) {
    const terminalVal = isTerminal(board);
    if (depth === 0 || terminalVal !== null) {
      if (terminalVal === 'ai') return 1000;
      if (terminalVal === 'human') return -1000;
      if (terminalVal === 'tie') return 0;
    }
  
    if (isMaximizing) {
      let maxEval = -Infinity;
      getValidColumns(board).forEach(column => {
        let newBoard = dropToken(board, column, 'ai');
        let score = minimax(newBoard, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) {
          return; // Beta cut-off
        }
      });
      return maxEval;
    } else {
      let minEval = Infinity;
      getValidColumns(board).forEach(column => {
        let newBoard = dropToken(board, column, 'human');
        let score = minimax(newBoard, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) {
          return; // Alpha cut-off
        }
      });
      return minEval;
    }
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


  const handleColumnClick = (columnIndex) => {
    if (currentPlayer !== 'human') return;
    const newBoard = dropToken(board, columnIndex, 'human');
    setBoard(newBoard);
    setCurrentPlayer('ai');
  };

  const handleAIMove = () => {
    setTimeout(() => {
      let bestScore = -Infinity;
      let bestMove = null;
      const depth = 1
      getValidColumns(board).forEach(column => {
        let newBoard = dropToken(board, column, 'ai');
        let score = minimax(newBoard, depth, -Infinity, Infinity, false); // Reduced depth for testing
        if (score > bestScore) {
          bestScore = score;
          bestMove = column;
        }
      });
  
      if (bestMove !== null) {
        let newBoard = dropToken(board, bestMove, 'ai');
        setBoard(newBoard);
        setCurrentPlayer('human');
      }
    }, 0);
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
