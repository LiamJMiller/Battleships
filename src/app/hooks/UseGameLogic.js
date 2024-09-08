/** @format */

import { useState } from "react";
import {
  createEmptyBoard,
  ships,
  canPlaceShip,
  placeShip,
} from "../Utils/GameLogic";

export const useGameLogic = () => {
  const [playerBoard, setPlayerBoard] = useState(createEmptyBoard());
  const [opponentBoard, setOpponentBoard] = useState(createEmptyBoard());
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [orientation, setOrientation] = useState("horizontal"); // "horizontal" or "vertical"

  const handleCellClick = (boardType, rowIndex, cellIndex) => {
    if (boardType === "player") {
      placeShipOnBoard(rowIndex, cellIndex);
    }
  };

  const placeShipOnBoard = (rowIndex, cellIndex) => {
    const ship = ships[currentShipIndex];
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
    }
  };

  const rotateShip = () => {
    setOrientation(orientation === "horizontal" ? "vertical" : "horizontal");
  };

  return {
    playerBoard,
    opponentBoard,
    currentShipIndex,
    orientation,
    handleCellClick,
    rotateShip,
  };
};
