import { NextResponse } from "next/server";
import { forwardStaff, requireStaff } from "@/lib/staff";

/** Open refund requests, or ?status=all|pending|approved|denied|failed (admin and support). */
export async function GET(request: Request) {
  const staff = await requireStaff(request, "support");
  if ("error" in staff) return staff.error;
  const status = new URL(request.url).searchParams.get("status") ?? "open";
  if (!["open", "all", "pending", "approved", "denied", "failed"].includes(status)) {
    return NextResponse.json({ error: "Unknown status" }, { status: 400 });
  }
  return forwardStaff(`/v1/admin/refund-requests?status=${status}`, staff.email);
}
