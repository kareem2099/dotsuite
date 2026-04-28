import AuditLog from "@/models/AuditLog";

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
    await AuditLog.create(data);
  } catch (err) {
    console.error("Failed to create audit log:", err);
  }
}
