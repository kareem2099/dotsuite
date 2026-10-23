import { NextResponse } from "next/server";
import { forwardKeyRequest } from "@/lib/key-api";

export async function GET(request: Request) {
  const history = new URL(request.url).searchParams.get("include_inactive") === "true";
  return forwardKeyRequest(request, `/internal/keys${history ? "?include_inactive=true" : ""}`, "GET");
}
export async function POST(request: Request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  const { label, scopes, expires_in_days, source } = body ?? {};
  if (typeof label !== "string" || !label.trim() || label.trim().length > 100
    || (scopes !== undefined && (!Array.isArray(scopes) || !scopes.every(s => typeof s === "string")))
    || (expires_in_days != null && ![30,90,180,365].includes(expires_in_days))
    || (source !== undefined && !["dashboard","vscode","dotscramble"].includes(source))) {
    return NextResponse.json({ error: "Invalid key name, permissions, expiry or source" }, { status: 400 });
  }
  return forwardKeyRequest(request, "/internal/keys/generate", "POST", { label: label.trim(), scopes, expires_in_days, source });
}
