import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rustInternal } from "@/lib/rust-api";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim());

function isAdmin(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}

// ── GET /api/admin/refunds ───────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "50";

  const res = await fetch(
    `${process.env.CORE_API_URL}/v1/admin/refunds?page=${page}&limit=${limit}`,
    {
      headers: {
        "X-Internal-Secret": process.env.INTERNAL_API_SECRET!,
        "X-User-Id": "admin",
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
