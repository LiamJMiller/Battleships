/** @format */

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

export const canPlaceShip = (board, rowIndex, cellIndex, size, orientation) => {
  if (orientation === "horizontal") {
    if (cellIndex + size > 10) return false;
    for (let i = 0; i < size; i++) {
      if (board[rowIndex][cellIndex + i]) return false;
    }
  } else {
    if (rowIndex + size > 10) return false;
    for (let i = 0; i < size; i++) {
      if (board[rowIndex + i][cellIndex]) return false;
    }
  }
  return true;
};

export const placeShip = (board, rowIndex, cellIndex, ship, orientation) => {
  const newBoard = [...board];
  for (let i = 0; i < ship.size; i++) {
    if (orientation === "horizontal") {
      newBoard[rowIndex][cellIndex + i] = ship.name[0];
    } else {
      newBoard[rowIndex + i][cellIndex] = ship.name[0];
    }
  }
  return newBoard;
};
