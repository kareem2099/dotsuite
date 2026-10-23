import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal } from "@/lib/rust-api";
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await rustInternal("/internal/billing/plans");
  if (!response.ok) return NextResponse.json({ error: "Plans are temporarily unavailable" }, { status: 503 });
  return NextResponse.json(await response.json());
}
