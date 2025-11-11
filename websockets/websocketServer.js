import { WebSocketServer } from 'ws';
import { addConnection, removeConnection } from './connections.js';
import { handleMessage } from './messageHandlers.js';

export function setupWebSocketServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    addConnection(ws);
    console.log('Client connected');

    ws.on('message', (message) => handleMessage(ws, message));
    ws.on('close', () => {
      removeConnection(ws);
      console.log('Client disconnected');
    });
  });

  console.log('WebSocket server is running');
}
