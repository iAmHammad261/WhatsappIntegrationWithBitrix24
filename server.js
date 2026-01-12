import express from 'express';
import http from 'http';
import cors from 'cors';

// Project Imports
import { config } from './config/appConfig.js';
import routes from './routes/route.js';
import { setupWebSocketServer } from './websockets/websocketServer.js';
import { connectDB } from './database/connectDB.js';

// Bitrix Auth Imports
// Make sure the path matches where you placed the file in this new project
import { initB24, handleOAuthRedirect, getAuthorizationUrl } from './bitrixServices/handleBitrixAuth.js';

const app = express();

// --- CORS Configuration ---
app.use(cors({
  origin: [
    'https://pcicrm.bitrix24.com',                                 // Bitrix CRM
    'https://bitrixintegrationwithwhatsapp.pcirealestate.site',    // Your App Site
    'https://bitrixintegrationwithwhatsapp.pcirealestate.site/', 
    'https://whatsappintegrationwithbitrix24frontend.premierchoiceint.online/',  // Trailing slash
    'http://localhost:3000'                                        // Local Dev
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle Preflight
app.options(/.*/, cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================================
//                  BITRIX AUTH MIDDLEWARE & STATE
// =========================================================================

// 1. GLOBAL FLAG: Tracks if initB24 has successfully completed.
let isB24Initialized = false;

// 2. GUARD MIDDLEWARE: Blocks routes that rely on the B24 instance.
const requireB24 = (req, res, next) => {
  if (isB24Initialized) {
    next(); 
  } else {
    console.warn('Request received but B24 instance is not ready. Skipping.');
    // Return 200 to prevent Bitrix webhooks from retrying endlessly if the server isn't ready
    res.status(200).send({ message: "B24 not initialized, skipping request." });
  }
};

// =========================================================================
//                       AUTH ROUTE (ROOT)
// =========================================================================

// This handles the OAuth handshake AND Health Checks.
// It must be defined BEFORE your main application routes.
app.get('/', async (req, res) => {
  // A. If no code, this is just a health check or a "Welcome" page
  if (!req.query.code) {
    if (isB24Initialized) {
      return res.send('Bitrix24 Integration with WhatsApp is Running and Authorized.');
    } else {
      return res.send('Bitrix24 Integration is Running but Awaiting Authorization.');
    }
  }

  // B. Handle OAuth Callback
  const code = req.query.code;
  
  // Check for errors from Bitrix
  if (req.query.error || req.query.error_description) {
    const error = req.query.error_description || req.query.error || 'Unknown error.';
    console.error(`Bitrix Error on Redirect: ${error}`);
    return res.status(400).send(`Authorization failed: ${error}`); 
  }

  try {
    console.log('Received authorization code. Exchanging for tokens...');
    
    // Exchange code for tokens and save them
    await handleOAuthRedirect(code); 
    
    console.log('App authorized! Tokens saved. Restarting service...');
    
    // Send response to browser
    res.send('App authorized! Tokens saved. Service is restarting...');

    // Restart process to load new tokens
    setImmediate(() => {
      process.exit(0);
    });
    
  } catch (err) {
    console.error('Authorization Flow Failed:', err.message);
    return res.status(500).send('Authorization failed during token exchange.');
  }
});

// =========================================================================
//                       APPLICATION ROUTES
// =========================================================================

// Protect your main application routes with the Bitrix Guard
// This ensures no database/whatsapp logic runs until Bitrix is connected.
app.use('/', requireB24, routes);

// =========================================================================
//                  SERVER & WEBSOCKET SETUP
// =========================================================================

// Create HTTP server manually (so Express + WebSocket can share it)
const server = http.createServer(app);

// Setup WebSocket server
setupWebSocketServer(server);

// Start server
server.listen(config.port, async () => {
  console.log(`Server running on http://localhost:${config.port}`);

  // 1. Connect to Database
  try {
    await connectDB();
    console.log('Database connected.');
  } catch (err) {
    console.error('Database connection failed:', err);
    return; // Stop startup if DB fails
  }

  // 2. Initialize Bitrix24 Auth
  try {
    const b24Instance = await initB24(); 
    if (!b24Instance) {
      console.log(`Bitrix24 Tokens missing.`);
      console.log(`Open this URL to authorize: ${getAuthorizationUrl()}`);
      // isB24Initialized remains false. 
      // The server is running, but API routes will return "Not initialized".
      // You must open the URL in browser to fix this.
    } else {
      console.log('Bitrix24 instance initialized/loaded.');
      isB24Initialized = true; 
    }
  } catch (error) {
    console.error('Failed to initialize B24:', error.message);
  }
});