import AuditLog from "@/models/AuditLog";
import mongoose from "mongoose";

export interface AuditLogData {
  userId?: string;
  email?: string;
  action: string;
  status: "SUCCESS" | "FAILED";
  ip?: string;
  userAgent?: string;
  details?: string;
}

/**
 * Fire-and-forget audit log helper.
 * Shared across all auth API routes.
 */
export async function logAudit(data: AuditLogData): Promise<void> {
  try {
    // Only include userId if it's a valid MongoDB ObjectId (24-char hex).
    // OAuth sessions may temporarily carry a provider ID (e.g. Google numeric ID)
    // before the JWT callback overwrites it with the real MongoDB _id.
    const safeUserId =
      data.userId && mongoose.Types.ObjectId.isValid(data.userId)
        ? data.userId
        : undefined;

    await AuditLog.create({ ...data, userId: safeUserId });
  } catch (err) {
    console.error("Failed to create audit log:", err);
  }
}
