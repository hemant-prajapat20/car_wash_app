import express from 'express';
import dotenv from 'dotenv';

// Initialize dotenv FIRST
dotenv.config();

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/errorMiddleware';

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(helmet()); 
// app.use(morgan('dev'));  // Disabled as per user request for clean terminal
app.use(cookieParser());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Debugging middleware
app.use((req: any, res: any, next: any) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// CORS Configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:8081',
  'http://localhost:19006',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true); 
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'AquaWash API is LIVE' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use(express.static('public'));

// Test Route
app.get('/', (req, res) => {
  res.send('AquaWash SaaS API is running...');
});

// Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\x1b[36m%s\x1b[0m`, `🚀 AquaWash API is LIVE`);
  console.log(`\x1b[33m%s\x1b[0m`, `🔗 Backend running at: http://localhost:${PORT}`);
});
