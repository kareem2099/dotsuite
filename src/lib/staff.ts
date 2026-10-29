import "server-only";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/** admin: everything, including refunds. support: reads customers and evidence only. */
export type StaffRole = "admin" | "support";

const emails = (value?: string) =>
  (value ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

export function staffRole(email?: string | null): StaffRole | null {
  if (!email) return null;
  const e = email.toLowerCase();
  if (emails(process.env.ADMIN_EMAILS).includes(e)) return "admin";
  if (emails(process.env.SUPPORT_EMAILS).includes(e)) return "support";
  return null;
}

const privateHeaders = { "Cache-Control": "private, no-store" };

/** The signed-in staff member, or a 403 response when they lack `needed`. */
export async function requireStaff(request: Request, needed: StaffRole) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  const role = staffRole(email);
  if (!role || (needed === "admin" && role !== "admin")) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403, headers: privateHeaders }) };
  }
  if (request.method !== "GET" && request.headers.get("origin") !== new URL(request.url).origin) {
    return { error: NextResponse.json({ error: "Invalid request origin" }, { status: 403, headers: privateHeaders }) };
  }
  return { email: email!.toLowerCase(), role };
}

/** Call Core's staff endpoints; writes are attributed to the staff member's email. */
export async function forwardStaff(path: string, staffEmail: string, init: { method?: string; body?: unknown } = {}) {
  try {
    const res = await fetch(`${process.env.CORE_API_URL}${path}`, {
      method: init.method ?? "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": process.env.INTERNAL_API_SECRET!,
        "X-Staff-Email": staffEmail,
      },
      ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
    });
    const text = await res.text();
    let data: unknown = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { error: text.slice(0, 200) }; }
    // Core errors look like {"error":{"code","message"}}; the pages want a plain message
    const err = (data as { error?: { message?: string } | string } | null)?.error;
    if (!res.ok) {
      const message = typeof err === "string" ? err : err?.message ?? "Request failed";
      return NextResponse.json({ error: message }, { status: res.status, headers: privateHeaders });
    }
    if (res.status === 204) return new NextResponse(null, { status: 204, headers: privateHeaders });
    return NextResponse.json(data, { status: res.status, headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Core is unavailable. Try again." }, { status: 502, headers: privateHeaders });
  }
}

export function validObjectId(id: string) {
  return /^[a-f0-9]{24}$/.test(id);
}
