import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: String, // e.g. "09:00"
    required: true
  },
  endTime: {
    type: String, // e.g. "10:00"
    required: true
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'All'],
    default: 'All'
  },
  maxBookings: {
    type: Number,
    default: 1
  },
  currentBookings: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Slot', slotSchema);
