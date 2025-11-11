import express from 'express';
import ProcessTheIncomingMessages from '../controllers/ProcessTheIncomingMessagesFromWhatsapp.js';

const router = express.Router();

// Define a POST route
router.post('/processIncomingMessage', ProcessTheIncomingMessages);

export default router;
