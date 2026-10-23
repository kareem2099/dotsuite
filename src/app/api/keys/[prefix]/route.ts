import { NextResponse } from "next/server";
import { forwardKeyRequest, validKeyPrefix } from "@/lib/key-api";
type Context = { params: Promise<{ prefix: string }> };
export async function PATCH(request: Request, { params }: Context) {
  const { prefix } = await params;
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  const label = body?.label;
  if (!validKeyPrefix(prefix) || typeof label !== "string" || !label.trim() || label.trim().length > 100) {
    return NextResponse.json({ error: "Invalid key or name" }, { status: 400 });
  }
  return forwardKeyRequest(request, `/internal/keys/${prefix}`, "PATCH", { label: label.trim() });
}
export async function DELETE(request: Request, { params }: Context) {
  const { prefix } = await params;
  if (!validKeyPrefix(prefix)) return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  return forwardKeyRequest(request, `/internal/keys/${prefix}`, "DELETE");
}
