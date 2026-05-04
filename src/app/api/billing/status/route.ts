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

    const res = await rustInternal("/internal/billing/status", { method: "GET" }, session.user.id);

    if (!res.ok) {
      const text = await res.text();
      console.error("Rust billing/status error:", res.status, text);
      return NextResponse.json({ error: "Failed to fetch billing status" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Billing status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
