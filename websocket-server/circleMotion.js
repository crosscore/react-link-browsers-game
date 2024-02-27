// websocket-server/circleMotion.js


const stepSize = 30;
const circle = {};

function initializeCirclePosition(clientWindowSize) {
  circle.x = clientWindowSize.innerWidth / 2;
  circle.y = clientWindowSize.innerHeight / 2;
}

function updateCirclePosition(key) {
  switch (key) {
    case "w":
      circle.y -= stepSize;
      console.log("circle.y", circle.y);
      break;
    case "a":
      circle.x -= stepSize;
      console.log("circle.x", circle.x);
      break;
    case "s":
      circle.y += stepSize;
      console.log("circle.y", circle.y);
      break;
    case "d":
      circle.x += stepSize;
      console.log("circle.x", circle.x);
      break;
    default:
      break;
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
        console.log("Sending circle position", position);
      }
    }
  });
}

module.exports = {
  initializeCirclePosition,
  updateCirclePosition,
  sendCirclePositions,
};
