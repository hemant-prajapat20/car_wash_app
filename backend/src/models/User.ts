import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  userId: string;
  vendorId?: string; 
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'customer' | 'vendor' | 'admin' | 'superAdmin';
  companyName?: string;
  businessLocation?: string;
  profileImage: string;
  isActive: boolean;
  isVerified: boolean;
  loyaltyPoints: number;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    userId: { type: String, unique: true },
    vendorId: { 
      type: String, 
      unique: true, 
      sparse: true, 
      index: true 
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { 
      type: String, 
      enum: ['customer', 'vendor', 'admin', 'superAdmin'], 
      default: 'customer' 
    },
    companyName: { type: String },
    businessLocation: { type: String },
    profileImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    loyaltyPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving - Using async without 'next' to avoid SaveOptions conflict
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Auto-generate Sequential userId only - Using async without 'next'
userSchema.pre('save', async function () {
  if (this.isNew && !this.userId) {
    const UserModel = this.constructor as any;
    const lastUser = await UserModel.findOne({ userId: { $regex: /^USR-/ } }).sort({ createdAt: -1 });
    let nextUserNum = 1001;
    if (lastUser && lastUser.userId) {
      const match = lastUser.userId.match(/-(\d+)/);
      if (match) {
        nextUserNum = parseInt(match[1]) + 1;
      }
    }
    this.userId = `USR-${nextUserNum}`;
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
