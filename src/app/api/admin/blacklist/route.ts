import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim());

function isAdmin(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}

// ── POST /api/admin/blacklist ─────────────────────────────────────────────────
// Body: { user_id, reason, source_post_id? }

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const res = await fetch(`${process.env.CORE_API_URL}/v1/admin/blacklist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Secret": process.env.INTERNAL_SECRET!,
      "X-User-Id": "admin",
    },
    body: JSON.stringify({
      ...body,
      banned_by_email: session!.user!.email,
    }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// ── GET /api/admin/blacklist ──────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "50";

  const res = await fetch(
    `${process.env.CORE_API_URL}/v1/admin/banned?page=${page}&limit=${limit}`,
    {
      headers: {
        "X-Internal-Secret": process.env.INTERNAL_SECRET!,
        "X-User-Id": "admin",
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// ── DELETE /api/admin/blacklist/:user_id ──────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.CORE_API_URL}/v1/admin/blacklist/${userId}`,
    {
      method: "DELETE",
      headers: {
        "X-Internal-Secret": process.env.INTERNAL_SECRET!,
        "X-User-Id": "admin",
      },
    }
  );

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
