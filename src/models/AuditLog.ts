import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  email?: string;
  action:
    | "LOGIN"
    | "LOGIN_FAILED"
    | "LOGOUT"
    | "PASSWORD_CHANGE"
    | "PASSWORD_RESET"
    | "PROFILE_UPDATE"
    | "ACCOUNT_DELETE"
    | "EMAIL_VERIFIED"
    | "REGISTER"
    | "OAUTH_LINK";
  status: "SUCCESS" | "FAILED" | "PENDING";
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    email: { type: String, index: true },
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGIN_FAILED",
        "LOGOUT",
        "PASSWORD_CHANGE",
        "PASSWORD_RESET",
        "PROFILE_UPDATE",
        "ACCOUNT_DELETE",
        "EMAIL_VERIFIED",
        "REGISTER",
        "OAUTH_LINK",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "SUCCESS",
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    details: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Index for fast querying by user and date
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ email: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
