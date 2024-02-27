// websocket-server/index.js
const WebSocket = require("ws");
const { initializeCirclePosition, startUpdatingCirclePosition, stopUpdatingCirclePosition, sendCirclePositions } = require("./circleMotion");

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });
const clientWindowInfo = new Map();

const isOpen = (ws) => ws.readyState === WebSocket.OPEN;

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
        const startKey = msg.key;
        console.log(`Start moving circle with key: ${startKey}`);
        startUpdatingCirclePosition(startKey, wss, clientWindowInfo, isOpen);
        sendCirclePositions(wss, clientWindowInfo, isOpen);
        break;
      case "stopMovingCircle":
        console.log(`Stop moving circle with key: ${msg.key}`);
        stopUpdatingCirclePosition();
        sendCirclePositions(wss, clientWindowInfo, isOpen);
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
