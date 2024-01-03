self.onmessage = function(e) {
  try {
    console.log("AI Worker: Message received", e.data);
    const { board, depth } = e.data;
    let bestScore = -Infinity;
    let bestMove = null;
  
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
      
      
      function evaluateBoardForAI(board) {
        let score = 0;
    
        // Center column control
        const centerColumnIndex = 3;
        const centerColumn = board.map(row => row[centerColumnIndex]);
        score += centerColumn.filter(cell => cell === 'ai').length * 3;
    
        // Horizontal control
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < 4; col++) {
                const window = board[row].slice(col, col + 4);
                score += evaluateWindow(window, 'ai');
            }
        }
    
        // Vertical control
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row < 3; row++) {
                const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
                score += evaluateWindow(window, 'ai');
            }
        }
    
        // Diagonal control - Positive slope
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                const window = [
                    board[row][col],
                    board[row + 1][col + 1],
                    board[row + 2][col + 2],
                    board[row + 3][col + 3]
                ];
                score += evaluateWindow(window, 'ai');
            }
        }
    
        // Diagonal control - Negative slope
        for (let row = 3; row < 6; row++) {
            for (let col = 0; col < 4; col++) {
                const window = [
                    board[row][col],
                    board[row - 1][col + 1],
                    board[row - 2][col + 2],
                    board[row - 3][col + 3]
                ];
                score += evaluateWindow(window, 'ai');
            }
        }
    
        return score;
    }
    
    function evaluateWindow(window, player) {
      let score = 0;
      const aiCount = window.filter(cell => cell === 'ai').length;
      const humanCount = window.filter(cell => cell === 'human').length;
      const emptyCount = window.filter(cell => cell === null).length;
  
      // Scoring for immediate win
      if (aiCount === 3 && emptyCount === 1) score += 10000; // Increase the score if 1000 isn't enough
      // Scoring for immediate block
      if (humanCount === 3 && emptyCount === 1) score -= 9000; // Slightly less than win score to prioritize winning over blocking

      // Scoring for 3 in a row with an empty space
      if (aiCount === 3 && emptyCount === 1) score += 50;
      if (humanCount === 3 && emptyCount === 1) score -= 50;

      // Secondary opportunities
      if (aiCount === 2 && emptyCount === 2) score += 10;
      if (humanCount === 2 && emptyCount === 2) score -= 10;
  
      return score;
  }
  
  
  
    
    function minimax(board, depth, alpha, beta, isMaximizing) {
        console.log(`Minimax called with depth: ${depth} and isMaximizing: ${isMaximizing}`);
        const terminalVal = isTerminal(board);
        if (depth === 0 || terminalVal !== null) {
            console.log(`Terminal condition reached with terminal value: ${terminalVal}`);
            if (terminalVal === 'ai') return 1000;
            if (terminalVal === 'human') return -1000;
            if (terminalVal === 'tie') return 0;
        }
    
        if (isMaximizing) {
            let maxEval = -Infinity;
            const validColumns = getValidColumns(board);
            for (const column of validColumns) {
                console.log(`Maximizing, evaluating column: ${column}`);
                let newBoard = dropToken(board, column, 'ai');
                let score = depth === 1 ? evaluateBoardForAI(newBoard) : minimax(newBoard, depth - 1, alpha, beta, false);
                console.log(`Column ${column} score: ${score}`);
                maxEval = Math.max(maxEval, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    console.log(`Beta cut-off at column ${column} with beta: ${beta}, alpha: ${alpha}`);
                    break;
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            const validColumns = getValidColumns(board);
            for (const column of validColumns) {
                console.log(`Minimizing, evaluating column: ${column}`);
                let newBoard = dropToken(board, column, 'human');
                let score = depth === 1 ? -evaluateBoardForAI(newBoard) : minimax(newBoard, depth - 1, alpha, beta, true);
                console.log(`Column ${column} score: ${score}`);
                minEval = Math.min(minEval, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    console.log(`Alpha cut-off at column ${column} with beta: ${beta}, alpha: ${alpha}`);
                    break;
                }
            }
            return minEval;
        }  
    }
    
      
    // Assume getValidColumns and dropToken functions are defined
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
            if (newBoard[row][column] === null) {
                newBoard[row][column] = player;
                break;
            }
        }
        return newBoard;
    }

    // Iterate over each valid column
    const validColumns = getValidColumns(board);
    for (const column of validColumns) {
        let newBoard = dropToken(board, column, 'ai');
        let score = minimax(newBoard, depth, -Infinity, Infinity, false);

        if (score > bestScore) {
            bestScore = score;
            bestMove = column;
        }
    }
  
    // Post the result back to the main thread
    console.log("AI Worker: Best move calculated", bestMove);
    self.postMessage(bestMove);
      } catch (error) {
        console.error("AI Worker: Error occurred", error);
        self.postMessage({ error: "An error occurred in the AI worker." });
    }
  };