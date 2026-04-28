import { NextResponse } from "next/server";
import { products as staticProducts } from "@/config/products";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { z } from "zod";

// function to escape special characters in search query for regex ddos protection
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// zod schema for validating query parameters for fetching products
const querySchema = z.object({
  category: z.string().optional().default("all"),
  search: z.string().max(100, "Search query is too long").optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10), // max 50 products per page to prevent abuse
});

export async function GET(req: Request) {
  try {
    // Protection against abuse: limit to 60 requests per minute per IP (1 request per second on average)
    const ip = getClientIP(req.headers);
    const rateLimitIdentifier = `${ip}_fetch_products`;
    const rateLimit = await checkRateLimit(rateLimitIdentifier, "fetch-products", 60, 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    // Get query parameters 
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    // Validate with Zod
    const validation = querySchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid parameters" },
        { status: 400 }
      );
    }

    const { category, search, page, limit } = validation.data;

    // Filter the products array
    let filteredProducts = staticProducts;
    
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => {
        const title = p.translations.en.title.toLowerCase();
        const desc = p.translations.en.description.toLowerCase();
        return title.includes(searchLower) || desc.includes(searchLower);
      });
    }

    // Sort by order
    filteredProducts.sort((a, b) => a.order - b.order);

    // calculate how many items to skip based on the current page and limit for pagination
    const skip = (page - 1) * limit;
    const total = filteredProducts.length;
    
    // retrieve the paginated products
    const paginatedProducts = filteredProducts.slice(skip, skip + limit);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}