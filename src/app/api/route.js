/** @format */

import { Server } from "ws";

let lobbies = {};

const createLobby = (lobbyCode) => {
  lobbies[lobbyCode] = {
    players: [],
    readyPlayers: 0,
    leaveTimeout: null,
    isFull: function () {
      return this.players.length >= 2;
    },
    addPlayer: function (socket, playerName) {
      this.players.push({ socket, playerName });
      this.broadcastPlayerList();
      this.broadcastMessage(`${playerName} has joined lobby ${lobbyCode}`);
      if (this.leaveTimeout) {
        clearTimeout(this.leaveTimeout);
        this.leaveTimeout = null;
      }
    },
    removePlayer: function (socket) {
      const player = this.players.find((player) => player.socket === socket);
      this.players = this.players.filter((player) => player.socket !== socket);
      this.broadcastPlayerList();
      if (this.players.length === 0) {
        this.leaveTimeout = setTimeout(() => {
          this.closeLobby();
        }, 30000);
      }
      if (player) {
        this.broadcastMessage(`${player.playerName} has left the lobby`);
      }
    },
    playerReady: function () {
      this.readyPlayers += 1;
    },
    allPlayersReady: function () {
      return this.readyPlayers === 2;
    },
    broadcastPlayerList: function () {
      const playerList = this.players.map((player) => ({
        name: player.playerName,
      }));
      this.players.forEach((player) => {
        player.socket.send(
          JSON.stringify({
            type: "updatePlayers",
            players: playerList,
          })
        );
      });
    },
    broadcastMessage: function (message) {
      this.players.forEach((player) => {
        player.socket.send(
          JSON.stringify({
            type: "message",
            message: message,
          })
        );
      });
    },
    closeLobby: function () {
      this.players.forEach((player) => {
        player.socket.close(1000, "Lobby closed due to inactivity");
      });
      delete lobbies[lobbyCode];
      console.log(`Lobby ${lobbyCode} closed due to inactivity`);
    },
  };
};

const findLobby = (lobbyCode) => {
  return lobbies[lobbyCode];
};

const generateLobbyCode = () => {
  return Math.random().toString(36).substr(2, 5);
};

export function setupWebSocketServer(server) {
  const websocketServer = new Server({ server });

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
          lobby.addPlayer(socket, data.playerName);
          socket.send(
            JSON.stringify({
              type: "joinLobbySuccess",
              lobbyCode: data.lobbyCode,
            })
          );
          console.log(
            `Player ${data.playerName} joined lobby: ${data.lobbyCode}`
          );
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
      } else if (data.type === "playerReady") {
        const lobby = findLobby(data.lobbyCode);
        if (lobby) {
          lobby.playerReady();
          if (lobby.allPlayersReady()) {
            lobby.players.forEach((player) => {
              player.socket.send(
                JSON.stringify({
                  type: "startGame",
                })
              );
            });
            console.log(`All players ready in lobby: ${data.lobbyCode}`);
          }
        }
      } else if (data.type === "playerUnready") {
        const lobby = findLobby(data.lobbyCode);
        if (lobby) {
          lobby.readyPlayers -= 1;
        }
      } else if (data.type === "leaveLobby") {
        const lobby = findLobby(data.lobbyCode);
        if (lobby) {
          lobby.removePlayer(socket);
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
}
