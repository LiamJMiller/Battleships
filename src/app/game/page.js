/** @format */
"use client";

import React, { useState, useEffect } from "react";
import Board from "../components/Board"; // Ensure you have this component created

export default function Game({ socket, playerId, initialBoards }) {
  const [currentTurn, setCurrentTurn] = useState(1); // Player 1 starts
  const [playerBoards, setPlayerBoards] = useState(initialBoards);
  const [placingShip, setPlacingShip] = useState(true); // State to track if we are placing a ship
  const [hits, setHits] = useState([]); // Track hits
  const [waiting, setWaiting] = useState(true); // State to track if waiting for an opponent

  const handleOpponentMove = (rowIndex, colIndex) => {
    if (playerBoards[playerId][rowIndex][colIndex] === 1) {
      setHits([...hits, { rowIndex, colIndex }]);
    }
    // Switch turn
    setCurrentTurn(playerId);
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message received from server:", data);

        if (data.type === "waiting") {
          setWaiting(true);
        } else if (data.type === "start") {
          setWaiting(false);
        } else if (data.type === "move") {
          handleOpponentMove(data.rowIndex, data.colIndex);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = (event) => {
        console.log(
          `WebSocket connection closed: ${event.code} - ${event.reason}`
        );
      };
    }
  }, [socket, handleOpponentMove]);

  const handleCellClick = (rowIndex, colIndex) => {
    if (placingShip) {
      // Place a ship at the clicked cell
      const newBoard = playerBoards[playerId].map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === rowIndex && cIdx === colIndex ? 1 : cell
        )
      );
      setPlayerBoards({ ...playerBoards, [playerId]: newBoard });
      setPlacingShip(false); // Stop placing ships after the first one
    } else if (currentTurn === playerId) {
      console.log(`Cell clicked: (${rowIndex}, ${colIndex})`);
      // Handle attack
      if (playerBoards[3 - playerId][rowIndex][colIndex] === 1) {
        setHits([...hits, { rowIndex, colIndex }]);
      }
      // Send move to the server
      socket.send(JSON.stringify({ type: "move", rowIndex, colIndex }));
      // Switch turn
      setCurrentTurn(3 - playerId);
    }
  };

  return (
    <div>
      <h1>Battleship Game</h1>
      {waiting ? (
        <div>Waiting for an opponent...</div>
      ) : (
        <>
          {playerId && (
            <>
              <h2>Player {playerId}&apos;s Board</h2>
              <Board
                board={playerBoards[playerId]}
                onCellClick={handleCellClick}
              />
              <h2>Opponent&apos;s Board</h2>
              <Board
                board={playerBoards[3 - playerId]}
                onCellClick={handleCellClick}
              />
            </>
          )}
          <div>
            <h2>Hits</h2>
            <ul>
              {hits.map((hit, index) => (
                <li key={index}>
                  Hit at ({hit.rowIndex}, {hit.colIndex})
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
