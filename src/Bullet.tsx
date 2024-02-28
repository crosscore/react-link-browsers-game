// src/Bullet.tsx
import React from "react";

interface BulletProps {
  x: number;
  y: number;
}

const Bullet: React.FC<BulletProps> = ({ x, y }) => {
  return <circle cx={x} cy={y} r="5" fill="red" />;
};

export default Bullet;
