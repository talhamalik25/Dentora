import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITimeRange {
  start: string; // e.g. "09:00"
  end: string;   // e.g. "17:00"
}

export interface IDaySchedule {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  intervals: ITimeRange[];
}

export interface IScheduleException {
  localDate: string; // "YYYY-MM-DD"
  intervals: ITimeRange[]; // empty array means closed/off
}

export interface ISchedule extends Document {
  dentistId: string;
  timeZone: string;
  weekly: IDaySchedule[];
  exceptions: IScheduleException[];
  createdAt: Date;
  updatedAt: Date;
}

const TimeRangeSchema = new Schema<ITimeRange>(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const DayScheduleSchema = new Schema<IDaySchedule>(
  {
    dayOfWeek: { type: Number, required: true },
    intervals: [TimeRangeSchema],
  },
  { _id: false }
);

const ScheduleExceptionSchema = new Schema<IScheduleException>(
  {
    localDate: { type: String, required: true },
    intervals: [TimeRangeSchema],
  },
  { _id: false }
);

const ScheduleSchema = new Schema<ISchedule>(
  {
    dentistId: { type: String, required: true, unique: true },
    timeZone: { type: String, required: true, default: "UTC" },
    weekly: [DayScheduleSchema],
    exceptions: [ScheduleExceptionSchema],
  },
  { timestamps: true }
);

export const ScheduleModel: Model<ISchedule> =
  mongoose.models.Schedule || mongoose.model<ISchedule>("Schedule", ScheduleSchema);
