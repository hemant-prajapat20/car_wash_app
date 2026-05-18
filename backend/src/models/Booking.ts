import mongoose, { Schema, Document } from 'mongoose';

export type BookingStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export interface IBooking extends Document {
  bookingId: string;
  customer: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  vehicle: {
    make: string;
    model: string;
    plateNumber: string;
  };
  service: {
    name: string;
    price: number;
    duration: number;
  };
  slot: {
    date: Date;
    time: string;
  };
  status: BookingStatus;
  paymentStatus: 'Pending' | 'Success' | 'Failed';
  transactionId?: string;
  totalAmount: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  razorpayPaymentId?: string;
  paymentMode: 'Online' | 'Cash';
  serviceType: 'Shop' | 'Home';
  homeAddress?: {
    address: string;
    city: string;
  };
}

const BookingSchema: Schema = new Schema({
  bookingId: { type: String, unique: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    plateNumber: { type: String, required: true }
  },
  service: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }
  },
  slot: {
    date: { type: Date, required: true },
    time: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  paymentStatus: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  transactionId: { type: String },
  razorpayPaymentId: { type: String },
  totalAmount: { type: Number, required: true },
  completedAt: { type: Date },
  paymentMode: { type: String, enum: ['Online', 'Cash'], default: 'Online' },
  serviceType: { type: String, enum: ['Shop', 'Home'], default: 'Shop' },
  homeAddress: {
    address: { type: String },
    city: { type: String }
  }
}, { timestamps: true });

// Auto-generate BookingId
BookingSchema.pre('save', async function(this: any) {
  if (!this.bookingId) {
    this.bookingId = `CHK-BK-${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  }
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
