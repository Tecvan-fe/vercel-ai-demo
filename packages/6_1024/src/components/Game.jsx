import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';

const Game = () => {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [targetTile, setTargetTile] = useState(1024);

  // 初始化游戏
  const initGame = useCallback(() => {
    const newBoard = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    // 添加两个初始方块
    addRandomTile(addRandomTile(newBoard));
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  }, []);

  // 从本地存储加载最高分
  useEffect(() => {
    const savedBestScore = localStorage.getItem('bestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
  }, []);

  // 初始化游戏
  useEffect(() => {
    initGame();
  }, [initGame]);

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || gameWon) return;

      switch (e.key) {
        case 'ArrowUp':
          moveUp();
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [board, gameOver, gameWon]);

  // 更新最高分
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('bestScore', score.toString());
    }
  }, [score, bestScore]);

  // 在随机空位置添加一个新方块（2或4）
  const addRandomTile = (currentBoard) => {
    const newBoard = JSON.parse(JSON.stringify(currentBoard));
    const emptyPositions = [];

    // 找出所有空位置
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] === 0) {
          emptyPositions.push({ row: i, col: j });
        }
      }
    }

    // 如果没有空位置，返回原始棋盘
    if (emptyPositions.length === 0) {
      return newBoard;
    }

    // 随机选择一个空位置
    const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    // 90%概率生成2，10%概率生成4
    newBoard[randomPosition.row][randomPosition.col] = Math.random() < 0.9 ? 2 : 4;

    return newBoard;
  };

  // 检查游戏是否结束
  const checkGameOver = (currentBoard) => {
    // 检查是否有空格
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 0) {
          return false;
        }
      }
    }

    // 检查是否有相邻的相同数字
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const value = currentBoard[i][j];
        // 检查右侧
        if (j < 3 && currentBoard[i][j + 1] === value) {
          return false;
        }
        // 检查下方
        if (i < 3 && currentBoard[i + 1][j] === value) {
          return false;
        }
      }
    }

    return true;
  };

  // 检查是否胜利
  const checkWin = (currentBoard) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === targetTile) {
          return true;
        }
      }
    }
    return false;
  };

  // 向左移动
  const moveLeft = () => {
    let newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let newScore = score;

    for (let i = 0; i < 4; i++) {
      let row = newBoard[i].filter((val) => val !== 0); // 移除所有0
      let j = 0;

      // 合并相同的数字
      while (j < row.length - 1) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          newScore += row[j];
          row.splice(j + 1, 1);
          moved = true;
        }
        j++;
      }

      // 填充0
      while (row.length < 4) {
        row.push(0);
      }

      // 检查是否有移动
      if (JSON.stringify(newBoard[i]) !== JSON.stringify(row)) {
        moved = true;
      }

      newBoard[i] = row;
    }

    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      if (checkWin(newBoard)) {
        setGameWon(true);
      } else if (checkGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  // 向右移动
  const moveRight = () => {
    let newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let newScore = score;

    for (let i = 0; i < 4; i++) {
      let row = newBoard[i].filter((val) => val !== 0); // 移除所有0
      let j = row.length - 1;

      // 合并相同的数字（从右向左）
      while (j > 0) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          newScore += row[j];
          row.splice(j - 1, 1);
          moved = true;
          j--;
        }
        j--;
      }

      // 填充0（在左侧）
      while (row.length < 4) {
        row.unshift(0);
      }

      // 检查是否有移动
      if (JSON.stringify(newBoard[i]) !== JSON.stringify(row)) {
        moved = true;
      }

      newBoard[i] = row;
    }

    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      if (checkWin(newBoard)) {
        setGameWon(true);
      } else if (checkGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  // 向上移动
  const moveUp = () => {
    let newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let newScore = score;

    for (let j = 0; j < 4; j++) {
      // 提取列
      let column = [];
      for (let i = 0; i < 4; i++) {
        column.push(newBoard[i][j]);
      }

      // 移除所有0
      column = column.filter((val) => val !== 0);
      let i = 0;

      // 合并相同的数字
      while (i < column.length - 1) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          newScore += column[i];
          column.splice(i + 1, 1);
          moved = true;
        }
        i++;
      }

      // 填充0
      while (column.length < 4) {
        column.push(0);
      }

      // 检查是否有移动
      let originalColumn = [];
      for (let i = 0; i < 4; i++) {
        originalColumn.push(newBoard[i][j]);
      }

      if (JSON.stringify(originalColumn) !== JSON.stringify(column)) {
        moved = true;
      }

      // 更新列
      for (let i = 0; i < 4; i++) {
        newBoard[i][j] = column[i];
      }
    }

    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      if (checkWin(newBoard)) {
        setGameWon(true);
      } else if (checkGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  // 向下移动
  const moveDown = () => {
    let newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let newScore = score;

    for (let j = 0; j < 4; j++) {
      // 提取列
      let column = [];
      for (let i = 0; i < 4; i++) {
        column.push(newBoard[i][j]);
      }

      // 移除所有0
      column = column.filter((val) => val !== 0);
      let i = column.length - 1;

      // 合并相同的数字（从下向上）
      while (i > 0) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          newScore += column[i];
          column.splice(i - 1, 1);
          moved = true;
          i--;
        }
        i--;
      }

      // 填充0（在上方）
      while (column.length < 4) {
        column.unshift(0);
      }

      // 检查是否有移动
      let originalColumn = [];
      for (let i = 0; i < 4; i++) {
        originalColumn.push(newBoard[i][j]);
      }

      if (JSON.stringify(originalColumn) !== JSON.stringify(column)) {
        moved = true;
      }

      // 更新列
      for (let i = 0; i < 4; i++) {
        newBoard[i][j] = column[i];
      }
    }

    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      if (checkWin(newBoard)) {
        setGameWon(true);
      } else if (checkGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  // 设置难度（目标数字）
  const handleDifficultyChange = (e) => {
    setTargetTile(parseInt(e.target.value, 10));
    initGame();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div>
          <h1 className="game-title">1024</h1>
          <p>
            Join the numbers and get to the <strong>{targetTile} tile!</strong>
          </p>
          <div className="difficulty-selector">
            <label htmlFor="difficulty">Choose difficulty:</label>
            <select id="difficulty" value={targetTile} onChange={handleDifficultyChange}>
              <option value="1024">1024</option>
              <option value="2048">2048</option>
              <option value="512">512 (Easy)</option>
            </select>
          </div>
        </div>
        <div className="score-container">
          <div className="score-box">
            <div className="score-label">SCORE</div>
            <div className="score-value">{score}</div>
          </div>
          <div className="score-box">
            <div className="score-label">BEST</div>
            <div className="score-value">{bestScore}</div>
          </div>
        </div>
      </div>

      <Board board={board} />

      {gameOver && (
        <div className="game-message">
          <p>Game Over!</p>
          <button className="bg-board-bg text-white px-4 py-2 rounded mt-2" onClick={initGame}>
            Try Again
          </button>
        </div>
      )}

      {gameWon && (
        <div className="game-message">
          <p>You Win! You reached the {targetTile} tile!</p>
          <button className="bg-board-bg text-white px-4 py-2 rounded mt-2" onClick={initGame}>
            Play Again
          </button>
        </div>
      )}

      <div className="game-instructions">
        <h2 className="text-xl font-bold mb-2">HOW TO PLAY:</h2>
        <p>
          Use your <strong>arrow keys</strong> to move the tiles.
        </p>
        <p>
          When two tiles with the same number touch, they <strong>merge into one!</strong>
        </p>
      </div>
    </div>
  );
};

export default Game;
