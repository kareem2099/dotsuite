"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import useDebounce from "@/hooks/useDebounce";
import TagFilter from "@/components/TagFilter";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  slug: string;
  category: string;
  githubRepo: string;
  translations: {
    [key: string]: { title: string; description: string };
  };
}

export default function ProductsPage() {
  const t = useTranslations("Product");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const category = searchParams.get("category") || "all";

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Use debounce hook
  const debouncedSearch = useDebounce(search, 500);

  // Track the current "intent" page — resets to 1 when filters change
  const pageRef = useRef(page);
  pageRef.current = page;

  // Single unified effect — fixes race condition by:
  // 1. Resetting page to 1 when filters change (instead of a separate effect)
  // 2. Using AbortController to cancel stale in-flight requests
  useEffect(() => {
    // When search or category changes, always start from page 1
    setPage(1);
  }, [debouncedSearch, category]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      const qs = new URLSearchParams();
      if (category !== "all") qs.set("category", category);
      if (debouncedSearch) qs.set("search", debouncedSearch);
      qs.set("page", page.toString());
      qs.set("limit", "6");

      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await fetch(`/api/products?${qs}`, { signal: controller.signal });
        const data = await res.json();

        // Handle both array and { products: [] } response formats
        const productsArray = data.products || (Array.isArray(data) ? data : []);

        if (page === 1) {
          setProducts(productsArray);
        } else {
          setProducts((prev) => [...prev, ...productsArray]);
        }

        setTotalPages(data.pagination?.totalPages ?? 1);
      } catch (err: unknown) {
        // Ignore abort errors from cancelled requests — they are intentional
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Fetch error:", err);
        if (page === 1) setProducts([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();

    // Cleanup: cancel the request if the component re-renders before it completes
    return () => controller.abort();
  }, [debouncedSearch, category, page]);

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    // reset search when category changes for better UX, optional but good
    // setSearch("");
    // params.delete("search");
    router.replace(`/${locale}/product?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t("title").split(" ")[0]} <span className="text-(--primary)">{t("title").split(" ").slice(1).join(" ")}</span>
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
              className="w-full pl-11 pr-4 py-3 bg-(--card-bg) border border-(--card-border) rounded-lg text-sm focus:border-(--primary) focus:outline-none transition-colors"
            />
          </div>

          {/* Filter */}
          <TagFilter 
            currentCategory={category} 
            onCategoryChange={handleCategoryChange} 
          />
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
              <ProductCard 
                key={product._id} 
                product={product} 
                locale={locale} 
                onCategoryClick={handleCategoryChange} 
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && products.length > 0 && page < totalPages && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loadingMore}
              className="px-8 py-3 bg-(--card-bg) border border-(--card-border) text-(--foreground) font-medium rounded-lg hover:border-(--primary) hover:text-(--primary) transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loadingMore ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t("loading") || "Loading..."}</span>
                </div>
              ) : (
                t("loadMore") || "Load More"
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}