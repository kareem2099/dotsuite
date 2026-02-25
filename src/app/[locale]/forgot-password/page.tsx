"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ForgotPassword() {
  const t = useTranslations("Auth");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || "en";
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen">
        <section className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("forgotPasswordTitle")}
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
              <p className="text-green-500 font-medium">{t("resetLinkSent")}</p>
            </div>
            
            <Link
              href={`/${locale}/login`}
              className="inline-block mt-4 px-6 py-3 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors"
            >
              {t("backToLogin")}
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
          {t("forgotPasswordTitle").split(" ")[0]}{" "}
          <span className="text-(--primary)">
            {t("forgotPasswordTitle").split(" ").slice(1).join(" ")}
          </span>
        </h1>
        <p className="text-xl text-(--text-muted)">{t("forgotPasswordDesc")}</p>
      </section>

      {/* Forgot Password Form */}
      <section className="max-w-md mx-auto px-6 pb-16">
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              isSuccess 
                ? "bg-green-500/10 border border-green-500/20 text-green-500"
                : "bg-red-500/10 border border-red-500/20 text-red-500"
            }`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg focus:border-(--primary) focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("sendingResetLink") : t("sendResetLink")}
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
