"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SearchResult from "@/components/SearchResult";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";

interface Product {
  _id: string;
  slug: string;
  category: string;
  githubRepo: string;
  translations: Record<string, { title: string; description: string }>;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const t = useTranslations("Navigation");

  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Sync input with url
    setSearchInput(query);

    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=50`);
        const data = await res.json();
        setResults(data.products || []);
        setTotal(data.pagination?.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <form onSubmit={handleSearch} className="relative mb-12 animate-in slide-in-from-top-4 duration-500">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--text-muted)" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("searchPlaceholder") || "Search products..."}
            className="w-full pl-12 pr-4 py-4 bg-(--card-bg) border-2 border-(--card-border) rounded-2xl text-lg focus:border-(--primary) focus:outline-none transition-all shadow-sm focus:shadow-md"
            autoFocus
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-(--primary) text-(--background) font-semibold rounded-xl hover:bg-(--primary-hover) transition-colors"
          >
            {t("search") || "Search"}
          </button>
        </form>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {t("searchResults") || "Search Results"}
          </h1>
          {query && !loading && (
            <p className="text-(--text-muted)">
              {t("foundResultsFor") ? t("foundResultsFor").replace("{count}", total.toString()).replace("{q}", query) : `Found ${total} results for "${query}"`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : query.trim() === "" ? (
          <div className="text-center py-20 bg-(--card-bg) border border-(--card-border) rounded-2xl">
            <SearchIcon className="w-12 h-12 text-(--text-muted) mx-auto mb-4 opacity-50" />
            <p className="text-lg text-(--text-muted)">
              {t("enterSearchTerm") || "Enter a search term to find products."}
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 bg-(--card-bg) border border-(--card-border) rounded-2xl">
            <SearchIcon className="w-12 h-12 text-(--text-muted) mx-auto mb-4 opacity-50" />
            <p className="text-lg text-(--foreground) font-semibold mb-2">
              {t("noResultsFor") ? t("noResultsFor").replace("{q}", query) : `No results found for "${query}"`}
            </p>
            <p className="text-(--text-muted) mb-6">
              {t("tryDifferentKeywords") || "Try using different keywords or checking for typos."}
            </p>
            <Link 
              href={`/${locale}/product`}
              className="inline-flex items-center gap-2 text-(--primary) hover:underline font-medium"
            >
              {t("browseAllProducts") || "Browse all products"} &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
            {results.map((product) => (
              <SearchResult 
                key={product._id} 
                product={product} 
                query={query} 
                locale={locale} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
