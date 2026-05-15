import mongoose, { Schema, Document } from 'mongoose';

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

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
