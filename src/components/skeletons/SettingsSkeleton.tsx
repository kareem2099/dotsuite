import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";

export default function SettingsSkeleton() {
  return (
    <SkeletonTheme baseColor="var(--card-bg)" highlightColor="var(--card-border)">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <Skeleton width={200} height={48} borderRadius={8} className="mb-8" />

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 bg-(--card-bg) border border-(--card-border) rounded-xl w-fit">
          <Skeleton width={100} height={40} borderRadius={8} />
          <Skeleton width={130} height={40} borderRadius={8} />
          <Skeleton width={80} height={40} borderRadius={8} />
        </div>

        {/* Account Tab Content */}
        <div className="space-y-6">
          <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
            <Skeleton width={180} height={24} borderRadius={8} className="mb-6" />
            <div className="space-y-4">
              <Skeleton width={80} height={16} borderRadius={8} className="mb-2" />
              <Skeleton height={48} borderRadius={8} className="mb-4" />
              
              <Skeleton width={100} height={16} borderRadius={8} className="mb-2" />
              <Skeleton height={48} borderRadius={8} className="mb-4" />
              
              <Skeleton width={100} height={16} borderRadius={8} className="mb-2" />
              <Skeleton height={48} borderRadius={8} />
            </div>
          </div>

          <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
            <Skeleton width={200} height={24} borderRadius={8} className="mb-6" />
            <Skeleton height={64} borderRadius={8} className="mb-3" />
            <Skeleton height={64} borderRadius={8} />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Skeleton width={150} height={48} borderRadius={8} />
        </div>
      </div>
    </SkeletonTheme>
  );
}
