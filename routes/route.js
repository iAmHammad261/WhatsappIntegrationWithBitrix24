import express from 'express';
import ProcessTheIncomingMessages from '../controllers/ProcessTheIncomingMessagesFromWhatsapp.js';
import sendMessageController from '../controllers/addTheSentMessageToDatabase.js';

const router = express.Router();

// Define a POST route
router.post('/processIncomingMessage', ProcessTheIncomingMessages);

// define a post route for sending messaeges:
router.post('/sendMessage', sendMessageController);

export default router;
