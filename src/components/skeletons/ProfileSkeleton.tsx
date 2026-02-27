import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";

export default function ProfileSkeleton() {
  return (
    <SkeletonTheme baseColor="var(--card-bg)" highlightColor="var(--card-border)">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton width={200} height={40} borderRadius={8} />
          <Skeleton width={120} height={40} borderRadius={8} />
        </div>

        {/* Avatar + Basic Info */}
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
          <div className="flex items-center gap-6">
            <Skeleton width={80} height={80} borderRadius={9999} />
            <div>
              <Skeleton width={200} height={32} borderRadius={8} className="mb-2" />
              <Skeleton width={250} height={20} borderRadius={8} className="mb-2" />
              <Skeleton width={80} height={28} borderRadius={999} />
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
          <Skeleton width={180} height={24} borderRadius={8} className="mb-6" />
          <div className="space-y-4">
            <Skeleton width={120} height={16} borderRadius={8} className="mb-2" />
            <Skeleton height={48} borderRadius={8} className="mb-4" />
            
            <Skeleton width={80} height={16} borderRadius={8} className="mb-2" />
            <Skeleton height={80} borderRadius={8} className="mb-4" />
            
            <Skeleton width={100} height={16} borderRadius={8} className="mb-2" />
            <Skeleton height={48} borderRadius={8} className="mb-4" />
            
            <Skeleton width={100} height={16} borderRadius={8} className="mb-2" />
            <Skeleton height={48} borderRadius={8} className="mb-4" />
            
            <Skeleton width={80} height={16} borderRadius={8} className="mb-2" />
            <Skeleton height={48} borderRadius={8} />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
          <Skeleton width={150} height={24} borderRadius={8} className="mb-4" />
          <Skeleton height={48} borderRadius={8} className="mb-2" />
          <Skeleton height={48} borderRadius={8} />
        </div>

        {/* Danger Zone */}
        <div className="p-8 bg-(--card-bg) border border-(--danger-border) rounded-xl">
          <Skeleton width={150} height={24} borderRadius={8} className="mb-2" />
          <Skeleton width="60%" height={16} borderRadius={8} className="mb-4" />
          <Skeleton width={150} height={40} borderRadius={8} />
        </div>
      </div>
    </SkeletonTheme>
  );
}
