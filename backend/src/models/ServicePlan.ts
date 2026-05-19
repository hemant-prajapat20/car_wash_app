import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IServicePlan extends Document {
  vendor: Types.ObjectId;
  title: string;
  description: string;
  servicesIncluded: number;
  price: number;
  tenure: {
    value: number;
    unit: 'Days' | 'Months';
  };
  supportedVehicles: string[];
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServicePlanSchema = new Schema<IServicePlan>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    servicesIncluded: { type: Number, required: true },
    price: { type: Number, required: true },
    tenure: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ['Days', 'Months'], required: true }
    },
    supportedVehicles: [{ type: String }],
    features: [{ type: String }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IServicePlan>('ServicePlan', ServicePlanSchema);
