import mongoose, { Schema, Document } from 'mongoose';

// Slot Model
export interface ISlot extends Document {
  vendor: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  capacity: number;
  booked: number;
  isActive: boolean;
}

const SlotSchema: Schema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  capacity: { type: Number, default: 1 },
  booked: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Notification Model
export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  role: string;
  message: string;
  type: 'booking' | 'payment' | 'alert' | 'registration';
  read: boolean;
}

const NotificationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['booking', 'payment', 'alert', 'registration'], default: 'alert' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

// Review Model
export interface IReview extends Document {
  customer: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const ReviewSchema: Schema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

export const Slot = mongoose.model<ISlot>('Slot', SlotSchema);
export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export const Review = mongoose.model<IReview>('Review', ReviewSchema);
