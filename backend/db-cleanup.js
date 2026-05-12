const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function cleanupIndices() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chakachak');
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    console.log('🔍 Fetching current indices...');
    const indexes = await collection.indexes();
    console.log('Current Indexes:', indexes.map(i => i.name));

    // List of redundant indices to drop
    const toDrop = ['userId_1', 'id_1']; 

    for (const name of toDrop) {
      if (indexes.find(i => i.name === name)) {
        console.log(`🗑️ Dropping redundant index: ${name}`);
        await collection.dropIndex(name);
      }
    }

    console.log('✨ Database sanitized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Cleanup failed:', err.message);
    process.exit(1);
  }
}

cleanupIndices();
