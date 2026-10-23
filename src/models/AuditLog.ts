import { RecordBase } from "@/lib/records";
export default class AuditLog extends RecordBase {
  static collection = "auditlogs";
  static references = ["userId"];
  static updatedTimestamp = false;
  declare userId?: string;
  declare email?: string;
  declare action: string;
  declare status: "SUCCESS" | "FAILED" | "PENDING";
  declare details?: string;
}
