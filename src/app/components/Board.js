/** @format */
"use client";

import React from "react";
import "./Board.css";

const Board = ({ board, onCellClick, onDragOver, onDrop }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`board-cell ${cell ? "occupied" : ""}`}
              onClick={() => onCellClick(rowIndex, cellIndex)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, rowIndex, cellIndex)}
            >
              {/* {cell}  //text if you want to see the ship names*/}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
