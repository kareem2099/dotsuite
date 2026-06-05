import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIP(req.headers);
    const rateLimit = await checkRateLimit(`${ip}_fetch_pricing`, "fetch-pricing", 30, 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": rateLimit.resetIn.toString() } }
      );
    }
    const url = `${process.env.CORE_API_URL}/v1/pricing`;
    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch pricing");
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[api/pricing] error:", err.message);
    return NextResponse.json({ error: "Could not load pricing" }, { status: 500 });
  }
}
