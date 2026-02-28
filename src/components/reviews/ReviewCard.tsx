"use client";

import { format } from "date-fns";
import StarRating from "./StarRating";
import Image from "next/image";
import { useTranslations } from "next-intl";

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

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  currentUserId,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const t = useTranslations("Common");
  const isOwner = currentUserId && review.userId._id === currentUserId;

  return (
    <div className="border-b border-(--card-border) py-4 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-(--card-bg) border border-(--card-border) shrink-0">
            {review.userId.image ? (
              <Image
                src={review.userId.image}
                alt={review.userId.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-(--primary)">
                {review.userId.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name + Date */}
          <div>
            <p className="font-medium">{review.userId.name}</p>
            <p className="text-sm text-(--text-muted)">
              {format(new Date(review.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        {/* Edit / Delete */}
        {isOwner && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit?.(review)}
              className="text-sm text-(--text-muted) hover:text-(--primary) transition-colors"
            >
              {t("edit")}
            </button>
            <button
              onClick={() => onDelete?.(review._id)}
              className="text-sm text-(--danger) hover:opacity-70 transition-opacity"
            >
              {t("delete")}
            </button>
          </div>
        )}
      </div>

      {/* Stars */}
      <div className="mt-3 ml-13">
        <StarRating rating={review.rating} readonly size="sm" />
      </div>

      {/* Comment */}
      <p className="mt-2 ml-13 text-(--text-muted) leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
}