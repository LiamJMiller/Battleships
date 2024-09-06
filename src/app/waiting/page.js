/** @format */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function WaitingPage() {
  const searchParams = useSearchParams();
  const lobbyCode = searchParams.get("lobbyCode");
  const initialPlayerId = parseInt(searchParams.get("playerId") || "0", 10);
  const [isGameReady, setIsGameReady] = useState(false);
  const [playerId, setPlayerId] = useState(initialPlayerId);
  const socketRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:7777");

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      socketRef.current.send(JSON.stringify({ type: "joinLobby", lobbyCode }));
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);
      if (data.type === "start" && data.playerId) {
        setPlayerId(data.playerId);
      } else if (data.type === "gameReady") {
        setIsGameReady(true);
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

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [lobbyCode]);

  const startGame = () => {
    router.push(`/game?lobbyCode=${lobbyCode}`);
  };

  return (
    <div>
      <h1>Waiting for Other Player</h1>
      <p>Lobby Code: {lobbyCode}</p>
      <p>Share this code with another player to join the lobby.</p>
      {playerId !== null && <p>You are Player {playerId}</p>}
      {isGameReady && <button onClick={startGame}>Start Game</button>}
    </div>
  );
}
