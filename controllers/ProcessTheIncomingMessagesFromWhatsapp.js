import { broadcast } from '../websockets/connections.js';

export default async function ProcessTheIncomingMessages(req, res) {
  try {
    console.log('--- Incoming Request ---');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Body:', JSON.stringify(req.body, null, 2));

    // Check if text.body exists
    const hasTextMessage = req.body?.entry?.some(entry =>
      entry.changes?.some(change =>
        change.value?.messages?.some(msg => msg.type === 'text' && msg.text?.body)
      )
    );

    if (hasTextMessage) {
      console.log('Text message found, broadcasting...');
      broadcast({ type: 'NEW_MESSAGE', data: req.body });
      console.log('Message broadcasted successfully');
    } else {
      console.log('No text message found, skipping broadcast');
    }

    res.status(200).send('Message received');
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Internal Server Error');
  }
}
