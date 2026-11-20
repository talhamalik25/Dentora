import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  slug: string;
  name: string;
  description: string;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    durationMinutes: { type: Number, required: true, default: 30 },
    bufferBeforeMinutes: { type: Number, default: 0 },
    bufferAfterMinutes: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ServiceModel: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
