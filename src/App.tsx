// src/App.tsx
import React, { useEffect, useState, useRef } from "react";

interface Circle {
  x: number;
  y: number;
}

const WEBSOCKET_URL = "ws://localhost:8080";
const MOVEMENT_CHECK_INTERVAL = 10;

const App: React.FC = () => {
  const [circle, setCircle] = useState<Circle | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const lastWindowInfo = useRef({
    screenX: 0,
    screenY: 0,
    innerWidth: 0,
    innerHeight: 0,
  });

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket(WEBSOCKET_URL);

      if (ws.current) {
        ws.current.onopen = () => {
          console.log("Connected to the server");
          sendWindowInfo();
        };
        ws.current.onerror = (error) => {
          console.error("WebSocket Error:", error);
        };
        ws.current.onclose = () => {
          console.log("WebSocket Connection Closed");
        };
        ws.current.onmessage = (event) => {
          const newCircle = JSON.parse(event.data);
          setCircle(newCircle);
        };
      }
    };

    let lastX = window.screenX;
    let lastY = window.screenY;
    const checkWindowMovement = () => {
      if (window.screenX !== lastX || window.screenY !== lastY) {
        sendWindowInfo();
        lastX = window.screenX;
        lastY = window.screenY;
      }
    };

    const movementCheckInterval = setInterval(
      checkWindowMovement,
      MOVEMENT_CHECK_INTERVAL
    );

    const sendWindowInfo = () => {
      const windowInfo = {
        screenX: window.screenX,
        screenY: window.screenY,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      };
      if (JSON.stringify(windowInfo) !== JSON.stringify(lastWindowInfo.current)) {
        lastWindowInfo.current = windowInfo;
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(
            JSON.stringify({ type: "windowInfo", data: windowInfo })
          );
        }
      }
    };

    window.addEventListener("resize", sendWindowInfo);

    const handleKeyPress = (event: KeyboardEvent) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "moveCircle", key: event.key }));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    setTimeout(connectWebSocket, 1);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("resize", sendWindowInfo);
      clearInterval(movementCheckInterval);
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <svg width="100vw" height="100vh">
        {circle && (
          <circle cx={circle.x} cy={circle.y} r="180" fill="#910A67" />
        )}
      </svg>
    </div>
  );
};

export default App;
