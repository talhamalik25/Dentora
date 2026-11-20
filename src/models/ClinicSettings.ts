import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClinicSettings extends Document {
  name: string;
  slug: string;
  timeZone: string;
  address: string;
  phone: string;
  email: string;
  bookingMinNoticeHours: number;
  bookingMaxDaysAhead: number;
  cancellationCutoffHours: number;
  slotIntervalMinutes: number;
  maxPatientReschedules: number;
  instantConfirmation: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClinicSettingsSchema = new Schema<IClinicSettings>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    timeZone: { type: String, required: true, default: "UTC" },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    bookingMinNoticeHours: { type: Number, default: 2 },
    bookingMaxDaysAhead: { type: Number, default: 60 },
    cancellationCutoffHours: { type: Number, default: 12 },
    slotIntervalMinutes: { type: Number, default: 15 },
    maxPatientReschedules: { type: Number, default: 2 },
    instantConfirmation: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ClinicSettingsModel: Model<IClinicSettings> =
  mongoose.models.ClinicSettings ||
  mongoose.model<IClinicSettings>("ClinicSettings", ClinicSettingsSchema);
