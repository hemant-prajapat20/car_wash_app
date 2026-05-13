import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  category: {
    type: String,
    enum: ['Basic Wash', 'Premium Detail', 'Interior Cleaning', 'Polishing', 'Full Service'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [String]
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
