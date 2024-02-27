// src/App.tsx
import React, { useEffect, useState, useRef } from "react";

interface Circle {
  x: number;
  y: number;
}

const WEBSOCKET_URL = "ws://localhost:8080";

const App: React.FC = () => {
  const [circle, setCircle] = useState<Circle | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const lastWindowInfo = useRef({screenX: 0, screenY: 0, innerWidth: 0, innerHeight: 0});

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
        ws.current.send(JSON.stringify({ type: "windowInfo", data: windowInfo }));
      }
    }
  };

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket(WEBSOCKET_URL);
      if (ws.current) {
        ws.current.onopen = () => {
          console.log("Connected to the server");
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
          console.log("Received new circle:", newCircle);
        };
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.repeat) return; // 長押しによる連続イベントを無視
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "startMovingCircle", key: event.key }));
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "stopMovingCircle", key: event.key }));
      }
    };

    setTimeout(connectWebSocket, 1);
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);
    const intervalId = setInterval(sendWindowInfo, 100);

    return () => {
      ws.current?.close();
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <svg width="100vw" height="100vh">
        {circle && (
          <circle cx={circle.x} cy={circle.y} r="180" fill="#47b0dc" />
        )}
      </svg>
    </div>
  );
};

export default App;
