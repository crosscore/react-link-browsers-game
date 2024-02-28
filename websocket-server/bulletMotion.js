// websocket-server/bulletMotion.js
const { sendPositions } = require("./sharedMotionUtils");

let bullets = [];
let nextBulletId = 0;

function createBullet(x, y, targetX, targetY) {
  const id = nextBulletId++;
  // Calculate direction based on target and current position
  const directionX = targetX - x;
  const directionY = targetY - y;
  const bullet = {
    id,
    x,
    y,
    directionX,
    directionY,
    createdAt: Date.now(),
    type: "bullet",
  };
  bullets.push(bullet);
}

function updateBulletPositions(wss, clientWindowInfo, isOpen) {
  const now = Date.now();
  bullets = bullets.filter((bullet) => {
    // Update position based on direction
    bullet.x += bullet.directionX * 0.1; // Adjust speed as necessary
    bullet.y += bullet.directionY * 0.1; // Adjust speed as necessary
    return now - bullet.createdAt < 3000; // Keep bullet for 3 seconds
  });
  sendPositions(wss, clientWindowInfo, isOpen, bullets);
}

module.exports = { createBullet, updateBulletPositions };
