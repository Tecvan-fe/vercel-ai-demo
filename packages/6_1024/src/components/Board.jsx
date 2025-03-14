import React from 'react';
import Tile from './Tile';

const Board = ({ board }) => {
  return (
    <div className="game-board">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="game-cell">
            {value > 0 && <Tile value={value} />}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
