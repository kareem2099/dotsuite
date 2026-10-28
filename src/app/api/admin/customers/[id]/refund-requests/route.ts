import { NextResponse } from "next/server";
import { forwardStaff, requireStaff, validObjectId } from "@/lib/staff";

type Context = { params: Promise<{ id: string }> };

/** Log a customer's refund request against one payment (admin only). */
export async function POST(request: Request, { params }: Context) {
  const staff = await requireStaff(request, "admin");
  if ("error" in staff) return staff.error;
  const { id } = await params;
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  const { payment_kind, payment_id, reason } = body ?? {};
  if (!validObjectId(id) || !["order", "invoice"].includes(payment_kind) || typeof payment_id !== "string"
    || !/^\d{1,20}$/.test(payment_id) || typeof reason !== "string" || !reason.trim() || reason.length > 2000) {
    return NextResponse.json({ error: "Choose a payment and write the customer's reason" }, { status: 400 });
  }
  return forwardStaff(`/v1/admin/customers/${id}/refund-requests`, staff.email,
    { method: "POST", body: { payment_kind, payment_id, reason: reason.trim() } });
}
