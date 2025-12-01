import express from 'express';
import http from 'http';
import { config } from './config/appConfig.js';
import routes from './routes/route.js';
import { setupWebSocketServer } from './websockets/websocketServer.js'; // adjust path
import { connectDB } from './database/connectDB.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: [
    'https://pcicrm.bitrix24.com',                 // Your Bitrix CRM
    'https://bitrixintegrationwithwhatsapp.pcirealestate.site', // <-- ADD THIS! (The site hosting your app)
    'https://bitrixintegrationwithwhatsapp.pcirealestate.site/' // Add with slash too, just to be safe
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

await connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/', routes);

// Create HTTP server manually (so Express + WebSocket can share it)
const server = http.createServer(app);

// Setup WebSocket server
setupWebSocketServer(server);

// Start server
server.listen(config.port, () => {
  console.log(`✅ Server running on http://localhost:${config.port}`);
});
