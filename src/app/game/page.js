/** @format */
"use client";

import React, { useState, useEffect, useRef } from "react";
import GameBoard from "../components/GameBoard"; // Ensure you have this component created

export default function Game() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null); // Use useRef to maintain WebSocket instance

  const [playerId, setPlayerId] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(1); // Player 1 starts
  const [playerBoards, setPlayerBoards] = useState({
    1: Array.from({ length: 10 }, () => Array(10).fill(0)), // Player 1's board
    2: Array.from({ length: 10 }, () => Array(10).fill(0)), // Player 2's board
  });
  const [placingShip, setPlacingShip] = useState(true); // State to track if we are placing a ship
  const [hits, setHits] = useState([]); // Track hits
  const [waiting, setWaiting] = useState(true); // State to track if waiting for an opponent

  useEffect(() => {
    // Establish WebSocket connection
    socketRef.current = new WebSocket("ws://localhost:7777");

    socketRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received from server:", data);

      if (data.type === "waiting") {
        setWaiting(true);
      } else if (data.type === "start") {
        setPlayerId(data.playerId);
        setWaiting(false);
      } else if (data.type === "move") {
        handleOpponentMove(data.rowIndex, data.colIndex);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = (event) => {
      console.log(
        `WebSocket connection closed: ${event.code} - ${event.reason}`
      );
    };

    // Clean up the connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (
      input &&
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(input);
      console.log("Message sent to server:", input);
      setInput("");
    } else {
      console.error(
        "WebSocket is not open. Ready state:",
        socketRef.current.readyState
      );
    }
  };

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
      socketRef.current.send(
        JSON.stringify({ type: "move", rowIndex, colIndex })
      );
      // Switch turn
      setCurrentTurn(3 - playerId);
    }
  };

  const handleOpponentMove = (rowIndex, colIndex) => {
    if (playerBoards[playerId][rowIndex][colIndex] === 1) {
      setHits([...hits, { rowIndex, colIndex }]);
    }
    // Switch turn
    setCurrentTurn(playerId);
  };

  return (
    <div>
      <h1>Battleship Game</h1>
      {waiting ? (
        <div>Waiting for an opponent...</div>
      ) : (
        <>
          <div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
          {playerId && (
            <>
              <h2>Player {playerId}'s Board</h2>
              <GameBoard
                board={playerBoards[playerId]}
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
