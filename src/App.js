import React from 'react';
import './App.css';
import GameBoard from './GameBoard'; // Import your GameBoard component

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Connect Four Game</h1>
      </header>
      <div className="game-container">
        <GameBoard />
      </div>
    </div>
  );
}

export default App;

