// websocket-server/index.js
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const { initializePlayerPosition, startUpdatingPlayerPosition, stopUpdatingPlayerPosition, sendPlayerPositions } = require("./playerMotion");

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });
const clientWindowInfo = new Map();
const clientIDs = new Map();

const isOpen = (ws) => ws.readyState === WebSocket.OPEN;
const activeKeys = new Set();

wss.on("connection", (ws) => {
  const clientID = uuidv4();
  clientIDs.set(ws, clientID);
  console.log(`Client connected: ${clientID}`);
  ws.on("message", (message) => {
    const msg = JSON.parse(message);
    switch (msg.type) {
      case "windowInfo":
        if (!clientWindowInfo.has(ws)) {
          initializePlayerPosition(msg.data);
        }
        clientWindowInfo.set(ws, msg.data);
        console.log("Client window info", msg.data);
        sendPlayerPositions(wss, clientWindowInfo, isOpen);
        break;
      case "startMovingPlayer":
        activeKeys.add(msg.key);
        console.log("Active keys", activeKeys);
        if (activeKeys.size === 1) {
          startUpdatingPlayerPosition(activeKeys, wss, clientWindowInfo, isOpen);
        }
        break;
      case "stopMovingPlayer":
        activeKeys.delete(msg.key);
        if (activeKeys.size === 0) {
          stopUpdatingPlayerPosition();
        }
        break;
      default:
        console.log("Received unknown message type.");
    }
  });

  ws.on("close", () => {
    clientWindowInfo.delete(ws);
    console.log(`Client disconnected: ${clientIDs.get(ws)}`);
    clientIDs.delete(ws);
  });
});

console.log(`WebSocket server is running on port ${PORT}`);
