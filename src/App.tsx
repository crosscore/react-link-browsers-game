// src/App.tsx
import React, { useEffect, useState, useRef } from "react";

const App: React.FC = () => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket("ws://localhost:8080");

      if (ws.current) {
        ws.current.onopen = () => {
          console.log("Connected to the server");
          sendWindowInfo();
          window.addEventListener("resize", sendWindowInfo);
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket Error:", error);
        };

        ws.current.onclose = () => {
          console.log("WebSocket Connection Closed");
        };
      }
    };

    setTimeout(connectWebSocket, 1000);

    const sendWindowInfo = () => {
      const windowInfo = {
        screenX: window.screenX,
        screenY: window.screenY,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      };
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({ type: "windowInfo", data: windowInfo })
        );
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      window.removeEventListener("resize", sendWindowInfo);
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
    </div>
  );
};

export default App;
