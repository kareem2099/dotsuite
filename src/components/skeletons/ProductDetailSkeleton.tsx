import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";

export default function ProductDetailSkeleton() {
  return (
    <SkeletonTheme baseColor="var(--card-bg)" highlightColor="var(--card-border)">
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-16">

          {/* Back */}
          <div className="mb-8">
            <Skeleton width={120} height={16} borderRadius={999} />
          </div>

          {/* Header */}
          <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <Skeleton width={80} height={22} borderRadius={999} className="mb-3" />
                <Skeleton width={280} height={36} borderRadius={8} className="mb-3" />
                <Skeleton height={16} borderRadius={999} className="mb-2" />
                <Skeleton width="75%" height={16} borderRadius={999} />
                <div className="flex gap-4 mt-4">
                  <Skeleton width={48} height={16} borderRadius={999} />
                  <Skeleton width={48} height={16} borderRadius={999} />
                  <Skeleton width={64} height={16} borderRadius={999} />
                  <Skeleton width={56} height={22} borderRadius={999} />
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-48">
                <Skeleton height={44} borderRadius={8} />
                <Skeleton height={44} borderRadius={8} />
                <Skeleton height={44} borderRadius={8} />
                <Skeleton height={44} borderRadius={8} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 bg-(--card-bg) border border-(--card-border) rounded-xl w-fit">
            <Skeleton width={110} height={36} borderRadius={8} />
            <Skeleton width={110} height={36} borderRadius={8} />
          </div>

          {/* Content */}
          <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
            <Skeleton width={200} height={28} borderRadius={8} className="mb-4" />
            <Skeleton height={16} borderRadius={999} className="mb-2" count={3} />
            <Skeleton width="75%" height={16} borderRadius={999} className="mb-6" />
            <Skeleton height={120} borderRadius={8} className="mb-6" />
            <Skeleton width={160} height={24} borderRadius={8} className="mb-4" />
            <Skeleton height={16} borderRadius={999} className="mb-2" count={3} />
            <Skeleton width="60%" height={16} borderRadius={999} className="mb-6" />
            <Skeleton height={80} borderRadius={8} />
          </div>

        </div>
      </div>
    </SkeletonTheme>
  );
}
