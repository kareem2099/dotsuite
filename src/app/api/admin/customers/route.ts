import { NextResponse } from "next/server";
import { forwardStaff, requireStaff } from "@/lib/staff";

/** Find a customer by email or account ID (admin and support). */
export async function GET(request: Request) {
  const staff = await requireStaff(request, "support");
  if ("error" in staff) return staff.error;
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!q || q.length > 254) return NextResponse.json({ error: "Search by email or account ID" }, { status: 400 });
  return forwardStaff(`/v1/admin/customers/lookup?q=${encodeURIComponent(q)}`, staff.email);
}
