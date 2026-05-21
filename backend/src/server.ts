import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import os from 'os';
import apiRoutes from './routes/apiRoutes';
import { initSocket } from './socket';
import { startExpireCustomerPlansJob } from './jobs/expireCustomerPlans';

dotenv.config();

const PORT_START = Number(process.env.PORT) || 5001;
process.stdout.write(`\n\x1b[32m[SYSTEM] Backend attempting to start on port ${PORT_START}...\x1b[0m\n`);
process.stdout.write(`\x1b[34m[LINK] http://localhost:${PORT_START}\x1b[0m\n\n`);

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chakachak');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// API ROUTES
app.use('/api', apiRoutes);

// BASE ROUTE
app.get('/', (req, res) => {
  res.send('Chakachak API is running...');
});

// GLOBAL ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = Number(process.env.PORT) || 5001;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

connectDB();

// Start cron jobs
startExpireCustomerPlansJob();

console.log('⏳ Starting server on port', PORT, '...');

server.listen(PORT, '0.0.0.0', () => {
  // Dynamically get the local IP address
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

  console.log(`🚀 Backend is running on: http://localhost:${PORT}`);
  console.log(`📡 Network access: http://${localIp}:${PORT}`);
});
