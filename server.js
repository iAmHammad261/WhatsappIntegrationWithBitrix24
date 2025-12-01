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
        'https://pcicrm.bitrix24.com', // Your Bitrix URL (no trailing slash)
        'https://pcicrm.bitrix24.com/'  // Just in case browsers send it with slash
    ],
    credentials: true // specialized setting often needed for auth headers
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
