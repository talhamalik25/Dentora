import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISlotOccupancy extends Document {
  dentistId: string;
  slotUtc: Date;
  appointmentId: mongoose.Types.ObjectId;
  isBuffer: boolean;
  createdAt: Date;
}

const SlotOccupancySchema = new Schema<ISlotOccupancy>(
  {
    dentistId: { type: String, required: true },
    slotUtc: { type: Date, required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    isBuffer: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Concurrency-safety: unique compound index on (dentistId, slotUtc) guarantees that
// NO two appointments can ever overlap any 15-minute slot unit, regardless of start time or duration.
SlotOccupancySchema.index({ dentistId: 1, slotUtc: 1 }, { unique: true });
SlotOccupancySchema.index({ appointmentId: 1 });

export const SlotOccupancyModel: Model<ISlotOccupancy> =
  mongoose.models.SlotOccupancy ||
  mongoose.model<ISlotOccupancy>("SlotOccupancy", SlotOccupancySchema);
