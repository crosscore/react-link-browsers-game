// websocket-server/circleMotion.js

const circle = { x: 0, y: 0 };
const stepSize = 30;

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
  updateCirclePosition,
  sendCirclePositions,
};
