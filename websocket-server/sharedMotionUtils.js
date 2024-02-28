// websocket-server/sharedMotionUtils.js

function sendPositions(wss, clientWindowInfo, isOpen, entities) {
  wss.clients.forEach((client) => {
    if (isOpen(client)) {
      const windowInfo = clientWindowInfo.get(client);
      if (windowInfo) {
        entities.forEach((entity) => {
          const position = {
            id: entity.id,
            x: entity.x - windowInfo.screenX,
            y: entity.y - windowInfo.screenY,
          };
          client.send(JSON.stringify({ type: entity.type, position }));
          console.log("Sent position", position);
        });
      }
    }
  });
}

module.exports = {
  sendPositions,
};
