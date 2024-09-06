/** @format */

const http = require("http");
const express = require("express");
const next = require("next");
const { setupWebSocketServer } = require("./src/app/api/socket/Route");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    const httpServer = http.createServer(server);

    // Setup WebSocket server
    setupWebSocketServer(httpServer);

    httpServer.listen(7777, (err) => {
      if (err) {
        console.error("HTTP server error:", err);
        throw err;
      }
      console.log("> Ready on http://localhost:7777");
    });
  })
  .catch((err) => {
    console.error("Next.js app preparation error:", err);
  });
