import { NextResponse } from "next/server";
import { forwardStaff, requireStaff, validObjectId } from "@/lib/staff";

type Context = { params: Promise<{ id: string }> };

/** Payments, devices, usage, activity and refund requests for one customer (admin and support). */
export async function GET(request: Request, { params }: Context) {
  const staff = await requireStaff(request, "support");
  if ("error" in staff) return staff.error;
  const { id } = await params;
  if (!validObjectId(id)) return NextResponse.json({ error: "Invalid customer" }, { status: 400 });
  return forwardStaff(`/v1/admin/customers/${id}/dotscramble`, staff.email);
}
