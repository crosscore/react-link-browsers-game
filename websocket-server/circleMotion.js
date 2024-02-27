// websocket-server/circleMotion.js

const stepSize = 5;
const circle = {};
let intervalId = null;

function initializeCirclePosition(clientWindowSize) {
  circle.x = clientWindowSize.innerWidth / 2;
  circle.y = clientWindowSize.innerHeight / 2;
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
        console.log("Sending circle position", position);
      }
    }
  });
}

function updateCirclePosition(key) {
  switch (key) {
    case "w":
      circle.y -= stepSize;
      break;
    case "a":
      circle.x -= stepSize;
      break;
    case "s":
      circle.y += stepSize;
      break;
    case "d":
      circle.x += stepSize;
      break;
    default:
      console.log("Invalid key:", key);
      return;
  }
  console.log(`Updated position to x: ${circle.x}, y: ${circle.y}`);
}

function startUpdatingCirclePosition(key, wss, clientWindowInfo, isOpen) {
  if (intervalId !== null) {
    return;
  }
  intervalId = setInterval(() => {
    updateCirclePosition(key);
    sendCirclePositions(wss, clientWindowInfo, isOpen);
  }, 16);
}

function stopUpdatingCirclePosition() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

module.exports = {
  initializeCirclePosition,
  sendCirclePositions,
  updateCirclePosition,
  startUpdatingCirclePosition,
  stopUpdatingCirclePosition,
};
