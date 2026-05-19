import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  receiverId: mongoose.Types.ObjectId;
  receiverRole: 'customer' | 'vendor' | 'admin' | 'superAdmin';
  vendorId?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  bookingId?: string;
  type: 
    | 'booking_created'
    | 'booking_confirmed'
    | 'booking_cancelled'
    | 'booking_completed'
    | 'payment_success'
    | 'payment_failed'
    | 'slot_updated'
    | 'service_updated'
    | 'promotion'
    | 'system_alert'
    | 'vendor_registration'
    | 'worker_assignment';
  status: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    receiverId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    receiverRole: { 
      type: String, 
      required: true, 
      enum: ['customer', 'vendor', 'admin', 'superAdmin'] 
    },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    bookingId: { type: String },
    type: { 
      type: String, 
      required: true,
      enum: [
        'booking_created',
        'booking_confirmed',
        'booking_cancelled',
        'booking_completed',
        'payment_success',
        'payment_failed',
        'slot_updated',
        'service_updated',
        'promotion',
        'system_alert',
        'vendor_registration',
        'worker_assignment'
      ]
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for faster queries
NotificationSchema.index({ receiverId: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
