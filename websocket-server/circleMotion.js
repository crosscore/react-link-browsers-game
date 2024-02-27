// websocket-server/circleMotion.js

const stepSize = 5;
const circle = {x: 0, y: 0};
let intervalId = null;

function initializeCirclePosition(clientWindowSize) {
  circle.x = clientWindowSize.innerWidth / 2;
  circle.y = clientWindowSize.innerHeight / 2;
}

function updateCirclePosition(activeKeys) {
  if (activeKeys.has('w')) circle.y -= stepSize;
  if (activeKeys.has('a')) circle.x -= stepSize;
  if (activeKeys.has('s')) circle.y += stepSize;
  if (activeKeys.has('d')) circle.x += stepSize;
  console.log(`Updated position to x: ${circle.x}, y: ${circle.y}`);
}

function startUpdatingCirclePosition(activeKeys, wss, clientWindowInfo, isOpen) {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    updateCirclePosition(activeKeys);
    sendCirclePositions(wss, clientWindowInfo, isOpen);
  }, 16);
}

function stopUpdatingCirclePosition() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function sendCirclePositions(wss, clientWindowInfo, isOpen) {
  wss.clients.forEach((client) => {
    if (isOpen(client)) {
      const windowInfo = clientWindowInfo.get(client);
      if (windowInfo) {
        const position = {
          x: circle.x - windowInfo.screenX,
          y: circle.y - windowInfo.screenY,
        };
        client.send(JSON.stringify(position));
        console.log(`Sending circle position: (${circle.x}-${windowInfo.screenX}=${circle.x - windowInfo.screenX}, ${circle.y}-${windowInfo.screenY}=${circle.y - windowInfo.screenY})`);
      }
    }
  });
}

module.exports = {
  initializeCirclePosition,
  sendCirclePositions,
  updateCirclePosition,
  startUpdatingCirclePosition,
  stopUpdatingCirclePosition,
};
