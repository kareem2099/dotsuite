import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import mongoose from "mongoose";
import { products as staticProducts } from "@/config/products";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = getClientIP(req.headers);
    const rateLimit = await checkRateLimit(`${ip}_fetch_user_reviews`, "fetch-user-reviews", 30, 60);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    await connectDB();

    const skip = (page - 1) * limit;
    
    // Find reviews matching the logged-in user
    const [reviews, total] = await Promise.all([
      Review.find({ userId: new mongoose.Types.ObjectId(session.user.id) })
        .populate("userId", "name image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ userId: new mongoose.Types.ObjectId(session.user.id) }),
    ]);

    // Map over reviews to inject static product details
    const mappedReviews = reviews.map((r) => {
      const p = staticProducts.find(prod => prod._id === r.productId);
      return {
        ...r.toObject(),
        product: p ? { _id: p._id, slug: p.slug, category: p.category, translations: p.translations } : null
      };
    });

    return NextResponse.json({
      reviews: mappedReviews,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Fetch user reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
