"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PlatformBadge from "@/components/dotshare/PlatformBadge";
import PostStatusIcon from "@/components/dotshare/PostStatusIcon";

type PostStatus = "pending" | "dispatched" | "published" | "failed";

interface Post {
  _id: string;
  text: string;
  platforms: string[];
  status: PostStatus;
  scheduled_at: string;
  last_error?: string;
  has_video?: boolean;
  media_urls?: string[];
}

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "⏳ Scheduled", value: "pending" },
  { label: "🚀 Dispatched", value: "dispatched" },
  { label: "✅ Published", value: "published" },
  { label: "❌ Failed", value: "failed" },
];

export default function PostsPage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: page.toString(), limit: "15" });
      if (statusFilter) qs.set("status", statusFilter);

      const res = await fetch(`/api/posts?${qs}`);
      const data = await res.json();
      setPosts(Array.isArray(data.posts) ? data.posts : Array.isArray(data) ? data : []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCancel = async (postId: string) => {
    if (!confirm("Cancel this scheduled post?")) return;
    setCancellingId(postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      }
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Back */}
        <Link
          href={`/${locale}/dashboard/dotshare`}
          className="inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--primary) transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to DotShare
        </Link>

        <h1 className="text-2xl font-bold mb-2">All Posts</h1>
        <p className="text-sm text-(--text-muted) mb-6">Manage your scheduled and published posts</p>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                statusFilter === f.value
                  ? "bg-(--primary) text-(--primary-text) border-(--primary)"
                  : "border-(--card-border) text-(--text-muted) hover:border-(--primary) hover:text-(--primary)"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-(--card-bg) border border-(--card-border) rounded-xl overflow-hidden">
          {loading ? (
            <div className="divide-y divide-(--card-border)">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-5 animate-pulse flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-(--card-border)" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-(--card-border) rounded w-3/4" />
                    <div className="h-3 bg-(--card-border) rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="p-16 text-center text-(--text-muted)">
              <div className="w-16 h-16 rounded-full bg-(--card-border) mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="font-medium mb-2">No posts found</p>
              <p className="text-sm">
                {statusFilter
                  ? `No ${statusFilter} posts found. Try a different filter.`
                  : "Install the DotShare extension in VS Code to start scheduling posts."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-(--card-border)">
              {posts.map((post) => (
                <li key={post._id} className="p-5 hover:bg-(--card-border)/20 transition-colors">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1">
                      <PostStatusIcon status={post.status} showLabel />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-2 line-clamp-2">{post.text}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {post.platforms.map((p) => (
                          <PlatformBadge key={p} platform={p as Parameters<typeof PlatformBadge>[0]["platform"]} />
                        ))}
                        {post.has_video && (
                          <span className="px-2 py-0.5 text-xs bg-purple-500/15 text-purple-400 border border-purple-500/20 rounded-md">
                            🎥 Video
                          </span>
                        )}
                        {post.media_urls && post.media_urls.length > 0 && !post.has_video && (
                          <span className="px-2 py-0.5 text-xs bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-md">
                            🖼 {post.media_urls.length} image{post.media_urls.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-(--text-muted)">
                        <span>{new Date(post.scheduled_at).toLocaleString()}</span>
                        {post.last_error && (
                          <span className="text-red-400">Error: {post.last_error}</span>
                        )}
                      </div>
                    </div>
                    {post.status === "pending" && (
                      <button
                        onClick={() => handleCancel(post._id)}
                        disabled={cancellingId === post._id}
                        className="shrink-0 px-3 py-1.5 text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {cancellingId === post._id ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm border border-(--card-border) rounded-lg hover:border-(--primary) transition-colors disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-(--text-muted)">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm border border-(--card-border) rounded-lg hover:border-(--primary) transition-colors disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
