"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ReviewFormProps {
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  onCancel?: () => void;
  initialData?: {
    rating: number;
    comment: string;
  };
  isEditing?: boolean;
}

export default function ReviewForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: ReviewFormProps) {
  const t = useTranslations("Common");
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError(t("selectRatingError"));
      return;
    }

    if (comment.length < 10) {
      setError(t("reviewMinLengthError"));
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({ rating, comment });
      if (!isEditing) {
        setRating(0);
        setComment("");
      }
    } catch (err: any) {
      setError(err.message || t("submitReviewError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-(--card-bg) p-6 rounded-xl border border-(--card-border) shadow-sm">
      <div>
        <label className="block text-sm font-semibold text-(--foreground) mb-3">
          {isEditing ? t("updateRating") : t("rateProduct")}
        </label>
        <StarRating rating={rating} onRatingChange={setRating} size="lg" />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-semibold text-(--foreground) mb-2">
          {isEditing ? t("updateReview") : t("writeReview")}
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (error) setError("");
          }}
          rows={4}
          className="w-full px-4 py-3 border border-(--card-border) rounded-xl bg-(--background) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--primary)/50 focus:border-(--primary) transition-all resize-none placeholder:(--text-muted)"
          placeholder={t("reviewPlaceholder")}
          required
          maxLength={1000}
        />
        <div className="flex justify-between items-center mt-2 text-xs">
          <p className={comment.length > 0 && comment.length < 10 ? "text-(--danger)" : "text-(--text-muted)"}>
            {comment.length < 10
              ? t("minCharsLeft", { count: 10 - comment.length })
              : t("greatLength")}
          </p>
          <p className="text-(--text-muted)">
            {comment.length}/1000
          </p>
        </div>
      </div>

      {/* Error Message Box */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-(--danger-bg) border border-(--danger-border) text-(--danger) text-sm animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-35"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-(--background)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? t("updating") : t("submitting")}
            </span>
          ) : (
            isEditing ? t("updateReviewBtn") : t("submitReview")
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 border border-(--card-border) text-(--foreground) font-medium rounded-lg hover:bg-(--card-border)/50 transition-colors disabled:opacity-50"
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </form>
  );
}