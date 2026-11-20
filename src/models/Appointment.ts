import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  reference: string;
  patientId: mongoose.Types.ObjectId;
  dentistId: string;
  serviceId: string;
  startsAtUtc: Date;
  endsAtUtc: Date;
  timeZone: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no-show";
  rescheduleCount: number;
  cancellationReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    reference: { type: String, required: true, unique: true, uppercase: true, trim: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    dentistId: { type: String, required: true, index: true },
    serviceId: { type: String, required: true },
    startsAtUtc: { type: Date, required: true, index: true },
    endsAtUtc: { type: Date, required: true },
    timeZone: { type: String, required: true, default: "UTC" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
      default: "confirmed",
      index: true,
    },
    rescheduleCount: { type: Number, default: 0 },
    cancellationReason: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// Compound index for querying appointments for a dentist across date ranges
AppointmentSchema.index({ dentistId: 1, startsAtUtc: 1 });

export const AppointmentModel: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
