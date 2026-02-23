import mongoose, { Schema, Document } from "mongoose";

export interface IRateLimit extends Document {
  identifier: string; // IP address or email
  action: string; // e.g., "register", "resend-verification", "login"
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  identifier: { type: String, required: true },
  action: { type: String, required: true },
  count: { type: Number, required: true, default: 1 },
  expiresAt: { type: Date, required: true },
});

// Create compound index for efficient queries
RateLimitSchema.index({ identifier: 1, action: 1 }, { unique: true });

// Create TTL index for expiration
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
