import { addSentMessage } from '../database/addSentMessage.js';

/**
 * Controller to handle sending a message.
 * Expected Request Body: { "phoneNumber": "+1234567890", "text": "Hello World" }
 */
export default sendMessageController = async (req, res) => {
    try {
        // 1. Extract data from the incoming request body
        const { phoneNumber, text } = req.body;

        // 2. Basic Validation: Ensure data exists before trying to save
        if (!phoneNumber || !text) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields: phoneNumber and text are required." 
            });
        }

        // 3. Call your database helper function
        const savedMessage = await addSentMessage(phoneNumber, text);

        // 4. Send a success response back to the client
        return res.status(201).json({
            success: true,
            message: "Message sent and saved successfully.",
            data: savedMessage
        });

    } catch (error) {
        console.error("Controller Error:", error.message);
        
        // 5. Handle Server Errors (Don't leak sensitive error details to public)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message 
        });
    }
};