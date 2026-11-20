import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISlotOccupancy extends Document {
  dentistId: string;
  startUtc: Date;
  endUtc: Date;
  appointmentId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SlotOccupancySchema = new Schema<ISlotOccupancy>(
  {
    dentistId: { type: String, required: true },
    startUtc: { type: Date, required: true },
    endUtc: { type: Date, required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Concurrency-safety: unique compound index prevents overlapping bookings at the same start time
SlotOccupancySchema.index({ dentistId: 1, startUtc: 1 }, { unique: true });

export const SlotOccupancyModel: Model<ISlotOccupancy> =
  mongoose.models.SlotOccupancy ||
  mongoose.model<ISlotOccupancy>("SlotOccupancy", SlotOccupancySchema);
