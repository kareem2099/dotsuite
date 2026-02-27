"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ResetPassword() {
  const t = useTranslations("Auth");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = params.locale as string || "en";
  
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidToken, setIsInvalidToken] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage(t("passwordMismatch"));
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage(t("passwordTooShort"));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
      } else {
        setMessage(data.message);
        if (data.message.includes("Invalid") || data.message.includes("expired")) {
          setIsInvalidToken(true);
        }
      }
    } catch (err) {
      setMessage(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen">
        <section className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("resetPasswordTitle")}
          </h1>
        </section>

        <section className="max-w-md mx-auto px-6 pb-16">
          <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl text-center">
            <p className="text-(--danger)">{t("invalidToken")}</p>
            <Link
              href={`/${locale}/forgot-password`}
              className="inline-block mt-4 text-(--primary) hover:text-(--primary-hover)"
            >
              {t("forgotPassword")}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen">
        <section className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("resetPasswordTitle")}
          </h1>
        </section>

        <section className="max-w-md mx-auto px-6 pb-16">
          <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-500 font-medium">{t("passwordResetSuccess")}</p>
            </div>
            
            <Link
              href={`/${locale}/login`}
              className="inline-block mt-4 px-6 py-3 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors"
            >
              {t("signIn")}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {t("resetPasswordTitle").split(" ")[0]}{" "}
          <span className="text-(--primary)">
            {t("resetPasswordTitle").split(" ").slice(1).join(" ")}
          </span>
        </h1>
        <p className="text-xl text-(--text-muted)">{t("resetPasswordDesc")}</p>
      </section>

      {/* Reset Password Form */}
      <section className="max-w-md mx-auto px-6 pb-16">
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              isInvalidToken
                ? "bg-(--danger-bg) border border-(--danger-border) text-(--danger)"
                : "bg-(--danger-bg) border border-(--danger-border) text-(--danger)"
            }`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t("newPassword")}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg focus:border-(--primary) focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                {t("confirmNewPassword")}
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg focus:border-(--primary) focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("resettingPassword") : t("resetPassword")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href={`/${locale}/login`}
              className="text-(--primary) hover:text-(--primary-hover) transition-colors"
            >
              ← {t("backToLogin")}
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-(--text-muted) hover:text-(--primary) transition-colors"
          >
            <span>←</span>
            <span>{t("backToHome")}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
