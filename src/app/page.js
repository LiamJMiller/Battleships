/** @format */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [lobbyCode, setLobbyCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const createLobby = () => {
    if (!playerName) {
      setErrorMessage("Please enter your name.");
      return;
    }
    router.push(`/createLobby?playerName=${playerName}`);
  };

  const joinLobby = () => {
    if (!lobbyCode) {
      setErrorMessage("Please enter a lobby code.");
      return;
    }
    if (!playerName) {
      setErrorMessage("Please enter your name.");
      return;
    }
    router.push(`/waiting?lobbyCode=${lobbyCode}&playerName=${playerName}`);
  };

  return (
    <div className="container">
      <h1 className="heading">Landing Page</h1>
      <div className="form">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter Your Name"
          className="input"
        />
        <button className="button" onClick={createLobby}>
          Create Lobby
        </button>
        <div className="input-group">
          <input
            type="text"
            value={lobbyCode}
            onChange={(e) => setLobbyCode(e.target.value)}
            placeholder="Enter Lobby Code"
            className="input"
          />
          <button className="button" onClick={joinLobby}>
            Join Lobby
          </button>
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </div>
  );
}
