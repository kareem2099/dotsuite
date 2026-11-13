// Resend delivery webhooks: signature check (Resend signs with Svix) and EmailLog updates.

import crypto from "node:crypto";
import EmailLog, { DELIVERY_RANK, type DeliveryStatus } from "@/models/EmailLog";
import { redactAddresses } from "@/lib/email";

/** Reject deliveries whose timestamp is further than this from now (replay protection) */
const TOLERANCE_SECONDS = 5 * 60;

export interface SvixHeaders {
  id: string | null;
  timestamp: string | null;
  signature: string | null;
}

/**
 * Verify a Svix-signed webhook. The secret is the "whsec_..." value from the Resend
 * dashboard; the signed content is "<id>.<timestamp>.<raw body>" (HMAC-SHA256, base64),
 * and the header may carry several space-separated "v1,<signature>" entries.
 */
export function verifySvixSignature(
  secret: string,
  { id, timestamp, signature }: SvixHeaders,
  rawBody: string,
  nowSeconds = Math.floor(Date.now() / 1000)
): boolean {
  if (!id || !timestamp || !signature) return false;

  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt) || Math.abs(nowSeconds - sentAt) > TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret, "base64");
  const expected = crypto.createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest();

  return signature.split(" ").some((entry) => {
    const [version, value] = entry.split(",", 2);
    if (version !== "v1" || !value) return false;
    const candidate = Buffer.from(value, "base64");
    return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
  });
}

const EVENT_STATUS: Record<string, DeliveryStatus> = {
  "email.delivery_delayed": "DELAYED",
  "email.delivered": "DELIVERED",
  "email.failed": "FAILED",
  "email.bounced": "BOUNCED",
  "email.complained": "COMPLAINED",
};

export interface ResendEvent {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    bounce?: { type?: string; subType?: string; message?: string };
    failed?: { reason?: string };
  };
}

export type ApplyResult = "updated" | "ignored-type" | "unknown-email" | "stale";

/** Record one delivery event on the matching EmailLog row */
export async function applyResendEvent(event: ResendEvent): Promise<ApplyResult> {
  const status = event.type ? EVENT_STATUS[event.type] : undefined;
  if (!status) return "ignored-type"; // sent, opened, clicked, domain.* ...

  const messageId = event.data?.email_id;
  if (!messageId) return "unknown-email";

  // The Resend account also sends for other projects; their emails have no row here
  const log = await EmailLog.findOne({ messageId });
  if (!log) return "unknown-email";

  if (log.deliveryStatus && DELIVERY_RANK[log.deliveryStatus] > DELIVERY_RANK[status]) return "stale";

  const detail = event.data?.bounce?.message ?? event.data?.failed?.reason;
  log.deliveryStatus = status;
  log.deliveryUpdatedAt = event.created_at ? new Date(event.created_at) : new Date();
  if (event.data?.bounce?.type) {
    log.bounceType = [event.data.bounce.type, event.data.bounce.subType].filter(Boolean).join("/");
  }
  if (detail) log.deliveryDetail = redactAddresses(detail);
  await log.save();
  return "updated";
}
