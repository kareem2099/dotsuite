import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Get total downloads (sum from all products - you can add this field to Product model)
    // For now, we'll calculate based on GitHub API data
    
    // Get products for detailed stats
    const products = await Product.find({}).lean();
    
    // Calculate total downloads from products (if you add downloadCount field)
    // For now, we'll return mock data structure that you can expand
    
    const stats = {
      totalProducts,
      downloads: 0, // Will be populated when you add download tracking
      reviews: 0, // Will be populated when you add reviews feature
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
