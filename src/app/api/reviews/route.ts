import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { z } from "zod";
import mongoose from "mongoose";

const createReviewSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID",
  }),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(1000),
});

export async function GET(req: Request) {
  try {
    const ip = getClientIP(req.headers);
    const rateLimit = await checkRateLimit(`${ip}_fetch_reviews`, "fetch-reviews", 30, 60);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    await connectDB();

    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      Review.find()
        .populate("userId", "name image")
        .populate("productId", "slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(),
    ]);

    return NextResponse.json({
      reviews,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = getClientIP(req.headers);
    const rateLimit = await checkRateLimit(`${ip}_create_review`, "create-review", 3, 3600);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }

    const body = await req.json();
    const validation = createReviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { productId, rating, comment } = validation.data;

    await connectDB();

    try {
      const review = await Review.create({
        productId: new mongoose.Types.ObjectId(productId),
        userId: new mongoose.Types.ObjectId(session.user.id),
        rating,
        comment,
      });

      await review.populate("userId", "name image");
      return NextResponse.json({ review }, { status: 201 });

    } catch (error: any) {
      // ✅ Handle duplicate review
      if (error.code === 11000) {
        return NextResponse.json(
          { error: "You have already reviewed this product" },
          { status: 400 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}