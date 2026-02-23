import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1. Read the request body as text to verify the signature
    const bodyText = await req.text();
    
    // 2. Get signature and event type from GitHub headers
    const signature = req.headers.get("x-hub-signature-256");
    const event = req.headers.get("x-github-event");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      console.error("GITHUB_WEBHOOK_SECRET is not set in .env");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 3. Verify the webhook signature using timing-safe comparison (prevents timing attacks)
    const expectedSignature = `sha256=${crypto
      .createHmac("sha256", secret)
      .update(bodyText)
      .digest("hex")}`;

    // Use timingSafeEqual to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    
    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 4. Parse the payload after verification
    const payload = JSON.parse(bodyText);

    // 5. Handle only push and release events
    if (event === "push" || event === "release") {
      const repoFullName = payload.repository?.full_name;

      if (repoFullName) {
        try {
          // Revalidate the cache for this repository
          revalidateTag(`github-${repoFullName}`, "fetch");
          console.log(`✅ Cache automatically cleared for: github-${repoFullName}`);
        } catch (err) {
          console.error("Failed to revalidate tag:", err);
        }
      }
    } else if (event === "ping") {
      // GitHub sends a ping event when setting up the webhook
      return NextResponse.json({ message: "Pong! Webhook is successfully connected." }, { status: 200 });
    }

    return NextResponse.json({ success: true, message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("GitHub Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
