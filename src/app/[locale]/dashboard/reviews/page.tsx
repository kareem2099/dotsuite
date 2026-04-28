"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ReviewsDashboardSkeleton from "@/components/skeletons/ReviewsDashboardSkeleton";
import { Star, MessageSquareOff, Trash2, Edit2, Check, X } from "lucide-react";
import { useConfirm } from "@/components/ConfirmModal";
import { useToast } from "@/components/Toast";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  product?: {
    _id: string;
    slug: string;
    category: string;
    translations: Record<string, { title: string }>;
  };
}

export default function MyReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const { confirm } = useConfirm();
  const { toast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/user/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error(error);
      toast.error(tCommon("errorFetching"));
    } finally {
      setLoading(false);
    }
  }, [tCommon]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    } else if (status === "authenticated") {
      fetchReviews();
    }
  }, [status, router, locale, fetchReviews]);

  const handleDelete = async (productId: string, reviewId: string) => {
    const confirmed = await confirm(tCommon("deleteReviewConfirm"), {
      title: tCommon("delete"),
      confirmLabel: tCommon("delete"),
      cancelLabel: tCommon("cancel"),
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/reviews/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(tCommon("reviewDeleted"));
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (error) {
      console.error(error);
      toast.error(tCommon("errorDeleting"));
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingId(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdate = async (productId: string, reviewId: string) => {
    if (editForm.comment.trim().length < 10) {
      toast.error(tCommon("commentTooShort"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Update failed");
      
      const data = await res.json();
      toast.success(tCommon("reviewUpdated"));
      setReviews((prev) => prev.map((r) => (r._id === reviewId ? { ...r, rating: data.review.rating, comment: data.review.comment } : r)));
      setEditingId(null);
    } catch (error) {
      console.error(error);
      toast.error(tCommon("errorUpdating"));
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return <ReviewsDashboardSkeleton />;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t("myReviews")}</h1>
            <p className="text-(--text-muted) mt-2">{t("manageReviews")}</p>
          </div>
          <Link
            href={`/${locale}/dashboard`}
            className="text-sm font-medium text-(--text-muted) hover:text-(--foreground) hover:bg-(--card-border) px-4 py-2 rounded-xl border border-transparent hover:border-(--card-border) transition-all inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("backToDashboard")}
          </Link>
        </div>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-(--card-border) rounded-2xl bg-(--card-bg)/30">
            <div className="w-16 h-16 bg-(--card-bg) border border-(--card-border) rounded-full flex items-center justify-center mb-4">
              <MessageSquareOff className="w-8 h-8 text-(--text-muted) opacity-70" />
            </div>
            <p className="text-lg font-semibold text-(--foreground)">{t("noReviewsYet")}</p>
            <p className="text-(--text-muted) mt-1 max-w-sm">
              {t("noReviewsDesc")}
            </p>
            <Link
              href={`/${locale}/product`}
              className="mt-6 px-6 py-2.5 bg-(--primary) text-(--background) font-semibold rounded-xl hover:bg-(--primary-hover) transition-colors"
            >
              {t("browseProducts")}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => {
              const productTitle = review.product?.translations?.[locale]?.title || review.product?.translations?.en?.title || "Unknown Product";
              
              return (
                <div key={review._id} className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-(--card-border-hover) transition-colors shadow-xs hover:shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      {review.product ? (
                        <Link href={`/${locale}/product/${review.product.slug}`} className="text-lg font-bold hover:text-(--primary) transition-colors">
                          {productTitle}
                        </Link>
                      ) : (
                        <h3 className="text-lg font-bold text-(--text-muted)">{productTitle}</h3>
                      )}
                      <p className="text-xs text-(--text-muted) mt-1">
                        {new Date(review.createdAt).toLocaleDateString(locale, {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>

                    {editingId !== review._id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(review)}
                          className="p-2 text-(--text-muted) hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20"
                          title={tCommon("edit")}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => review.product && handleDelete(review.product._id, review._id)}
                          className="p-2 text-(--text-muted) hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                          title={tCommon("delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingId === review._id ? (
                    <div className="space-y-4 animate-in fade-in pt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setEditForm({ ...editForm, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= editForm.rating
                                  ? "fill-(--star-color) text-(--star-color)"
                                  : "text-(--card-border) fill-transparent"
                              } transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={editForm.comment}
                        onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                        className="w-full bg-(--background) border border-(--card-border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary) transition-all min-h-[100px] resize-y"
                        placeholder={tCommon("writeReviewPlaceholder")}
                      />
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 border border-(--card-border) text-sm font-semibold rounded-lg hover:bg-(--card-border) transition-colors flex items-center gap-2"
                          disabled={submitting}
                        >
                          <X className="w-4 h-4" /> {tCommon("cancel")}
                        </button>
                        <button
                          onClick={() => review.product && handleUpdate(review.product._id, review._id)}
                          className="px-4 py-2 bg-(--primary) text-(--background) text-sm font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors flex items-center gap-2"
                          disabled={submitting}
                        >
                          <Check className="w-4 h-4" /> {tCommon("save")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-(--star-color) text-(--star-color)" : "text-(--card-border) fill-transparent"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-(--text-muted)">
                        {review.comment}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
