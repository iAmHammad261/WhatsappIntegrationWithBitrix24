// --- 3. DEFINE THE SCHEMA ---
// This is the "blueprint" for the data we agreed to save.

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  phoneNumber: String,
  text: String,
  type: String, // 'incoming' or 'sent'
  timestamp: Date
});

// --- 4. CREATE THE MODEL ---
// This is the tool we use to interact with the 'messages' collection
// I'VE EXPORTED THIS so other files (like addReceivedMessage.js) can use it
export const Message = mongoose.model('Message', messageSchema);