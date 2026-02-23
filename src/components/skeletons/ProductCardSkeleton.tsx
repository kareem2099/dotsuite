import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductCardSkeleton() {
  return (
    <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <Skeleton width={80} height={24} borderRadius={9999} />
        <Skeleton width={16} height={16} />
      </div>
      <Skeleton width="80%" height={24} className="mb-2" />
      <Skeleton width="100%" height={16} className="mb-1" />
      <Skeleton width="90%" height={16} className="mb-4" />
      <div className="flex items-center gap-2">
        <Skeleton width={16} height={16} />
        <Skeleton width={120} height={14} />
      </div>
    </div>
  );
}
