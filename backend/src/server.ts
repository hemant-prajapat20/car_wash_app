
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import os from 'os';
import apiRoutes from './routes/apiRoutes';
import { initSocket } from './socket';
import { connectDB } from './config/db';

// ---------------------------------------------------------------------------
// Load and validate environment variables
// ---------------------------------------------------------------------------

import './config/validateEnv'; // validate required vars
// Ensure critical secrets are present

function ensureEnv(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    console.error(`❌ Environment variable ${varName} is required but not set.`);
    process.exit(1);
  }
  return value;
}

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = ensureEnv('MONGODB_URI');

// ---------------------------------------------------------------------------
// Express app setup
// ---------------------------------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.send('Chakachak API is running...');
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// ---------------------------------------------------------------------------
// Server & DB startup
// ---------------------------------------------------------------------------
const server = http.createServer(app);
initSocket(server); // initialize socket.io

async function startServer() {
  try {
    // ---------------------------------------------------------------
    // 1️⃣ Connect to MongoDB (must succeed before we listen)
    // ---------------------------------------------------------------
    await connectDB(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');

    // ---------------------------------------------------------------
    // 2️⃣ Start Express server
    // ---------------------------------------------------------------
// Try to listen on the configured port, fallback to a random free port on conflict
const attemptListen = (listenPort: number) => {
  server.listen(listenPort, '0.0.0.0');
};

server.on('listening', () => {
  const addressInfo = server.address();
  const actualPort = typeof addressInfo === 'string' ? addressInfo : (addressInfo && addressInfo.port);
  // Dynamically resolve the local IP for convenient logging
  const nets = os.networkInterfaces();
  let localIp = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        localIp = net.address;
        break;
      }
    }
  }
  console.log(`🚀 Backend is running on: http://localhost:${actualPort}`);
  console.log(`📡 Network access: http://${localIp}:${actualPort}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`⚠️ Port ${PORT} is already in use. Trying a random free port...`);
    attemptListen(0); // 0 = let OS pick a free port
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Initial attempt
attemptListen(PORT);
  } catch (err: any) {
    console.error('❌ Failed to start backend:', err.message);
    process.exit(1);
  }
}

// Graceful shutdown handling
function shutdown(signal: string) {
  console.log(`🛑 Received ${signal}. Closing server...`);
  server.close(() => {
    console.log('🛑 HTTP server closed.');
    // Disconnect Mongoose
    import('mongoose')
      .then((mongoose) => mongoose.disconnect())
      .then(() => {
        console.log('🛑 MongoDB connection closed.');
        process.exit(0);
      })
      .catch((e) => {
        console.error('🛑 Error during shutdown:', e);
        process.exit(1);
      });
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Kick off the startup sequence
startServer();
