/** @format */

// src/app/api/socket/Route.js

let lobbies = {};

// Function to create a new lobby
const createLobby = (lobbyCode) => {
  lobbies[lobbyCode] = {
    players: [],
    isFull: function () {
      return this.players.length >= 2; // Assuming a lobby is full with 2 players
    },
    addPlayer: function (socket) {
      this.players.push(socket);
    },
  };
};

// Function to find a lobby by code
const findLobby = (lobbyCode) => {
  return lobbies[lobbyCode];
};

const GET = (req, res) => {
  const activeLobbies = Object.keys(lobbies).map((code) => ({
    code,
    players: lobbies[code].players.length,
  }));
  res.status(200).json(activeLobbies);
};

// Function to generate a unique lobby code
const generateLobbyCode = () => {
  return Math.random().toString(36).substr(2, 5); // Generates a random 5-character string
};

// WebSocket server setup
const setupWebSocketServer = (server) => {
  const WebSocket = require("ws");
  const websocketServer = new WebSocket.Server({ server });

  websocketServer.on("connection", (socket) => {
    console.log("New WebSocket connection established");

    socket.on("message", (message) => {
      const data = JSON.parse(message);
      console.log("Received message:", data);

      if (data.type === "createLobby") {
        const lobbyCode = generateLobbyCode();
        createLobby(lobbyCode);
        socket.send(
          JSON.stringify({
            type: "createLobbySuccess",
            lobbyCode: lobbyCode,
          })
        );
        console.log(`Lobby created with code: ${lobbyCode}`);
      } else if (data.type === "joinLobby") {
        let lobby = findLobby(data.lobbyCode);
        if (!lobby) {
          console.log(`Lobby not found, creating new lobby: ${data.lobbyCode}`);
          createLobby(data.lobbyCode);
          lobby = findLobby(data.lobbyCode);
        }

        if (lobby && !lobby.isFull()) {
          lobby.addPlayer(socket);
          socket.send(
            JSON.stringify({
              type: "joinLobbySuccess",
              lobbyCode: data.lobbyCode,
            })
          );
          console.log(`Player joined lobby: ${data.lobbyCode}`);
        } else {
          socket.send(
            JSON.stringify({
              type: "joinLobbyError",
              message: "Invalid code or lobby is full",
            })
          );
          console.log(
            `Failed to join lobby: ${data.lobbyCode} - Invalid code or lobby is full`
          );
        }
      }
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    socket.on("close", (event) => {
      console.log(
        `WebSocket connection closed: ${event.code} - ${event.reason}`
      );
    });
  });

  websocketServer.on("error", (error) => {
    console.error("WebSocket server error:", error);
  });
};

module.exports = { GET, setupWebSocketServer };
