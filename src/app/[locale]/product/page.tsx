"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import useDebounce from "@/hooks/useDebounce";

interface Product {
  _id: string;
  slug: string;
  category: string;
  githubRepo: string;
  translations: {
    [key: string]: { title: string; description: string };
  };
}

const categoryIcons: Record<string, string> = {
  vscode: "⚡",
  python: "🐍",
  nextjs: "▲",
};

export default function ProductsPage() {
  const t = useTranslations("Product");
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  
  // Use debounce hook
  const debouncedSearch = useDebounce(search, 500);

  // Fetch products when category or debounced search changes
  useEffect(() => {
    const fetchProducts = async () => {
      const searchParams = new URLSearchParams();
      if (category !== "all") searchParams.set("category", category);
      if (debouncedSearch) searchParams.set("search", debouncedSearch);

      setLoading(true);
      try {
        const res = await fetch(`/api/products?${searchParams}`);
        const data = await res.json();
        
        // Handle both array and { products: [] } response formats
        const productsArray = Array.isArray(data) ? data : (data.products || []);
        setProducts(productsArray);
      } catch (err) {
        console.error("Fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, category]);

  const getTitle = (product: Product) => {
    return product.translations[locale]?.title || product.translations.en?.title;
  };

  const getDesc = (product: Product) => {
    return product.translations[locale]?.description || product.translations.en?.description;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t("title").split(" ")[0]} <span className="text-[#10b981]">{t("title").split(" ").slice(1).join(" ")}</span>
        </h1>
        <p className="text-xl text-(--text-muted) max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </section>

      {/* Search + Filter */}
      <section className="max-w-6xl mx-auto px-6 mb-10">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="w-full pl-11 pr-4 py-3 bg-(--card-bg) border border-(--card-border) rounded-lg text-sm focus:border-[#10b981] focus:outline-none transition-colors"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {["all", "vscode", "python", "nextjs"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                  category === cat
                    ? "bg-[#10b981] text-[#0a0a0a]"
                    : "bg-(--card-bg) border border-(--card-border) text-(--text-muted) hover:border-[#10b981] hover:text-[#10b981]"
                }`}
              >
                {cat === "all" ? t("all") : `${categoryIcons[cat]} ${cat}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-(--text-muted)">
            {t("noProducts")}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/${locale}/product/${product.slug}`}
                className="group p-6 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-[#10b981] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2 py-1 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 rounded-full capitalize">
                    {categoryIcons[product.category]} {product.category}
                  </span>
                  <svg className="w-4 h-4 text-(--text-muted) group-hover:text-[#10b981] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#10b981] transition-colors">
                  {getTitle(product)}
                </h3>

                {/* Description */}
                <p className="text-sm text-(--text-muted) line-clamp-2 mb-4">
                  {getDesc(product)}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-2 text-xs text-(--text-muted)">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {product.githubRepo}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}