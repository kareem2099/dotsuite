import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { parseRustError, rustInternal } from "@/lib/rust-api";

const privateHeaders = { "Cache-Control": "private, no-store" };
export async function forwardKeyRequest(request: Request, path: string, method: string, body?: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  if (method !== "GET" && request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403, headers: privateHeaders });
  }
  try {
    const response = await rustInternal(path, { method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) }, session.user.id);
    if (!response.ok) return NextResponse.json({ error: parseRustError(await response.text(), "Unable to manage API keys") }, { status: response.status, headers: privateHeaders });
    if (response.status === 204) return new NextResponse(null, { status: 204, headers: privateHeaders });
    return NextResponse.json(await response.json(), { status: response.status, headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Key service unavailable. Refresh the list before trying again." }, { status: 502, headers: privateHeaders });
  }
}
export function validKeyPrefix(prefix: string) { return /^ds_prod_[a-f0-9]{8}$/.test(prefix); }
