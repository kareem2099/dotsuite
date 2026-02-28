"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import ProductDetailSkeleton from "@/components/skeletons/ProductDetailSkeleton";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewSkeleton from "@/components/skeletons/ReviewSkeleton";


interface ProductData {
  product: {
    _id: string;
    slug: string;
    category: string;
    githubRepo: string;
    hasLicense: boolean;
    translations: Record<string, { title: string; description: string }>;
  };
  github: {
    stars: number;
    forks: number;
    issues: number;
    version: string;
    description: string;
    readme: string | null;
    changelog: string | null;
  };
  openVsx: {
    version: string | null;
    downloads: number;
    description: string;
    url: string;
  } | null;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
}

type Tab = "readme" | "changelog" | "reviews";

export default function ProductDetail() {
  const t = useTranslations("ProductDetail");
  const tProduct = useTranslations("Product");
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const slug = params.slug as string;
  const { data: session } = useSession();

  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("readme");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userHasReview, setUserHasReview] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchReviews = async (productId: string) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      const d = await res.json();
      if (d.reviews) {
        setReviews(d.reviews);
        setAverageRating(d.averageRating || 0);
        setTotalReviews(d.totalReviews || 0);
        if (session?.user?.id) {
          setUserHasReview(
            d.reviews.some((r: Review) => r.userId._id === session.user.id)
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [slug]);

  // refresh reviews when product data is loaded or when user session changes (to check if user has a review)
  useEffect(() => {
    if (data?.product?._id) {
      fetchReviews(data.product._id);
    }
  }, [data?.product?._id]);

  const handleSubmitReview = async (reviewData: { rating: number; comment: string }) => {
    if (!data?.product?._id) return;
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...reviewData, productId: data.product._id }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit review");
    }
    await fetchReviews(data.product._id);
  };

  const handleUpdateReview = async (reviewData: { rating: number; comment: string }) => {
    if (!data?.product?._id) return;
    const res = await fetch(`/api/reviews/${data.product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update review");
    }
    await fetchReviews(data.product._id);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!data?.product?._id) return;
    const res = await fetch(`/api/reviews/${data.product._id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to delete review");
    }
    await fetchReviews(data.product._id);
  };

  if (loading) return <ProductDetailSkeleton />;

  if (!data || !data.product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-(--text-muted)">{t("productNotFound")}</p>
      </div>
    );
  }

  const { product, github, openVsx } = data;
  const title = product.translations[locale]?.title || product.translations.en?.title;
  const description = product.translations[locale]?.description || product.translations.en?.description;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Back */}
        <Link
          href={`/${locale}/product`}
          className="inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--primary) transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {tProduct("backToProducts")}
        </Link>

        {/* Header */}
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <span className="inline-block text-xs px-2 py-1 bg-(--primary)/10 text-(--primary) border border-(--primary)/20 rounded-full capitalize mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold mb-3">{title}</h1>
              <p className="text-(--text-muted)">{description}</p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-(--text-muted)">
                {/* GitHub Stars */}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {github.stars.toLocaleString()} {t("stars")}
                </span>

                {/* Forks */}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  {github.forks.toLocaleString()} {t("forks")}
                </span>

                {/* Issues */}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {github.issues} {t("issues")}
                </span>

                {/* Open VSX Downloads */}
                {openVsx && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {openVsx.downloads.toLocaleString()} {t("downloads")}
                  </span>
                )}

                {/* Version */}
                <span className="px-2 py-0.5 bg-(--primary)/10 text-(--primary) border border-(--primary)/20 rounded-full text-xs">
                  {t("version")} {github.version}
                </span>

                {/* Open VSX Version */}
                {openVsx?.version && (
                  <span className="px-2 py-0.5 bg-(--purple-accent-bg) text-(--purple-accent) border border-(--purple-accent-border) rounded-full text-xs">
                    VSX {openVsx.version}
                  </span>
                )}

                {/* ✅ Average Rating */}
                {totalReviews > 0 && (
                  <button
                    onClick={() => setTab("reviews")}
                    className="flex items-center gap-1 hover:text-(--primary) transition-colors"
                  >
                    <svg className="w-4 h-4 fill-(--star-color) text-(--star-color)" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {averageRating.toFixed(1)} ({totalReviews} {t("reviews")})
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 min-w-48">
              <a
                href={`vscode:extension/FreeRave.${slug}`}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-(--primary) text-(--primary-text) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t("installInVSCode")}
              </a>

              <a
                href={`https://marketplace.visualstudio.com/items?itemName=FreeRave.${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {t("viewOnMarketplace")}
              </a>

              {openVsx && (
                <a
                  href={openVsx.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-(--card-border) rounded-lg hover:border-(--purple-accent) hover:text-(--purple-accent) transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13.5L9 3l3 5.25L15 3l6 10.5H3zM9 15.75L6 21h12l-3-5.25H9z" />
                  </svg>
                  {t("viewOnOpenVSX")}
                </a>
              )}

              <a
                href={`https://github.com/${product.githubRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {t("viewOnGitHub")}
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-(--card-bg) border border-(--card-border) rounded-xl w-fit">
          {(["readme", "changelog", "reviews"] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === tabKey
                ? "bg-(--primary) text-(--primary-text)"
                : "text-(--text-muted) hover:text-(--foreground)"
                }`}
            >
              {tabKey === "readme"
                ? `📖 ${t("readme")}`
                : tabKey === "changelog"
                  ? `📋 ${t("changelog")}`
                  : `⭐ ${t("reviews")}${totalReviews > 0 ? ` (${totalReviews})` : ""}`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
          {tab === "readme" ? (
            github.readme ? (
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {github.readme}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-(--text-muted)">{t("noReadme")}</p>
            )
          ) : tab === "changelog" ? (
            github.changelog ? (
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {github.changelog}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-(--text-muted)">{t("noChangelog")}</p>
            )
          ) : reviewsLoading ? (
            <ReviewSkeleton count={3} />
          ) : (
            <ReviewList
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
              currentUserId={session?.user?.id}
              userHasReview={userHasReview}
              onSubmitReview={handleSubmitReview}
              onUpdateReview={handleUpdateReview}
              onDeleteReview={handleDeleteReview}
            />
          )}
        </div>

      </div>
    </div>
  );
}