const connections = new Set();

export function addConnection(ws) {
  connections.add(ws);
  console.log(`Connection added. Total connections: ${connections.size}`);
}

export function removeConnection(ws) {
  connections.delete(ws);
  console.log(`Connection removed. Total connections: ${connections.size}`);
}

export function broadcast(message) {
  console.log(`Broadcasting message to ${connections.size} connection(s):`, message);
  
  for (const ws of connections) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
      console.log('Message sent to one client');
    } else {
      console.log('Skipping a closed connection');
    }
  }
}
