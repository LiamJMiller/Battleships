/** @format */

import { useState } from "react";
import { createEmptyBoard, canPlaceShip, placeShip } from "../utils/gameLogic"; // Ensure these functions are correctly imported
import { ships } from "../utils/gameLogic"; // Import ships from gameLogic.js

export const useGameLogic = () => {
  const [playerBoard, setPlayerBoard] = useState(createEmptyBoard());
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [orientation, setOrientation] = useState("horizontal");

  const handleCellClick = (boardType, rowIndex, cellIndex) => {
    if (boardType === "player") {
      placeShipOnBoard(rowIndex, cellIndex, ships[currentShipIndex]);
    }
  };

  const placeShipOnBoard = (rowIndex, cellIndex, ship) => {
    console.log("Placing ship:", ship);
    if (
      canPlaceShip(playerBoard, rowIndex, cellIndex, ship.size, orientation)
    ) {
      const newBoard = placeShip(
        playerBoard,
        rowIndex,
        cellIndex,
        ship,
        orientation
      );
      setPlayerBoard(newBoard);
      setCurrentShipIndex(currentShipIndex + 1);
      return true;
    }
    console.log("Cannot place ship at:", rowIndex, cellIndex);
    return false;
  };

  const rotateShip = () => {
    setOrientation(orientation === "horizontal" ? "vertical" : "horizontal");
  };

  return {
    playerBoard,
    currentShipIndex,
    orientation,
    handleCellClick,
    rotateShip,
    placeShipOnBoard,
  };
};
