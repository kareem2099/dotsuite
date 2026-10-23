import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal, parseRustError } from "@/lib/rust-api";
import { z } from "zod";

const checkoutSchema = z.object({
  product: z.enum(["dotshare", "dotscramble"]).default("dotshare"),
  tier: z.enum(["pro", "max"]),
  payment_type: z.enum(["subscription", "one_time"]).default("subscription"),
  cycle: z.enum(["monthly", "annually"]),
  locale: z.enum(["en", "ar", "ru", "fr", "de"]).default("en"),
}).refine((data) => data.product !== "dotscramble" || data.tier === "max", {
  message: "Invalid plan",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid variant_id" },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const { product, tier, cycle, locale, payment_type } = validation.data;
    const returnUrl = `${url.origin}/${locale}/dashboard/billing/complete?product=${product}&tier=${tier}&payment_type=${payment_type}`;

    const res = await rustInternal(
      "/internal/billing/checkout",
      {
        method: "POST",
        body: JSON.stringify({ 
          product, tier, cycle, payment_type, locale,
          return_url: returnUrl
        }),
      },
      session.user.id
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Rust billing/checkout error:", res.status);
      return NextResponse.json({ error: res.status < 500
        ? parseRustError(text, "Failed to create checkout")
        : "Checkout is temporarily unavailable. Please try again." }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data); // { checkout_url: string }
  } catch (error) {
    console.error("Billing checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
