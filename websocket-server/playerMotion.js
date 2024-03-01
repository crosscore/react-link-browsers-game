// websocket-server/playerMotion.js
const { sendPositions } = require("./sharedMotionUtils");
const players = new Map();

const stepSize = 10;
let intervalId = null;

function initializePlayerPosition(clientWindowSize, clientID) {
  const player = {
    x: clientWindowSize.innerWidth / 2,
    y: clientWindowSize.innerHeight / 2,
    id: clientID,
    type: 'player'
  };
  players.set(clientID, player);
}

function updatePlayerPosition(activeKeys, clientID) {
  const player = players.get(clientID);
  if (!player) return;
  if (activeKeys.has('w')) player.y -= stepSize;
  if (activeKeys.has('a')) player.x -= stepSize;
  if (activeKeys.has('s')) player.y += stepSize;
  if (activeKeys.has('d')) player.x += stepSize;
  players.set(clientID, player);
}

function startUpdatingPlayerPosition(activeKeys, wss, clientWindowInfo, isOpen, clientID) {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    updatePlayerPosition(activeKeys, clientID);
    sendPlayerPositions(wss, clientWindowInfo, isOpen, clientID);
  }, 16);
}

function stopUpdatingPlayerPosition(clientID) {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function sendPlayerPositions(wss, clientWindowInfo, isOpen, clientID) {
  const player = players.get(clientID);
  if (player) {
    sendPositions(wss, clientWindowInfo, isOpen, [player]);
  }
}

module.exports = {
  initializePlayerPosition,
  updatePlayerPosition,
  startUpdatingPlayerPosition,
  stopUpdatingPlayerPosition,
  sendPlayerPositions
};
