/** @format */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [lobbyCode, setLobbyCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const createLobby = () => {
    router.push("/createLobby");
  };

  const joinLobby = () => {
    if (!lobbyCode) {
      setErrorMessage("Please enter a lobby code.");
      return;
    }
    router.push(`/waiting?lobbyCode=${lobbyCode}`);
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
          <button onClick={joinLobby}>Join Lobby</button>
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
}
