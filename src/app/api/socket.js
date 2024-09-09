/** @format */

import { setupWebSocketServer } from "./route";

export default function handler(req, res) {
  if (!res.socket.server.websocketServer) {
    console.log("Initializing WebSocket server...");
    setupWebSocketServer(res.socket.server);
    res.socket.server.websocketServer = true;
  }
  res.end();
}
