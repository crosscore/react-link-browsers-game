// websocket-server/index.js
const WebSocket = require("ws");
const { initializeCirclePosition, startUpdatingCirclePosition, stopUpdatingCirclePosition, sendCirclePositions } = require("./circleMotion");

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });
const clientWindowInfo = new Map();

const isOpen = (ws) => ws.readyState === WebSocket.OPEN;
const activeKeys = new Set();

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const msg = JSON.parse(message);
    switch (msg.type) {
      case "windowInfo":
        if (!clientWindowInfo.has(ws)) {
          initializeCirclePosition(msg.data);
        }
        clientWindowInfo.set(ws, msg.data);
        console.log("Client window info", msg.data);
        sendCirclePositions(wss, clientWindowInfo, isOpen);
        break;
      case "startMovingCircle":
        activeKeys.add(msg.key);
        console.log("Active keys", activeKeys);
        if (activeKeys.size === 1) {
          startUpdatingCirclePosition(activeKeys, wss, clientWindowInfo, isOpen);
        }
        break;
      case "stopMovingCircle":
        activeKeys.delete(msg.key);
        if (activeKeys.size === 0) {
          stopUpdatingCirclePosition();
        }
        break;
      default:
        console.log("Received unknown message type.");
    }
  });

  ws.on("close", () => {
    clientWindowInfo.delete(ws);
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server is running on port ${PORT}`);

