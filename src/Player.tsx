// src/Player.tsx
import React from "react";

interface PlayerProps {
  x: number;
  y: number;
}

const Player: React.FC<PlayerProps> = ({ x, y }) => {
  return <circle cx={x} cy={y} r="60" fill="#47b0dc" />;
};

export default Player;
