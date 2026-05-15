import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRoutes from './routes/apiRoutes';

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chakachak');
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

import os from 'os';

const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    // Dynamically get the local IP address
    const nets = os.networkInterfaces();
    let localIp = 'localhost';
    
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
          localIp = net.address;
          break;
        }
      }
    }

    console.log(`🚀 Server running locally on: http://localhost:${PORT}`);
    console.log(`📡 Server running on network: http://${localIp}:${PORT}`);
  });
});
