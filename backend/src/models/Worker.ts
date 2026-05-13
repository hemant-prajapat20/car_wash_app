import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Washer', 'Detailer', 'Supervisor', 'Specialist'],
    default: 'Washer'
  },
  status: {
    type: String,
    enum: ['Active', 'Busy', 'Off Duty'],
    default: 'Active'
  },
  experience: String,
  avatar: String
}, { timestamps: true });

export default mongoose.model('Worker', workerSchema);
