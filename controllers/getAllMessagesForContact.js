import { Message } from '../database/MessageModel.js'; // Adjust path to your model

export const getChatHistory = async (req, res) => {
    try {
        const { phoneNumber } = req.query;

        if (!phoneNumber) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        // 1. Handle Phone Number Formatting Issues
        // The DB has mixed formats ("+92..." and "92..."). We search for both.
        const cleanNumber = phoneNumber.replace(/\D/g, ''); // Remove + or spaces
        const withPlus = '+' + cleanNumber;
        
        // 2. Query the Database
        const messages = await Message.find({
            $or: [
                { phoneNumber: cleanNumber },
                { phoneNumber: withPlus },
                { phoneNumber: phoneNumber } // strict match just in case
            ]
        })
        .sort({ timestamp: 1 }); // 1 = Ascending (Oldest first), -1 = Descending

        // 3. Return the sorted list
        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};