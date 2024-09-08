/** @format */
"use client";

import React from "react";
import "./Board.css";

// const GameBoard = ({ board, onCellClick, onDragOver, onDrop }) => {
//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: `repeat(${board[0].length}, 30px)`,
//       }}
//     >
//       {board.map((row, rowIndex) =>
//         row.map((cell, colIndex) => (
//           <div
//             key={`${rowIndex}-${colIndex}`}
//             onClick={() => onCellClick(rowIndex, colIndex)}
//             onDragOver={(e) => onDragOver(e, rowIndex, colIndex)}
//             onDrop={(e) => onDrop(e, rowIndex, colIndex)}
//             style={{
//               width: 30,
//               height: 30,
//               border: "1px solid black",
//               backgroundColor: cell === 1 ? "gray" : "white",
//             }}
//           ></div>
//         ))
//       )}
//     </div>
//   );
// };

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
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
