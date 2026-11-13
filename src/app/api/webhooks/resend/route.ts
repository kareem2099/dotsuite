import { NextResponse } from "next/server";
import { applyResendEvent, verifySvixSignature, type ResendEvent } from "@/lib/resendWebhook";

// Resend → delivery events (delivered, delayed, bounced, suppressed, complained, failed) → EmailLog.
// Configure in Resend: Webhooks → https://dotsuite.dev/api/webhooks/resend, then put the
// signing secret in RESEND_WEBHOOK_SECRET.
export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RESEND_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  // Verify against the raw body: re-serialized JSON would not match the signature
  const rawBody = await req.text();
  const valid = verifySvixSignature(
    secret,
    {
      id: req.headers.get("svix-id"),
      timestamp: req.headers.get("svix-timestamp"),
      signature: req.headers.get("svix-signature"),
    },
    rawBody
  );
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const result = await applyResendEvent(event);
    return NextResponse.json({ received: true, result });
  } catch (error) {
    // 500 makes Resend retry later, e.g. while the database is briefly unavailable
    console.error("Resend webhook error:", error);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
