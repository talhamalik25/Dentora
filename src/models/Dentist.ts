import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDentist extends Document {
  name: string;
  focus: string;
  summary: string;
  serviceIds: string[];
  portrait: string;
  portraitAlt: string;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const DentistSchema = new Schema<IDentist>(
  {
    name: { type: String, required: true },
    focus: { type: String, required: true },
    summary: { type: String, required: true },
    serviceIds: { type: [String], default: [] },
    portrait: { type: String, required: true },
    portraitAlt: { type: String, required: true },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const DentistModel: Model<IDentist> =
  mongoose.models.Dentist || mongoose.model<IDentist>("Dentist", DentistSchema);
