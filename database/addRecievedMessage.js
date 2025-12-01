import { Message } from './messageModel.js'; 

/**
 * Saves a message RECEIVED by your system.
 * @param {string} phoneNumber - The sender's phone number.
 * @param {string} text - The content of the message.
 */
export async function addReceivedMessage(phoneNumber, text) {
    if (!phoneNumber || !text) {
        throw new Error("Both phoneNumber and text are required.");
    }
    try {
        const newMessage = await Message.create({
            phoneNumber: phoneNumber,
            text: text,
            type: 'received', 
            timestamp: new Date()
        });
        return newMessage;
    } catch (error) {
        console.error('Error adding received message:', error.message);
        throw error;
    }
}