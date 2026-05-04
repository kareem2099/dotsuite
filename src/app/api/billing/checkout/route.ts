import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal } from "@/lib/rust-api";
import { z } from "zod";

const checkoutSchema = z.object({
  variant_id: z.number().int().positive(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid variant_id" },
        { status: 400 }
      );
    }

    const res = await rustInternal(
      "/internal/billing/checkout",
      {
        method: "POST",
        body: JSON.stringify({ variant_id: validation.data.variant_id }),
      },
      session.user.id
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Rust billing/checkout error:", res.status, text);
      return NextResponse.json({ error: "Failed to create checkout" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data); // { checkout_url: string }
  } catch (error) {
    console.error("Billing checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
