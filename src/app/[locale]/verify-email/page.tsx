"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

function VerifyEmailContent() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(t("invalidToken"));
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || t("emailVerifiedSuccess"));
        } else {
          setStatus("error");
          setMessage(data.error || data.message || t("verificationFailed"));
        }
      } catch {
        setStatus("error");
        setMessage(t("verificationFailed"));
      }
    };

    verifyEmail();
  }, [token, t]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-(--card-bg) border border-(--card-border) rounded-xl text-center">

        {status === "loading" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-(--primary) border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t("verifyingEmail")}</h2>
            <p className="text-(--text-muted)">Please wait...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-(--primary)/10 border border-(--primary)/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t("emailVerified")}</h2>
            <p className="text-(--text-muted) mb-8">{message}</p>
            <Link
              href={`/${locale}/login`}
              className="inline-block px-6 py-3 bg-(--primary) text-[#0a0a0a] font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors"
            >
              {t("goToLogin")}
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-(--danger-bg) border border-(--danger-border) rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-(--danger)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t("verificationFailed")}</h2>
            <p className="text-(--text-muted) mb-8">{message}</p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/${locale}/login`}
                className="inline-block px-6 py-3 bg-(--primary) text-[#0a0a0a] font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors"
              >
                {t("backToLogin")}
              </Link>
              <Link
                href={`/${locale}/resend-verification`}
                className="text-sm text-(--text-muted) hover:text-(--primary) transition-colors"
              >
                {t("resendVerification")} →
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-(--primary) border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}