import mongoose, { ConnectOptions } from 'mongoose';

/**
 * Connect to MongoDB using Mongoose.
 * The function resolves only when the connection is fully established.
 * It also disables Mongoose command buffering to avoid "buffering timed out" errors.
 */
export async function connectDB(uri: string): Promise<void> {
  // Disable Mongoose buffering – queries error immediately if not connected.
  mongoose.set('bufferCommands', false);
  mongoose.set('strictQuery', true);

  const options: ConnectOptions = {
    // Fail fast if no server is reachable – helpful for Render deployments.
    serverSelectionTimeoutMS: 5000,
    // Auto‑index is disabled in production for performance; enable in dev if needed.
    autoIndex: process.env.NODE_ENV !== 'production',
  };

  await mongoose.connect(uri, options);

  // Basic event listeners for visibility.
  mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connection event: connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error event:', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ Mongoose disconnected');
  });
}

// Keep a default export for compatibility with any existing imports.
export default connectDB;
