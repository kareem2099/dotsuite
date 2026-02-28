"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/Toast";

// Zod Schema for resend verification
const resendSchema = z.object({
  email: z.string().email("invalidEmail"),
});

type ResendFormData = z.infer<typeof resendSchema>;

export default function ResendVerification() {
  const t = useTranslations("Auth");
  const { toast } = useToast();
  const params = useParams();
  const locale = params.locale as string || "en";
  const isRTL = locale === "ar";

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
  });

  const onSubmit = async (data: ResendFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success(t("verificationEmailSent") || "Verification email sent!");
      } else {
        toast.error(result.error || result.message || t("unexpectedError"));
      }
    } catch (err) {
      toast.error(t("unexpectedError"));
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
                  className={`w-full px-4 py-3 bg-(--background) border rounded-lg focus:border-(--primary) focus:outline-none transition-colors ${errors.email ? "border-red-500" : "border-(--card-border)"
                    }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-(--danger)">{t(errors.email.message as string)}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="text-(--primary) font-semibold hover:text-(--warning-hover) transition-colors"
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
