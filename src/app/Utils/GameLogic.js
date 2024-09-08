/** @format */

// Create an empty board
export const createEmptyBoard = () => {
  return Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));
};

export const ships = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
];

// Check if a ship can be placed at the specified location
export const canPlaceShip = (board, rowIndex, cellIndex, size, orientation) => {
  if (orientation === "horizontal") {
    if (cellIndex + size > board[0].length) return false;
    for (let i = 0; i < size; i++) {
      if (board[rowIndex][cellIndex + i] !== null) return false;
    }
  } else {
    if (rowIndex + size > board.length) return false;
    for (let i = 0; i < size; i++) {
      if (board[rowIndex + i][cellIndex] !== null) return false;
    }
  }
  return true;
};

// Place a ship on the board
export const placeShip = (board, rowIndex, cellIndex, ship, orientation) => {
  const newBoard = board.map((row) => row.slice());
  if (orientation === "horizontal") {
    for (let i = 0; i < ship.size; i++) {
      newBoard[rowIndex][cellIndex + i] = ship.name;
    }
  } else {
    for (let i = 0; i < ship.size; i++) {
      newBoard[rowIndex + i][cellIndex] = ship.name;
    }
  }
  return newBoard;
};
