import React from 'react';
import './App.css';
import GameBoard from './GameBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Connect Four Game</h1>
      </header>
      <div className="Game-area">
        <GameBoard />
      </div>
    </div>
  );
}

export default App;
