import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { parseRustError, rustInternal } from "@/lib/rust-api";

async function forward(request: NextRequest, update: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (update && request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  let product: unknown;
  let action: unknown;
  if (update) {
    let body: Record<string, unknown>;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    if (!body || typeof body !== "object" || Object.keys(body).some(key => !["product", "action"].includes(key))) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    ({ product, action } = body);
  } else { product = request.nextUrl.searchParams.get("product"); }
  if (!["dotshare", "dotscramble"].includes(String(product)) || (update && !["cancel", "resume"].includes(String(action)))) {
    return NextResponse.json({ error: "Invalid product or subscription action" }, { status: 400 });
  }
  try {
    const path = update ? "/internal/billing/subscription" : `/internal/billing/subscription?product=${product}`;
    const response = await rustInternal(path, update ? {
      method: "POST", body: JSON.stringify({ product, action }),
    } : { method: "GET" }, session.user.id);
    if (!response.ok) {
      return NextResponse.json({ error: parseRustError(await response.text(), "Unable to load subscription management") }, { status: response.status });
    }
    return NextResponse.json(await response.json(), { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Billing service is unavailable. Refresh the subscription status before trying again." }, { status: 502 });
  }
}

export const GET = (request: NextRequest) => forward(request, false);
export const POST = (request: NextRequest) => forward(request, true);
