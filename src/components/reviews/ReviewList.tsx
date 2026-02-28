"use client";

import { useState, useMemo } from "react";
import { MessageSquareOff, Star, ArrowUpDown } from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";
import { useTranslations } from "next-intl";
import { useConfirm } from "@/components/ConfirmModal";

type SortOption = "newest" | "oldest" | "highest" | "lowest";

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

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  currentUserId?: string;
  userHasReview?: boolean;
  onSubmitReview: (data: { rating: number; comment: string }) => Promise<void>;
  onUpdateReview?: (data: { rating: number; comment: string }) => Promise<void>;
  onDeleteReview?: (reviewId: string) => Promise<void>;
}

export default function ReviewList({
  reviews,
  averageRating,
  totalReviews,
  currentUserId,
  userHasReview,
  onSubmitReview,
  onUpdateReview,
  onDeleteReview,
}: ReviewListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const t = useTranslations("Common");
  const { confirm } = useConfirm();

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    switch (sort) {
      case "newest":
        return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "oldest":
        return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "highest":
        return copy.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return copy.sort((a, b) => a.rating - b.rating);
    }
  }, [reviews, sort]);

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "newest", label: t("sortNewest") },
    { value: "oldest", label: t("sortOldest") },
    { value: "highest", label: t("sortHighest") },
    { value: "lowest", label: t("sortLowest") },
  ];

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDelete = async (reviewId: string) => {
    const confirmed = await confirm(t("deleteReviewConfirm"), {
      title: t("delete"),
      confirmLabel: t("delete"),
      cancelLabel: t("cancel"),
      variant: "danger",
    });
    if (!confirmed) return;

    setIsDeleting(reviewId);
    try {
      await onDeleteReview?.(reviewId);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const handleFormSuccess = async (data: { rating: number; comment: string }) => {
    if (editingReview) {
      await onUpdateReview?.(data);
    } else {
      await onSubmitReview(data);
    }
    handleFormClose();
  };

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-(--card-border)">
        <div className="flex items-center gap-6">
          <div className="text-center sm:text-left">
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <p className="text-5xl font-extrabold text-(--foreground)">
                {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
              </p>
              <Star className="w-6 h-6 fill-(--star-color) text-(--star-color) mb-1" />
            </div>
            <p className="text-sm font-medium text-(--text-muted) mt-2">
              {t("basedOnReviews", { count: totalReviews })}
            </p>
          </div>
        </div>

        {/* Write Review Button */}
        {currentUserId && !userHasReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2.5 bg-(--primary) text-(--background) font-semibold rounded-xl hover:bg-(--primary-hover) hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
          >
            {t("writeReview")}
          </button>
        )}
      </div>

      {/* Review Form (With Animation) */}
      {showForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <ReviewForm
            onSubmit={handleFormSuccess}
            onCancel={handleFormClose}
            initialData={editingReview ? { rating: editingReview.rating, comment: editingReview.comment } : undefined}
            isEditing={!!editingReview}
          />
        </div>
      )}

      {/* Sort Controls */}
      {reviews.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs font-medium text-(--text-muted) shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5" />
            {t("sortBy")}
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${sort === opt.value
                    ? "bg-(--primary) text-(--background) border-(--primary)"
                    : "bg-transparent text-(--text-muted) border-(--card-border) hover:border-(--primary) hover:text-(--primary)"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-(--card-border) rounded-2xl bg-(--card-bg)/30">
          <div className="w-16 h-16 bg-(--card-bg) border border-(--card-border) rounded-full flex items-center justify-center mb-4">
            <MessageSquareOff className="w-8 h-8 text-(--text-muted) opacity-70" />
          </div>
          <p className="text-lg font-semibold text-(--foreground)">{t("noReviews")}</p>
          <p className="text-(--text-muted) mt-1 max-w-sm">
            {t("beFirst")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={currentUserId}
              onEdit={currentUserId && review.userId._id === currentUserId ? handleEdit : undefined}
              onDelete={currentUserId && review.userId._id === currentUserId ? handleDelete : undefined}
            />
          ))}
        </div>
      )}

      {/* Loading overlay for delete */}
      {isDeleting && (
        <div className="fixed inset-0 bg-(--background)/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-(--card-bg) p-6 rounded-2xl shadow-xl border border-(--card-border) flex flex-col items-center min-w-40">
            <div className="w-8 h-8 border-3 border-(--primary)/30 border-t-(--primary) rounded-full animate-spin mb-3" />
            <p className="text-sm font-semibold text-(--foreground)">{t("deleting")}</p>
          </div>
        </div>
      )}
    </div>
  );
}