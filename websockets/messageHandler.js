import { broadcast } from './connections.js';

export function handleMessage(ws, message) {
  try {
    const data = JSON.parse(message);

    if (data.type === 'PING') {
      ws.send(JSON.stringify({ type: 'PONG' }));
    } else if (data.type === 'BROADCAST') {
      broadcast({ type: 'NEW_MESSAGE', text: data.text });
    } else {
      ws.send(JSON.stringify({ error: 'Unknown message type' }));
    }

  } catch (err) {
    console.error('Error handling message:', err);
    ws.send(JSON.stringify({ error: 'Invalid message format' }));
  }
}
