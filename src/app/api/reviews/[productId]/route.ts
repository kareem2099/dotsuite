import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { z } from "zod";
import mongoose from "mongoose";

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10).max(1000).optional(),
});

// GET reviews for a specific product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const ip = getClientIP(req.headers);
    const rateLimit = await checkRateLimit(`${ip}_fetch_product_reviews`, "fetch-product-reviews", 30, 60);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const { productId } = await params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const skip = (page - 1) * limit;

    await connectDB();

    const [reviews, total, avgRating] = await Promise.all([
      Review.find({ productId: new mongoose.Types.ObjectId(productId) })
        .populate("userId", "name image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ productId: new mongoose.Types.ObjectId(productId) }),
      Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]),
    ]);

    return NextResponse.json({
      reviews,
      averageRating: Math.round((avgRating[0]?.avgRating || 0) * 10) / 10,
      totalReviews: total,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Fetch product reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// PUT update a review
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(`${session.user.id}_update_review`, "update-review", 5, 3600);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const { productId } = await params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const body = await req.json();
    const validation = updateReviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.findOneAndUpdate(
      {
        productId: new mongoose.Types.ObjectId(productId),
        userId: new mongoose.Types.ObjectId(session.user.id),
      },
      { $set: validation.data },
      { returnDocument: 'after' }
    ).populate("userId", "name image");

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE a review
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(`${session.user.id}_delete_review`, "delete-review", 5, 3600);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const { productId } = await params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectDB();

    const review = await Review.findOneAndDelete({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}