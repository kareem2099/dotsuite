import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustProxy } from "@/lib/rust-api";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const status = searchParams.get("status") || "";

    const qs = new URLSearchParams({ page, limit });
    if (status) qs.set("status", status);

    const res = await rustProxy(`/v1/posts?${qs}`, { method: "GET" }, session.user.id);

    if (!res.ok) {
      const text = await res.text();
      console.error("Rust posts GET error:", res.status, text);
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Posts GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
