const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chakachak';

async function check() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check plans
    const ServicePlan = mongoose.model('ServicePlan', new mongoose.Schema({}, { strict: false }));
    const plans = await ServicePlan.find({});
    console.log('Service plans count:', plans.length);
    if (plans.length > 0) {
      console.log('Sample plan:', JSON.stringify(plans[0], null, 2));
    }
    
    // Check customers
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const customers = await User.find({ role: 'customer' });
    console.log('Customers count:', customers.length);
    if (customers.length > 0) {
      console.log('Sample customer:', JSON.stringify(customers[0], null, 2));
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
