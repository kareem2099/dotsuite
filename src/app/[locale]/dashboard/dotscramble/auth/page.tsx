"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function DotScrambleDesktopAuth() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const searchParams = useSearchParams();
  
  const port = searchParams.get("port");
  const state = searchParams.get("state");
  const isMissingParams = !port || !state;

  const [status, setStatus] = useState<"loading" | "error" | "success" | "upgrade_required">(
    isMissingParams ? "error" : "loading"
  );
  const [errorMsg, setErrorMsg] = useState(
    isMissingParams ? "Missing required parameters from desktop app." : ""
  );
  const didRun = useRef(false);

  useEffect(() => {
    if (isMissingParams) {
      return;
    }
    // Guard: only run once even if deps change (e.g. locale hydrates after mount)
    if (didRun.current) return;
    didRun.current = true;

    const authenticateDesktop = async () => {
      try {
        // 1. Check session first — redirect to login if not authenticated
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (!sessionData?.user) {
          const callbackUrl = encodeURIComponent(window.location.href);
          router.push(`/${locale}/login?callbackUrl=${callbackUrl}`);
          return;
        }

        // 2. Verify Billing Status
        const billingRes = await fetch("/api/billing/status");
        if (!billingRes.ok) {
          throw new Error("Failed to verify subscription status.");
        }
        const billingData = await billingRes.json();

        if (billingData.products?.dotscramble?.tier !== "max") {
          setStatus("upgrade_required");
          return;
        }

        // Each authorization is a separate connection. Never revoke another
        // device's key solely because its display label matches.
        const newKeyRes = await fetch("/api/keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: `DotScramble Desktop · ${new Date().toLocaleString()}`, source: "dotscramble", scopes: ["dotscramble:verify", "account:read"] }),
        });
        const newKeyData = await newKeyRes.json();
        if (!newKeyData.plaintext_key) {
          throw new Error(newKeyData.error || "Failed to generate API Key.");
        }
        const activeKey = newKeyData.plaintext_key;

        // 5. Send the key back to the local python server
        const localRes = await fetch(`http://127.0.0.1:${port}/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: activeKey, state }),
        });

        if (localRes.ok) {
          setStatus("success");
        } else {
          throw new Error("Local app is not responding. Please make sure DotScramble is still open.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
    };

    authenticateDesktop();
  }, [port, state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-(--bg-primary)">
      <div className="max-w-md w-full bg-(--card-bg) border border-(--card-border) rounded-2xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-(--primary)/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">DotScramble Pro</h1>
        
        {status === "loading" && (
          <div>
            <div className="inline-block w-6 h-6 border-2 border-(--primary) border-t-transparent rounded-full animate-spin mb-4 mt-2"></div>
            <p className="text-(--text-muted)">Connecting to your desktop app...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-green-500">Activation Successful!</p>
            <p className="text-(--text-muted) text-sm">
              Your API key has been securely transmitted. You can close this tab and return to DotScramble.
            </p>
          </div>
        )}

        {status === "upgrade_required" && (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-500 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Upgrade Required</p>
            <p className="text-(--text-muted) text-sm">
              To activate DotScramble Pro, you need active DotScramble Max access.
            </p>
            <Link
              href={`/${locale}/dashboard/dotscramble/upgrade`}
              className="inline-block px-6 py-3 bg-(--primary) text-(--primary-text) rounded-xl font-semibold hover:bg-(--primary-hover) transition-colors mt-4 w-full"
            >
              Upgrade to Max
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-red-500">Connection Failed</p>
            <p className="text-(--text-muted) text-sm">{errorMsg}</p>
            <Link href={`/${locale}/dashboard/keys`} className="block underline">Manage API keys</Link>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gray-500/10 hover:bg-gray-500/20 rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
