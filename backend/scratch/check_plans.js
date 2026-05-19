const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chakachak';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const CustomerPlan = mongoose.model('CustomerPlan', new mongoose.Schema({}, { strict: false }));
    const plans = await CustomerPlan.find({}).sort({ createdAt: -1 });
    console.log('CustomerPlans found:', plans.length);
    if (plans.length > 0) {
      console.log('Latest CustomerPlan:', JSON.stringify(plans[0], null, 2));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
