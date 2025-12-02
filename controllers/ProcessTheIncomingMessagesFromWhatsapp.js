import { broadcast } from '../websockets/connections.js';
// 👇 Ensure this path matches where you saved the database helper
import { addReceivedMessage } from '../database/addRecievedMessage.js'; 
import {checkIfHistoryExists} from '../database/checkIfHistoryExists.js';
export default async function ProcessTheIncomingMessages(req, res) {
  try {
    console.log('--- Incoming Request ---');
    // console.log('Method:', req.method);

    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    // 1. Extract the specific message details needed for the Database
    // Based on your payload: entry -> changes -> value -> messages
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    // 2. Check if valid text message exists
    if (message && message.type === 'text' && message.text?.body) {
      
      const phoneNumber = message.from;     // "923135801665"
      const textBody = message.text.body;   // "Hello"

      if(checkIfHistoryExists(phoneNumber)){
        console.log("History exists for this number.");
      }

      console.log('Text message found, broadcasting...');

      // --- STEP A: Save to Database (New Logic) ---
      // We do this BEFORE or IN PARALLEL with broadcasting
      try {
        console.log(`Saving message from ${phoneNumber} to DB...`);
        await addReceivedMessage(phoneNumber, textBody);
        console.log(' Message saved to database successfully.');
      } catch (dbError) {
        console.error('Failed to save to DB (Continuing broadcast anyway):', dbError.message);
      }

      // --- STEP B: Broadcast to Frontend (Existing Logic) ---
      // We send the entire original body so the frontend can parse it as usual
      broadcast({ type: 'NEW_MESSAGE', data: req.body });
      console.log('Message broadcasted successfully');

    } else {
      console.log('No text message found, skipping broadcast');
    }

    // Always return 200 to WhatsApp to confirm receipt
    res.status(200).send('Message received');

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Internal Server Error');
  }
}