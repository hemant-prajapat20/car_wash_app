import mongoose, { Schema, Document, Types } from 'mongoose';
import crypto from 'crypto';

export interface ICustomerPlan extends Document {
  customer: Types.ObjectId;
  vendor: Types.ObjectId;
  servicePlan: Types.ObjectId;
  vehicle: {
    make: string;
    model: string;
    plateNumber: string;
  };
  totalServices: number;
  remainingServices: number;
  purchasedAt: Date;
  expiresAt: Date;
  status: 'PendingPayment' | 'Active' | 'Completed' | 'Expired' | 'Suspended';
  paymentStatus: 'Pending' | 'Success' | 'Failed';
  paymentMode: 'Online';
  qrToken: string;
  serviceHistory: Array<{
    usedAt: Date;
    vendor: Types.ObjectId;
    notes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerPlanSchema = new Schema<ICustomerPlan>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    servicePlan: { type: Schema.Types.ObjectId, ref: 'ServicePlan', required: true },
    vehicle: {
      make: { type: String, required: true },
      model: { type: String, required: true },
      plateNumber: { type: String, required: true }
    },
    totalServices: { type: Number, required: true },
    remainingServices: { type: Number, required: true },
    purchasedAt: { type: Date },
    expiresAt: { type: Date },
    status: {
      type: String,
      enum: ['PendingPayment', 'Active', 'Completed', 'Expired', 'Suspended'],
      default: 'PendingPayment'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Success', 'Failed'],
      default: 'Pending'
    },
    paymentMode: {
      type: String,
      enum: ['Online'],
      default: 'Online'
    },
    qrToken: { type: String, required: true, unique: true },
    serviceHistory: [
      {
        usedAt: { type: Date, required: true, default: Date.now },
        vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        notes: { type: String }
      }
    ]
  },
  { timestamps: true }
);

// Generate QR token before saving if not present
CustomerPlanSchema.pre('validate', function (next: any) {
  if (!this.qrToken) {
    this.qrToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

export default mongoose.model<ICustomerPlan>('CustomerPlan', CustomerPlanSchema);
