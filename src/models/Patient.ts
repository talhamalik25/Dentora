import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatient extends Document {
  name: string;
  email: string;
  phone?: string;
  manageToken?: string;
  manageTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    manageToken: { type: String, index: true },
    manageTokenExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export const PatientModel: Model<IPatient> =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
