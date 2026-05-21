import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'customer' | 'vendor' | 'admin' | 'superAdmin';

export interface IUser extends Document {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  matchPassword(password: string): Promise<boolean>;
  
  // Vendor Specific Fields
  vendorId?: string;
  companyName?: string;
  businessLocation?: string;
  serviceArea?: string;
  // New subscription & payment fields
  planName?: string;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  subscriptionStatus?: string;
  paymentStatus?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  transactionId?: string;
  amountPaid?: number;
  isHomeServiceAvailable?: boolean;
  services?: Array<{
    name: string;
    price: number;
    duration: string;
    description: string;
  }>;
  gallery?: Array<{
    url: string;
    publicId: string;
  }>;
  availability?: {
    isAvailable: boolean;
    reason?: string;
    unavailableUntil?: Date;
  };
  
  // Customer Specific Fields
  vehicles?: Array<{
    make: string;
    model: string;
    year: number;
    plateNumber: string;
  }>;
  addresses?: Array<{
    label: string;
    address: string;
    city: string;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'] 
  },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'vendor', 'admin', 'superAdmin'], default: 'customer' },
  isActive: { type: Boolean, default: true },
  
  // Vendor Fields
  vendorId: { type: String, unique: true, sparse: true },
  companyName: { type: String },
  businessLocation: { type: String },
  serviceArea: { type: String },
  // Subscription & Payment fields
  planName: { type: String },
  subscriptionStart: { type: Date },
  subscriptionEnd: { type: Date },
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'expired'], default: 'inactive' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  transactionId: { type: String },
  amountPaid: { type: Number },
  paymentCompleted: { type: Boolean, default: false },
  isHomeServiceAvailable: { type: Boolean, default: false },
  services: [{
    name: String,
    price: Number,
    duration: String,
    description: String
  }],
  gallery: [{
    url: String,
    publicId: String
  }],
  availability: {
    isAvailable: { type: Boolean, default: true },
    reason: { type: String },
    unavailableUntil: { type: Date }
  },
  
  // Customer Fields
  vehicles: [{
    make: String,
    model: String,
    year: Number,
    plateNumber: String
  }],
  addresses: [{
    label: String,
    address: String,
    city: String
  }]
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(this: any) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Compare password
UserSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Auto-generate VendorId for vendors
UserSchema.pre('save', async function(this: any) {
  if (this.role === 'vendor' && !this.vendorId) {
    this.vendorId = `CHK-VND-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
});

export default mongoose.model<IUser>('User', UserSchema);
