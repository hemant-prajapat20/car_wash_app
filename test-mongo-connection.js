const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const uri = process.env.MONGODB_URI;
console.log('Attempting to connect to', uri);
mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1);
  });
