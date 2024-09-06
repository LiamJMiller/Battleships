/** @format */
"use client";

import React from "react";

const GameBoard = ({ board, onCellClick }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${board[0].length}, 30px)`,
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onCellClick(rowIndex, colIndex)}
            style={{
              width: 30,
              height: 30,
              border: "1px solid black",
              backgroundColor: cell === 1 ? "gray" : "white",
            }}
          ></div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
