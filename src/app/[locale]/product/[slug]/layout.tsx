import { Metadata } from "next";
import { products } from "@/config/products";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string, locale: string }> 
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = products.find(p => p.slug === slug);
  
  if (!product) return {};

  const title = product.translations[locale as "en" | "ar" | "fr" | "ru" | "de"]?.title || product.translations.en.title;
  
  // Base URL for API
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  let averageRating = "0.0";
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const Review = (await import("@/models/Review")).default;
    await connectDB();
    const stats = await Review.aggregate([
      { $match: { productId: product._id } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ]);
    if (stats.length > 0) {
      averageRating = stats[0].averageRating.toFixed(1);
    }
  } catch (e) {
    console.error("Failed to fetch rating for OG image", e);
  }

  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set("title", title);
  ogUrl.searchParams.set("rating", averageRating);

  return {
    title: title,
    openGraph: {
      title: title,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      images: [ogUrl.toString()],
    }
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
