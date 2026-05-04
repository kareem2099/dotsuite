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

    const res = await rustInternal("/internal/billing/portal", { method: "GET" }, session.user.id);

    if (!res.ok) {
      const text = await res.text();
      console.error("Rust billing/portal error:", res.status, text);
      // 400 = user has no subscription yet
      if (res.status === 400) {
        return NextResponse.json({ error: "No active subscription found" }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to fetch portal URL" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data); // { portal_url: string }
  } catch (error) {
    console.error("Billing portal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
