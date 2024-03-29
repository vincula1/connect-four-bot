// GameBoard.js

import React, { useState, useEffect } from 'react';

const GameBoard = () => {
  const [showStartPopup, setShowStartPopup] = useState(true);
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('human');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

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

    return false;
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

    return false;
  }
  
  function checkDiagonalWin(board, player) {
    // Diagonal control - Positive slope
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
    // Diagonal control - Negative slope
    for (let col = 0; col < 4; col++) {
      for (let row = 3; row < 6; row++) {
        if (board[row][col] === player &&
            board[row - 1][col + 1] === player &&
            board[row - 2][col + 2] === player &&
            board[row - 3][col + 3] === player) {
          return true;
        }
      }
    }
  
    return false;
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
    if (currentPlayer !== 'human' || gameOver) return;
    const newBoard = dropToken(board, columnIndex, 'human');
    setBoard(newBoard);
    if (isTerminal(newBoard)) {
      const winner = isTerminal(newBoard);
      setGameOver(true);
      setWinner(winner);
    } else {
      checkForWinner(newBoard);
      setCurrentPlayer('ai');
    }
  };
  
  function checkForWinner(updatedBoard) {
    const winner = isTerminal(updatedBoard);
    if (winner) {
      setGameOver(true);
      setWinner(winner === 'tie' ? null : winner);
    }
  }
  
  
  const renderStartPopup = () => {
    if (showStartPopup) {
      return (
        <div className="popup">
          <h2>This is Laith's Connect 4 Bot</h2>
          <p>Click start to play and place your piece</p>
          <button onClick={() => setShowStartPopup(false)}>Start</button>
        </div>
      );
    }
  };
  

  const handleAIMove = () => {
    const worker = new Worker(`${process.env.PUBLIC_URL}/aiWorker.js`);
  
    worker.postMessage({ board: board, depth: 2 });
  
    worker.onmessage = function(e) {
      worker.terminate();
      if (e.data && e.data.error) {
      } else {
        const bestMove = e.data;
        if (bestMove !== null) {
          const newBoard = dropToken(board, bestMove, 'ai');
          const potentialWinner = isTerminal(newBoard);
          setBoard(newBoard);
          if (potentialWinner) {
            setGameOver(true);
            setWinner(potentialWinner);
          } else {
            setCurrentPlayer('human');
          }
        }
      }
    };
  };
  
   

  // Call this function to reset the game
  function resetGame() {
    setBoard(createEmptyBoard());
    setCurrentPlayer('human');
    setGameOver(false);
    setWinner(null);
  }

  useEffect(() => {
    const winner = isTerminal(board);
    if (winner) {
      setGameOver(true);
      setWinner(winner);
    } else if (currentPlayer === 'ai' && !gameOver) {
      handleAIMove();
    }
  }, [board, currentPlayer, gameOver]);
  
  

  const renderGameOverPopup = () => {
    console.log('renderGameOverPopup called', gameOver, winner);
    if (gameOver) {
      const message = winner === 'tie' ? "It's a tie!" : `${winner} wins!`;
      return (
        <div className="popup">
          <h2>{message}</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      );
    }
  };
  

  return (
    <div className="game-container">
      {showStartPopup && renderStartPopup()}
      {gameOver && <div className="backdrop" onClick={resetGame}></div>}
      {renderGameOverPopup()}
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
    </div>
  );
};

export default GameBoard;