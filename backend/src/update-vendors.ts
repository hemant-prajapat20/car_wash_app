import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/User';

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Successfully connected to MongoDB.');

    const result = await User.updateMany(
      { role: 'vendor' },
      { $set: { isHomeServiceAvailable: true } }
    );

    console.log(`Updated ${result.modifiedCount} vendors to have isHomeServiceAvailable = true.`);
  } catch (error) {
    console.error('Failed to update vendors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
