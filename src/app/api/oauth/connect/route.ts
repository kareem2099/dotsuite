/**
 * POST /api/oauth/connect
 *
 * The "Internal Handshake" — Next.js calls this after successfully exchanging
 * an OAuth authorization code for access/refresh tokens.
 *
 * This route acts as a secure proxy: it authenticates the user via NextAuth
 * session, then forwards the OAuth tokens to the Rust core via the
 * `/internal/oauth/save` endpoint (protected by X-Internal-Secret).
 *
 * The Next.js server NEVER stores tokens — it only relays them to Rust.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal } from "@/lib/rust-api";

export interface ConnectOAuthBody {
  platform: "telegram" | "x" | "linkedin" | "reddit";
  access_token: string;
  refresh_token?: string;
  /** Seconds until access_token expires — defaults to 3600 in Rust if omitted */
  expires_in?: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the caller via NextAuth session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate the request body
    const body: ConnectOAuthBody = await req.json();

    const allowedPlatforms = ["telegram", "x", "linkedin", "reddit"];
    if (!allowedPlatforms.includes(body.platform)) {
      return NextResponse.json(
        { error: `Invalid platform. Allowed: ${allowedPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    if (!body.access_token || typeof body.access_token !== "string") {
      return NextResponse.json(
        { error: "access_token is required and must be a string" },
        { status: 400 }
      );
    }

    // 3. Forward to Rust /internal/oauth/save
    const rustPayload = {
      platform: body.platform,
      access_token: body.access_token,
      ...(body.refresh_token && { refresh_token: body.refresh_token }),
      ...(body.expires_in && { expires_in: body.expires_in }),
    };

    const rustRes = await rustInternal(
      "/internal/oauth/save",
      {
        method: "POST",
        body: JSON.stringify(rustPayload),
      },
      session.user.id
    );

    // 4. Relay Rust's response
    if (!rustRes.ok) {
      const text = await rustRes.text();
      console.error(`[OAuth] Rust /internal/oauth/save error: ${rustRes.status} — ${text}`);
      return NextResponse.json(
        { error: "Failed to save OAuth token in backend" },
        { status: rustRes.status }
      );
    }

    const data = await rustRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[OAuth] /api/oauth/connect error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
