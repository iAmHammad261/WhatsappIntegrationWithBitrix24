import { Message } from './MessageModel.js'; 

/**
 * Checks if any message history exists for a given phone number.
 * This is a reusable function, NOT a controller.
 * * @param {string} phoneNumber - The contact's phone number from the frontend.
 * @returns {Promise<boolean>} - True if history exists, false otherwise.
 */
export async function checkContactHistoryExists(phoneNumber) {
    if (!phoneNumber) {
        // Log an error but return false instead of crashing
        console.error("checkContactHistoryExists requires a phoneNumber.");
        return false; 
    }

    try {
        // 1. Handle Phone Number Formatting
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        const withPlus = '+' + cleanNumber;
        
        // 2. Count documents (Fastest way to check existence)
        const count = await Message.countDocuments({
            $or: [
                { phoneNumber: cleanNumber },
                { phoneNumber: withPlus },
                { phoneNumber: phoneNumber }
            ]
        });

        // 3. Return the boolean result
        return count > 0;

    } catch (error) {
        console.error('Error during database count:', error.message);
        // If there's a database error, assume no history for safety
        return false; 
    }
}