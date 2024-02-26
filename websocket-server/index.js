// websocket-server/index.js
const WebSocket = require("ws");
const { updateCirclePosition, sendCirclePositions } = require("./circleMotion");

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });
const clientWindowInfo = new Map();

const isOpen = (ws) => ws.readyState === WebSocket.OPEN;

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const msg = JSON.parse(message);
    if (msg.type === "windowInfo") {
      clientWindowInfo.set(ws, msg.data);
    } else if (msg.type === "moveCircle") {
      console.log(msg.key);
      updateCirclePosition(msg.key);
      sendCirclePositions(wss, clientWindowInfo, isOpen);
    }
  });

  ws.on("close", () => {
    clientWindowInfo.delete(ws);
    console.log("Client disconnected");
  });
});
