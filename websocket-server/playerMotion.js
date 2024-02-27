// websocket-server/playerMotion.js

const stepSize = 5;
const player = {x: 0, y: 0};
let intervalId = null;

function initializePlayerPosition(clientWindowSize) {
  player.x = clientWindowSize.innerWidth / 2;
  player.y = clientWindowSize.innerHeight / 2;
}

function updatePlayerPosition(activeKeys) {
  if (activeKeys.has('w')) player.y -= stepSize;
  if (activeKeys.has('a')) player.x -= stepSize;
  if (activeKeys.has('s')) player.y += stepSize;
  if (activeKeys.has('d')) player.x += stepSize;
  console.log(`Updated position to x: ${player.x}, y: ${player.y}`);
}

function startUpdatingPlayerPosition(activeKeys, wss, clientWindowInfo, isOpen) {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    updatePlayerPosition(activeKeys);
    sendPlayerPositions(wss, clientWindowInfo, isOpen);
  }, 16);
}

function stopUpdatingPlayerPosition() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function sendPlayerPositions(wss, clientWindowInfo, isOpen) {
  wss.clients.forEach((client) => {
    if (isOpen(client)) {
      const windowInfo = clientWindowInfo.get(client);
      if (windowInfo) {
        const position = {
          x: player.x - windowInfo.screenX,
          y: player.y - windowInfo.screenY,
        };
        client.send(JSON.stringify(position));
        // console.log(`Sending player position: (${player.x}-${windowInfo.screenX}=${player.x - windowInfo.screenX}, ${player.y}-${windowInfo.screenY}=${player.y - windowInfo.screenY})`);
      }
    }
  });
}

module.exports = {
  initializePlayerPosition,
  sendPlayerPositions,
  updatePlayerPosition,
  startUpdatingPlayerPosition,
  stopUpdatingPlayerPosition,
};
