import { broadcast } from '../websockets/connections.js';

export default async function ProcessTheIncomingMessages(req, res) {
  try {
    console.log('--- Incoming Request ---');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Method:', req.method);
    console.log('URL:', req.url);

    console.log('--- Incoming Message Data ---');
    console.log(JSON.stringify(req.body, null, 2));

    // Before broadcasting
    console.log('Broadcasting message...');
    broadcast({ type: 'NEW_MESSAGE', data: req.body });
    console.log('Message broadcasted successfully');

    // Sending response
    console.log('Sending response: 200 OK');
    res.status(200).send('Message received');
  } catch (error) {
    console.error('Error processing message:', error);
    console.log('Sending response: 500 Internal Server Error');
    res.status(500).send('Internal Server Error');
  }
}
