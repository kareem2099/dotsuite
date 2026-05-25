"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const t = useTranslations("Dashboard");

  const [stats, setStats] = useState({
    totalProducts: 0,
    downloads: 0,
    reviews: 0,
  });

  useEffect(() => {
    // Only fetch stats if user is authenticated
    if (status === "authenticated") {
      fetch("/api/dashboard/stats")
        .then((res) => res.json())
        .then((data) => {
          if (data.totalProducts !== undefined) {
            setStats({
              totalProducts: data.totalProducts || 0,
              downloads: data.downloads || 0,
              reviews: data.reviews || 0,
            });
          }
        })
        .catch((err) => console.error("Failed to fetch stats:", err));
    }
  }, [status]);

  const [isRedirecting, setIsRedirecting] = useState(false);
  const intentProcessed = useRef(false);

  useEffect(() => {
    const checkIntent = async () => {
      const intent = localStorage.getItem("auth_intent");
      
      if (intent === "vscode" && status === "authenticated" && !intentProcessed.current) {
        intentProcessed.current = true;
        setIsRedirecting(true);
        console.log("[DotSuite] VS Code auth intent detected, generating key...");
        
        try {
          const res = await fetch("/api/keys", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: "VS Code Extension" })
          });
          
          if (res.ok) {
            const data = await res.json();
            const token = data.plaintext_key;

            console.log("[DotSuite] Raw token from API:", token);
            console.log("[DotSuite] Token type:", typeof token);
            console.log("[DotSuite] Token length:", token?.length);
            console.log("[DotSuite] Token starts with ds_prod_:", token?.startsWith?.("ds_prod_"));

            if (!token) {
              throw new Error("No token received from API");
            }

            // 1. Sanitization
            const safeToken = encodeURIComponent(token);
            
            console.log("[DotSuite] After encodeURIComponent - token:", safeToken);
            console.log("[DotSuite] After encoding - length:", safeToken.length);
            
            // 2. Build link
            const scheme = localStorage.getItem("auth_scheme") || "vscode";
            const vscodeUrl = `${scheme}://freerave.dotshare/login?token=${safeToken}`;
            
            console.log("[DotSuite] Full VS Code URL:", vscodeUrl);
            
            // 3. Small delay to ensure the UI is ready and intent is cleared
            localStorage.removeItem("auth_intent");
            localStorage.removeItem("auth_scheme");
            console.log("[DotSuite] Key generated, redirecting to VS Code...");
            
            setTimeout(() => {
              window.location.href = vscodeUrl;
            }, 500);
          } else {
            console.error("Failed to generate key for VS Code");
            localStorage.removeItem("auth_intent");
          }
        } catch (error) {
          console.error("Failed to setup VS Code auth", error);
          localStorage.removeItem("auth_intent");
        } finally {
          setIsRedirecting(false);
        }
      }
    };

    checkIntent();
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen">
      {isRedirecting && (
        <div className="bg-green-500 text-white p-4 text-center mb-4 animate-pulse">
          Connecting to DotShare VS Code Extension... Please confirm the prompt.
        </div>
      )}
      
      {/* Header */}
      <div className="border-b border-(--card-border) bg-(--card-bg)">
        <div className="w-full px-6 md:px-12 lg:px-20 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar
                src={session.user?.image}
                name={session.user?.name}
                size="md"
              />
              <div>
                <h1 className="text-2xl font-bold">{session.user?.name}</h1>
                <p className="text-(--text-muted)">{session.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="flex items-center gap-2 px-4 py-2 border border-(--card-border) rounded-lg text-sm hover:border-red-500 hover:text-red-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-400 mx-auto px-6 md:px-12 lg:px-20 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Link
            href={`/${locale}/dashboard/profile`}
            className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-(--primary) transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-(--primary)/10 flex items-center justify-center group-hover:bg-(--primary)/20 transition-colors">
                <svg className="w-6 h-6 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">{t("profile")}</h3>
                <p className="text-sm text-(--text-muted)">{t("manageProfile")}</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/${locale}/dashboard/settings`}
            className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-(--primary) transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-(--primary)/10 flex items-center justify-center group-hover:bg-(--primary)/20 transition-colors">
                <svg className="w-6 h-6 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">{t("settings")}</h3>
                <p className="text-sm text-(--text-muted)">{t("accountSettings")}</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/${locale}/product`}
            className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-(--primary) transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-(--primary)/10 flex items-center justify-center group-hover:bg-(--primary)/20 transition-colors">
                <svg className="w-6 h-6 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">{t("browseProducts")}</h3>
                <p className="text-sm text-(--text-muted)">{t("discoverTools")}</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/${locale}/dashboard/reviews`}
            className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-(--primary) transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-(--primary)/10 flex items-center justify-center group-hover:bg-(--primary)/20 transition-colors">
                <svg className="w-6 h-6 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">{t("myReviews")}</h3>
                <p className="text-sm text-(--text-muted)">{t("manageReviews")}</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/${locale}/dashboard/keys`}
            className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-primary transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4v-3.286a2 2 0 01.586-1.414l9.743-9.743A6 6 0 0121 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">{t("apiKeys", { defaultMessage: "API Keys" })}</h3>
                <p className="text-sm text-muted-foreground">{t("manageKeys", { defaultMessage: "Manage extension keys" })}</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/${locale}/dashboard/dotshare`}
            className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-purple-500/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">DotShare</h3>
                <p className="text-sm text-(--text-muted)">Schedule & publish posts</p>
              </div>
            </div>
          </Link>

          {/* Admin-only: Audit System */}
          {session.user?.email && (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",").map(e => e.trim()).includes(session.user.email) && (
            <Link
              href={`/${locale}/dashboard/admin`}
              className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-red-500/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Audit System</h3>
                  <p className="text-sm text-(--text-muted)">Moderate platform content</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-(--text-muted)">{t("totalProducts")}</p>
                <p className="text-3xl font-bold mt-1">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-(--primary)/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-(--text-muted)">{t("downloads")}</p>
                <p className="text-3xl font-bold mt-1">{stats.downloads}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-(--text-muted)">{t("reviews")}</p>
                <p className="text-3xl font-bold mt-1">{stats.reviews}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl">
          <h2 className="text-lg font-semibold mb-4">{t("recentActivity")}</h2>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-(--card-border) mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-(--text-muted)">{t("noActivity")}</p>
            <Link
              href={`/${locale}/product`}
              className="inline-block mt-4 text-(--primary) hover:underline"
            >
              {t("browseProducts")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
