/** @format */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CreateLobbyPage() {
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const socketRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    createWebSocketConnection();
  }, []);

  const createWebSocketConnection = () => {
    try {
      socketRef.current = new WebSocket("ws://localhost:7777");

      socketRef.current.onopen = () => {
        console.log("WebSocket connection opened");
        setIsSocketOpen(true);
        socketRef.current.send(JSON.stringify({ type: "createLobby" }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);

        if (data.type === "createLobbySuccess" && data.lobbyCode) {
          console.log(`Lobby created with code: ${data.lobbyCode}`);
          router.push(`/waiting?lobbyCode=${data.lobbyCode}`);
        } else if (data.type === "error" && data.message) {
          console.error(`Error: ${data.message}`);
          setErrorMessage(data.message);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setErrorMessage("WebSocket error occurred");
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
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setErrorMessage("Failed to create WebSocket connection");
    }
  };

  return (
    <div>
      <h1>Create Lobby</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
