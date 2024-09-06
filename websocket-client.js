/** @format */

const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:7000");

ws.on("open", () => {
  console.log("Connected to WebSocket server");
  ws.send("Hello Server!");
});

ws.on("message", (message) => {
  console.log("Received:", message);
});

ws.on("close", (code, reason) => {
  console.log(`Disconnected from WebSocket server: ${code} - ${reason}`);
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});
