// src/App.tsx
import React, { useEffect, useState, useRef } from "react";

interface Player {
  x: number;
  y: number;
}

const WEBSOCKET_URL = "ws://localhost:8080";

const App: React.FC = () => {
  const [player, setPlayer] = useState<Player | null>(null);
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
          const newPlayer = JSON.parse(event.data);
          setPlayer(newPlayer);
          console.log("Received new player:", newPlayer);
        };
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.repeat) return; // Ignore repeated key presses
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "startMovingPlayer", key: event.key }));
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "stopMovingPlayer", key: event.key }));
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
        {player && (
          <circle cx={player.x} cy={player.y} r="60" fill="#47b0dc" />
        )}
      </svg>
    </div>
  );
};

export default App;
