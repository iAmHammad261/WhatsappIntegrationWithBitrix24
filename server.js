import express from 'express';
import { config } from './config/appConfig.js';
import routes from './routes/route.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/', routes);

// Start server
app.listen(config.port, () => {
  console.log(`✅ Server running on http://localhost:${config.port}`);
});
