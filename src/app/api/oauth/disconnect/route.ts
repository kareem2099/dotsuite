/**
 * DELETE /api/oauth/disconnect?platform=<platform>
 *
 * Disconnects a social media account by deleting the stored OAuth credential
 * from Rust/MongoDB via the internal API.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal } from "@/lib/rust-api";

const ALLOWED_PLATFORMS = ["telegram", "x", "linkedin", "reddit"] as const;

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const platform = req.nextUrl.searchParams.get("platform");

    if (!platform || !ALLOWED_PLATFORMS.includes(platform as (typeof ALLOWED_PLATFORMS)[number])) {
      return NextResponse.json(
        { error: `Invalid platform. Allowed: ${ALLOWED_PLATFORMS.join(", ")}` },
        { status: 400 }
      );
    }

    const res = await rustInternal(
      `/internal/oauth/disconnect?platform=${platform}`,
      { method: "DELETE" },
      session.user.id
    );

    if (!res.ok) {
      // 404 means credential didn't exist — treat as success
      if (res.status === 404) {
        return NextResponse.json({ status: "disconnected" });
      }
      const text = await res.text();
      console.error(`[OAuth] disconnect error: ${res.status} — ${text}`);
      return NextResponse.json({ error: "Failed to disconnect account" }, { status: res.status });
    }

    return NextResponse.json({ status: "disconnected" });
  } catch (error) {
    console.error("[OAuth] /api/oauth/disconnect error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
