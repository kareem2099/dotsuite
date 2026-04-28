import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ReviewsDashboardSkeleton() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <Skeleton height={36} width={250} className="mb-2" />
          <Skeleton height={20} width={400} />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Skeleton height={24} width={200} className="mb-1" />
                  <Skeleton height={16} width={120} />
                </div>
                <Skeleton height={32} width={100} />
              </div>
              <Skeleton height={16} width="100%" count={2} />
              <div className="mt-4 flex gap-2">
                <Skeleton height={30} width={80} />
                <Skeleton height={30} width={80} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
