export default async function ProcessTheIncomingMessages(req, res) {
  try {
    // Log the incoming message
    console.log('Incoming Message Data:', JSON.stringify(req.body, null, 2));

    // Send a simple response
    res.status(200).send('Message received');
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Internal Server Error');
  }
}
