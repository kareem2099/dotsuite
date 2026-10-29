import { NextResponse } from "next/server";
import { forwardStaff, requireStaff, validObjectId } from "@/lib/staff";

type Context = { params: Promise<{ id: string; machineId: string }> };

/** Free one of a customer's device slots (admin only; the customer's own limit doesn't apply). */
export async function DELETE(request: Request, { params }: Context) {
  const staff = await requireStaff(request, "admin");
  if ("error" in staff) return staff.error;
  const { id, machineId } = await params;
  if (!validObjectId(id) || !/^[A-Za-z0-9_-]{1,64}$/.test(machineId)) {
    return NextResponse.json({ error: "Invalid customer or device" }, { status: 400 });
  }
  return forwardStaff(`/v1/admin/customers/${id}/devices/${machineId}`, staff.email, { method: "DELETE" });
}
