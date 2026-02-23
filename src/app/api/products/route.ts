import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
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

    await connectDB();

    // Build the query object based on category and search parameters
    const query: Record<string, unknown> = {};
    
    if (category && category !== "all") {
      query.category = category;
    }
    
    if (search) {
      // clean the search query to prevent regex DoS attacks by escaping special characters
      const safeSearch = escapeRegExp(search);
      // add the search query to the query object to search in the translations.en.title field using case-insensitive regex
      query["translations.en.title"] = { $regex: safeSearch, $options: "i" };
    }

    // calculate how many documents to skip based on the current page and limit for pagination
    const skip = (page - 1) * limit;

    // retrieve the products from the database based on the query, sorted by order, and paginated using skip and limit
    const products = await Product.find(query)
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit);

    // get the total count of products matching the query for pagination metadata
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
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