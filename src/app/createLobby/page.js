/** @format */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateLobbyPage() {
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const socketRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName");

  useEffect(() => {
    createWebSocketConnection();
  }, []);

  const createWebSocketConnection = () => {
    socketRef.current = new WebSocket(
      process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      setIsSocketOpen(true);
      socketRef.current.send(
        JSON.stringify({ type: "createLobby", playerName: playerName })
      );
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === "createLobbySuccess" && data.lobbyCode) {
        console.log(`Lobby created with code: ${data.lobbyCode}`);
        router.push(
          `/waiting?lobbyCode=${data.lobbyCode}&playerName=${playerName}`
        );
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

  return (
    <div className="container">
      <h1 className="heading">Create Lobby</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}
