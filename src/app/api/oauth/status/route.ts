/**
 * GET /api/oauth/status
 *
 * Returns the list of platforms that the current user has connected
 * (i.e., has a stored credential record in Rust/MongoDB).
 *
 * The Rust internal route `/internal/oauth/connections` returns the
 * list of connected platform names for the given user_id.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal } from "@/lib/rust-api";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await rustInternal(
      "/internal/oauth/connections",
      { method: "GET" },
      session.user.id
    );

    if (!res.ok) {
      // If the Rust route doesn't exist yet, return an empty list gracefully
      if (res.status === 404) {
        return NextResponse.json({ connected_platforms: [] });
      }
      const text = await res.text();
      console.error(`[OAuth] status error: ${res.status} — ${text}`);
      return NextResponse.json({ connected_platforms: [] });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[OAuth] /api/oauth/status error:", error);
    // Return empty list on error so the UI degrades gracefully
    return NextResponse.json({ connected_platforms: [] });
  }
}
