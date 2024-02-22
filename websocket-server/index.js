// websocket-server/index.js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
const clientWindowInfo = new Map();

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const msg = JSON.parse(message);
    if (msg.type === "windowInfo") {
      clientWindowInfo.set(ws, msg.data);
      console.log(clientWindowInfo.get(ws));
    }
  });

  ws.on("close", () => {
    clientWindowInfo.delete(ws);
  });
});
