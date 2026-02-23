"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

// Zod Schema for resend verification
const resendSchema = z.object({
  email: z.string().email("invalidEmail"),
});

type ResendFormData = z.infer<typeof resendSchema>;

export default function ResendVerification() {
  const t = useTranslations("Auth");
  const params = useParams();
  const locale = params.locale as string || "en";
  const isRTL = locale === "ar";

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
  });

  const onSubmit = async (data: ResendFormData) => {
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(result.error || result.message || t("unexpectedError"));
      }
    } catch (err) {
      setError(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {t("resendVerificationTitle") || "Resend Verification"}
        </h1>
        <p className="text-xl text-(--text-muted)">
          {t("resendVerificationDesc") || "Enter your email address to receive a new verification link."}
        </p>
      </section>

      {/* Resend Verification Form */}
      <section className="max-w-md mx-auto px-6 pb-16">
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
              {t("verificationEmailSent") || "If an account exists and is not verified, a verification email has been sent."}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t("email")}
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`w-full px-4 py-3 bg-(--background) border rounded-lg focus:border-[#10b981] focus:outline-none transition-colors ${
                    errors.email ? "border-red-500" : "border-(--card-border)"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{t(errors.email.message as string)}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-[#10b981] text-(--background) font-semibold rounded-lg hover:bg-[#059669] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("sending") : t("resendVerificationBtn") || "Send Verification Email"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-(--text-muted)">
              {t("rememberPassword")}{" "}
              <Link
                href={`/${locale}/login`}
                className="text-[#f59e0b] font-semibold hover:text-[#d97706] transition-colors"
              >
                {t("signIn")}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-(--text-muted) hover:text-[#10b981] transition-colors"
          >
            <span>←</span>
            <span>{t("backToHome")}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
