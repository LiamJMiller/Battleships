/** @format */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MessageData {
  type: string;
  lobbyCode?: string;
  message?: string;
  playerId?: number;
}

export default function LandingPage() {
  const [lobbyCode, setLobbyCode] = useState<string>("");
  const [isCreatingLobby, setIsCreatingLobby] = useState<boolean>(false);
  const [isJoiningLobby, setIsJoiningLobby] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSocketOpen, setIsSocketOpen] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const router = useRouter();

  const createWebSocketConnection = () => {
    socketRef.current = new WebSocket("ws://localhost:7777");

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      setIsSocketOpen(true);
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      const data: MessageData = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === "createLobbySuccess" && data.lobbyCode) {
        console.log(`Lobby created with code: ${data.lobbyCode}`);
        setLobbyCode(data.lobbyCode);
        joinLobby(data.lobbyCode);
      } else if (data.type === "joinLobbySuccess" && data.lobbyCode) {
        console.log(`Joined lobby with code: ${data.lobbyCode}`);
        router.push(`/waiting?lobbyCode=${data.lobbyCode}`);
      } else if (data.type === "error" && data.message) {
        console.error(`Error: ${data.message}`);
        setErrorMessage(data.message);
      }
    };

    socketRef.current.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = (event: CloseEvent) => {
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

  const createLobby = () => {
    if (isCreatingLobby) return;
    setIsCreatingLobby(true);
    console.log("Attempting to create lobby...");
    if (!socketRef.current) {
      createWebSocketConnection();
    }
    const interval = setInterval(() => {
      if (isSocketOpen) {
        socketRef.current?.send(JSON.stringify({ type: "createLobby" }));
        clearInterval(interval);
      }
    }, 100);
  };

  const joinLobby = (code?: string) => {
    if (isJoiningLobby) return;
    setIsJoiningLobby(true);
    setErrorMessage(null);
    const lobbyCodeToJoin = code || lobbyCode;
    console.log("Attempting to join lobby...");
    socketRef.current?.send(
      JSON.stringify({ type: "joinLobby", lobbyCode: lobbyCodeToJoin })
    );
  };

  return (
    <div>
      <h1>Landing Page</h1>
      <div>
        <button onClick={createLobby}>Create Lobby</button>
        <div>
          <input
            type="text"
            value={lobbyCode}
            onChange={(e) => setLobbyCode(e.target.value)}
            placeholder="Enter Lobby Code"
          />
          <button onClick={() => joinLobby()}>Join Lobby</button>
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
}
