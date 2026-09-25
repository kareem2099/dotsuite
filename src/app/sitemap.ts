import { MetadataRoute } from "next";
import { products } from "@/config/products";

const BASE_URL = process.env.NEXTAUTH_URL || "https://dotsuite.dev";
const locales = ["en", "ar", "fr", "de", "ru"] as const;

// Priority mapping for page types
const pagePriorities: Record<string, number> = {
  home: 1.0,
  product: 0.9,
  productDetail: 0.85,
  about: 0.7,
  contact: 0.6,
  terms: 0.4,
  privacy: 0.4,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // ─── Static pages per locale ───────────────────────────────────────────
  const staticPages = [
    { path: "", priority: pagePriorities.home, changeFrequency: "weekly" as const },
    { path: "/product", priority: pagePriorities.product, changeFrequency: "daily" as const },
    { path: "/about", priority: pagePriorities.about, changeFrequency: "monthly" as const },
    { path: "/contact", priority: pagePriorities.contact, changeFrequency: "monthly" as const },
    { path: "/terms", priority: pagePriorities.terms, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: pagePriorities.privacy, changeFrequency: "yearly" as const },
  ];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${page.path}`])
          ),
        },
      });
    }
  }

  // ─── Product detail pages per locale ───────────────────────────────────
  for (const product of products) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/product/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: pagePriorities.productDetail,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/product/${product.slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
