import { NextResponse } from "next/server";
import { forwardKeyRequest } from "@/lib/key-api";

type Context = { params: Promise<{ machineId: string }> };

/** Free a device slot; that computer's DotScramble returns to Free at its next check. */
export async function DELETE(request: Request, { params }: Context) {
  const { machineId } = await params;
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(machineId)) {
    return NextResponse.json({ error: "Invalid device" }, { status: 400 });
  }
  return forwardKeyRequest(request, `/internal/dotscramble/devices/${machineId}`, "DELETE");
}
