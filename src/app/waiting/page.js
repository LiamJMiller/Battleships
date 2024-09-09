/** @format */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Board from "../components/Board"; // Ensure you have this component created
import Ship from "../components/Ship"; // Import the Ship component
import useGameLogic from "../hooks/useGameLogic";
import { ships } from "../utils/gameLogic";
import "../globals.css"; // Import global styles

export default function WaitingPage() {
  const [isReady, setIsReady] = useState(false);
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [players, setPlayers] = useState([]);
  const [placedShips, setPlacedShips] = useState([]); // Track placed ships
  const socketRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const lobbyCode = searchParams.get("lobbyCode");
  const playerName = searchParams.get("playerName");

  const {
    playerBoard,
    currentShipIndex,
    orientation,
    handleCellClick,
    rotateShip,
    placeShipOnBoard,
  } = useGameLogic();

  useEffect(() => {
    createWebSocketConnection();
  }, []);

  const createWebSocketConnection = () => {
    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      setIsSocketOpen(true);
      socketRef.current.send(
        JSON.stringify({
          type: "joinLobby",
          lobbyCode: lobbyCode,
          playerName: playerName,
        })
      );
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === "startGame") {
        console.log("Game starting...");
        router.push(`/game?lobbyCode=${lobbyCode}&playerName=${playerName}`);
      } else if (data.type === "updatePlayers") {
        setPlayers(data.players);
      } else if (data.type === "message") {
        console.log(data.message);
      } else if (data.type === "error" && data.message) {
        console.error(`Error: ${data.message}`);
        setErrorMessage(data.message);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = (event) => {
      console.log(
        `WebSocket connection closed: ${event.code} - ${event.reason}`
      );
      setIsSocketOpen(false);
      if (event.code !== 1000) {
        setTimeout(() => {
          createWebSocketConnection();
        }, 1000);
      }
    };
  };

  const toggleReady = () => {
    if (!isSocketOpen) return;
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    socketRef.current?.send(
      JSON.stringify({
        type: newReadyState ? "playerReady" : "playerUnready",
        lobbyCode: lobbyCode,
      })
    );
  };

  const leaveLobby = () => {
    if (!isSocketOpen) return;
    socketRef.current?.send(
      JSON.stringify({ type: "leaveLobby", lobbyCode: lobbyCode })
    );
    router.push("/");
  };

  const handleDragStart = (e, ship) => {
    if (placedShips.includes(ship.name)) return; // Prevent dragging if ship is already placed
    console.log("Drag Start:", ship);
    e.dataTransfer.setData("ship", JSON.stringify(ship));
  };

  const handleDrop = (e, rowIndex, colIndex) => {
    const ship = JSON.parse(e.dataTransfer.getData("ship"));
    console.log("Drop:", ship);
    const success = placeShipOnBoard(rowIndex, colIndex, ship);
    if (success) {
      setPlacedShips([...placedShips, ship.name]); // Mark ship as placed
    } else {
      console.error("Failed to place ship at:", rowIndex, colIndex);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <h1 className="heading">Waiting Page</h1>
      <p>Lobby Code: {lobbyCode}</p>
      <button
        className="button"
        onClick={toggleReady}
        disabled={!isSocketOpen || currentShipIndex < ships.length}
      >
        {isReady ? "Unready" : "Ready Up"}
      </button>
      <button className="button" onClick={leaveLobby}>
        Leave Lobby
      </button>
      <button className="button" onClick={rotateShip}>
        Rotate Ship
      </button>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <h2>Players</h2>
      <ul className="players-list">
        {players.map((player, index) => (
          <li key={index}>{player.name}</li>
        ))}
      </ul>
      <h2>Your Board</h2>
      <Board
        board={playerBoard}
        onCellClick={(row, col) => handleCellClick("player", row, col)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <h2>Ships</h2>
      <div className="ships-container">
        {ships.map((ship, index) => (
          <Ship
            key={index}
            ship={ship}
            orientation={orientation}
            onDragStart={handleDragStart}
            draggable={!placedShips.includes(ship.name)} // Disable dragging if ship is placed
          />
        ))}
      </div>
    </div>
  );
}
