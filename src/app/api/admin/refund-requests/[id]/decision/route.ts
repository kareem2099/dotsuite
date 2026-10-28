import { NextResponse } from "next/server";
import { forwardStaff, requireStaff, validObjectId } from "@/lib/staff";

type Context = { params: Promise<{ id: string }> };

/** Approve (full refund through Lemon Squeezy) or deny a refund request, with a reason (admin only). */
export async function POST(request: Request, { params }: Context) {
  const staff = await requireStaff(request, "admin");
  if ("error" in staff) return staff.error;
  const { id } = await params;
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  const { decision, note } = body ?? {};
  if (!validObjectId(id) || !["approve", "deny"].includes(decision) || typeof note !== "string"
    || !note.trim() || note.length > 2000) {
    return NextResponse.json({ error: "Choose approve or deny and write why" }, { status: 400 });
  }
  return forwardStaff(`/v1/admin/refund-requests/${id}/decision`, staff.email,
    { method: "POST", body: { decision, note: note.trim() } });
}
