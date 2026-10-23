import { NextResponse } from "next/server";
import { forwardKeyRequest, validKeyPrefix } from "@/lib/key-api";
export async function POST(request: Request, { params }: { params: Promise<{ prefix: string }> }) {
  const { prefix } = await params;
  if (!validKeyPrefix(prefix)) return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  return forwardKeyRequest(request, `/internal/keys/${prefix}/rotate`, "POST");
}
