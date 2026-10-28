import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { staffRole } from "@/lib/staff";

/** Which staff pages the signed-in user may open: { role: "admin" | "support" | null } */
export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({ role: staffRole(session?.user?.email) }, { headers: { "Cache-Control": "private, no-store" } });
}
