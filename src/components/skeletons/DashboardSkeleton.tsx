"use client";

import { UserAvatarSkeleton } from "@/components/UserAvatar";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-(--card-border) bg-(--card-bg)">
        <div className="w-full px-6 md:px-12 lg:px-20 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar Skeleton */}
              <UserAvatarSkeleton size="md" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-(--card-border) rounded" />
                <div className="h-4 w-48 bg-(--card-border) rounded" />
              </div>
            </div>
            <div className="h-10 w-24 bg-(--card-border) rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="w-full max-w-400 mx-auto px-6 md:px-12 lg:px-20 py-8">
        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-(--card-border)" />
              <div className="space-y-2">
                <div className="h-4 w-20 bg-(--card-border) rounded" />
                <div className="h-3 w-32 bg-(--card-border) rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl flex justify-between items-center">
              <div className="space-y-3">
                <div className="h-3 w-20 bg-(--card-border) rounded" />
                <div className="h-8 w-12 bg-(--card-border) rounded" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-(--card-border)" />
            </div>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl">
          <div className="h-6 w-40 bg-(--card-border) rounded mb-4" />
          <div className="py-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-(--card-border) mb-4" />
            <div className="h-4 w-48 bg-(--card-border) rounded mb-2" />
            <div className="h-4 w-32 bg-(--card-border) rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
