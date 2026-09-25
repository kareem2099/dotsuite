import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { getProductDetails } from "@/lib/productData";
import { z } from "zod";

const productSlugSchema = z.object({
  slug: z.string().min(1).max(100),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Validate slug
    const validation = productSlugSchema.safeParse({ slug });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid product slug" },
        { status: 400 }
      );
    }

    // 🛡️ Rate Limiting (30 requests per minute per IP for ALL products)
    const ip = getClientIP(req.headers);
    const rateLimitIdentifier = `${ip}_product_detail`;
    const rateLimit = await checkRateLimit(rateLimitIdentifier, "fetch-product-detail", 30, 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const data = await getProductDetails(slug);
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}