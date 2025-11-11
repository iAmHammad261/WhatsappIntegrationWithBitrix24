const connections = new Set();

export function addConnection(ws) {
  connections.add(ws);
}

export function removeConnection(ws) {
  connections.delete(ws);
}

export function broadcast(message) {
  for (const ws of connections) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}
