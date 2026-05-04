"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Key, ShieldCheck, ExternalLink, Loader2, XCircle } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

export default function ExtensionOAuthPage() {
  const t = useTranslations("OAuth");
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const product = searchParams.get("product") || "dotshare";
  const callbackUrl = searchParams.get("callbackUrl") || "vscode://kareem2099.dotshare/auth";
  
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to login, then back to this oauth page
      const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/en/login?callbackUrl=${currentUrl}`);
    }
  }, [status, router]);

  const handleAuthorize = async () => {
    setIsAuthorizing(true);
    setError(null);

    try {
      // 1. Generate an API Key
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: `VS Code Extension (${new Date().toLocaleDateString()})` }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate access token");
      }

      const data = await res.json();
      const token = data.plaintext_key;

      // 2. Redirect back to VS Code
      // Expected format: vscode://kareem2099.dotshare/auth?token=ds_prod_xxx
      const targetUrl = `${callbackUrl}?token=${encodeURIComponent(token)}`;
      window.location.href = targetUrl;
      
    } catch (err: any) {
      setError(err.message);
      setIsAuthorizing(false);
    }
  };

  const handleCancel = () => {
    router.push("/en/dashboard");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-md w-full space-y-8 bg-card border border-border p-8 rounded-2xl shadow-xl">
        
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4 shadow-inner">
            <Key className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">
            {t("authorizeTitle", { defaultMessage: "Authorize Extension" })}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("authorizeDesc", { defaultMessage: "DotShare for VS Code is requesting access to your account." })}
          </p>
        </div>

        <div className="bg-muted rounded-xl p-4 flex items-center gap-4">
          <UserAvatar src={session.user?.image} name={session.user?.name} size="md" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-foreground truncate">{session.user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">
            {t("permissions", { defaultMessage: "This will allow the extension to:" })}
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              {t("permRead", { defaultMessage: "Read your current subscription tier" })}
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              {t("permWrite", { defaultMessage: "Schedule and dispatch posts on your behalf" })}
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <div className="pt-4 flex flex-col gap-3">
          <button
            onClick={handleAuthorize}
            disabled={isAuthorizing}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all"
          >
            {isAuthorizing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {t("authorizeBtn", { defaultMessage: "Authorize" })}
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={isAuthorizing}
            className="w-full py-3 px-4 border border-border rounded-xl shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted focus:outline-none transition-colors"
          >
            {t("cancelBtn", { defaultMessage: "Cancel" })}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          {t("securityNote", { defaultMessage: "You can revoke this access at any time from your Dashboard." })}
        </p>

      </div>
    </div>
  );
}

// Temporary Check icon component until lucide is fully imported above
function Check(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
