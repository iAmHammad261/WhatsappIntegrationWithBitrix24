// Import the Message model (assuming it's in a file like 'messageModel.js')
import { Message } from './MessageModel.js'; 

/**
 * Saves a message SENT from your system.
 * @param {string} phoneNumber - The recipient's phone number.
 * @param {string} text - The content of the message.
 */
export async function addSentMessage(phoneNumber, text) {
    if (!phoneNumber || !text) {
        throw new Error("Both phoneNumber and text are required.");
    }
    try {
        const newMessage = await Message.create({
            phoneNumber: phoneNumber,
            text: text,
            type: 'sent', // <-- Hardcoded Type
            timestamp: new Date()
        });
        return newMessage;
    } catch (error) {
        console.error('Error adding sent message:', error.message);
        throw error;
    }
}