import crypto from "node:crypto";
import { RecordBase } from "@/lib/records";
import { getPool } from "@/lib/postgres";

/**
 * One row per email the app tried to send. Core deletes rows after 90 days
 * (expire_records in dotsuite-core/src/db.rs); the collection needs Core migration 0005.
 * The address itself is never stored: only a SHA-256 of it (to look up "did user X get
 * the email?") and its domain (to spot one provider rejecting us).
 */
export default class EmailLog extends RecordBase {
  static collection = "emaillogs";
  static updatedTimestamp = false;

  declare kind: string;
  declare locale?: string;
  declare recipientHash: string;
  declare recipientDomain: string;
  declare status: "SENT" | "FAILED";
  declare transport: "resend" | "smtp" | "console" | "none";
  declare messageId?: string;
  declare error?: string;
  declare durationMs: number;

  static hashRecipient(email: string): string {
    return crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
  }

  /** Remove every log row for an address (account deletion) */
  static async deleteForRecipient(email: string): Promise<void> {
    await getPool().query(
      "DELETE FROM ds_documents WHERE collection=$1 AND data->>'recipientHash'=$2",
      [EmailLog.collection, EmailLog.hashRecipient(email)]
    );
  }
}
