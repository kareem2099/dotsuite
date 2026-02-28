import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";

function ReviewCardSkeleton() {
    return (
        <div className="border-b border-(--card-border) py-4 last:border-0">
            {/* Header row: avatar + name/date + edit/delete */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    {/* Avatar circle */}
                    <Skeleton circle width={40} height={40} />
                    <div>
                        <Skeleton width={120} height={14} borderRadius={999} className="mb-1" />
                        <Skeleton width={80} height={12} borderRadius={999} />
                    </div>
                </div>
                {/* Action buttons placeholder */}
                <div className="flex gap-3">
                    <Skeleton width={32} height={14} borderRadius={999} />
                    <Skeleton width={40} height={14} borderRadius={999} />
                </div>
            </div>

            {/* Stars */}
            <div className="mt-3 ml-13">
                <Skeleton width={96} height={16} borderRadius={999} />
            </div>

            {/* Comment */}
            <div className="mt-2 ml-13">
                <Skeleton height={14} borderRadius={999} className="mb-1.5" />
                <Skeleton width="80%" height={14} borderRadius={999} />
            </div>
        </div>
    );
}

export default function ReviewSkeleton({ count = 3 }: { count?: number }) {
    return (
        <SkeletonTheme baseColor="var(--card-bg)" highlightColor="var(--card-border)">
            <div className="space-y-8">

                {/* Summary Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-(--card-border)">
                    <div className="flex items-center gap-6">
                        <div className="text-center sm:text-left">
                            {/* Score + star */}
                            <div className="flex items-baseline gap-2">
                                <Skeleton width={64} height={48} borderRadius={8} />
                                <Skeleton width={24} height={24} borderRadius={4} />
                            </div>
                            {/* "Based on X reviews" */}
                            <Skeleton width={140} height={12} borderRadius={999} className="mt-2" />
                        </div>
                    </div>
                    {/* Write Review button placeholder */}
                    <Skeleton width={140} height={42} borderRadius={12} />
                </div>

                {/* Review cards */}
                <div className="space-y-2">
                    {Array.from({ length: count }).map((_, i) => (
                        <ReviewCardSkeleton key={i} />
                    ))}
                </div>

            </div>
        </SkeletonTheme>
    );
}
