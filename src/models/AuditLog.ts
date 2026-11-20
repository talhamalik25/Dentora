import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  entityType: string;
  entityId: string;
  actorType: "patient" | "staff" | "system";
  actorId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true },
    actorType: { type: String, enum: ["patient", "staff", "system"], required: true },
    actorId: { type: String },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLogModel: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
