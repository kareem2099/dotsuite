"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleLogin from "@/components/GoogleLogin";
import GitHubLogin from "@/components/GitHubLogin";
import PasswordStrength from "@/components/PasswordStrength";
import { useTranslations } from "next-intl";
import { registerSchema, RegisterFormData } from "@/lib/validation";

export default function Register() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || "en";
  const isRTL = locale === "ar";
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || t("unexpectedError"));
        return;
      }

      // Show success message - don't auto-login, user needs to verify email first
      setSuccess(true);
    } catch (err) {
      setServerError(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {t("createAccount").split(" ")[0]}{" "}
          <span className="text-[#10b981]">
            {t("createAccount").split(" ").slice(1).join(" ")}
          </span>
        </h1>
        <p className="text-xl text-(--text-muted)">{t("joinDotsuite")}</p>
      </section>

      {/* Register Form */}
      <section className="max-w-md mx-auto px-6 pb-16">
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
          {serverError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {serverError}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
              {t("accountCreatedVerify")}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {t("fullName")}
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className={`w-full px-4 py-3 bg-(--background) border rounded-lg focus:border-[#10b981] focus:outline-none transition-colors ${
                  errors.name ? "border-red-500" : "border-(--card-border)"
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
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
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  className={`w-full px-4 py-3 ${isRTL ? "pl-12" : "pr-12"} bg-(--background) border rounded-lg focus:border-[#10b981] focus:outline-none transition-colors ${
                    errors.password ? "border-red-500" : "border-(--card-border)"
                  }`}
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3" : "right-3"} text-(--text-muted) hover:text-[#10b981] transition-colors`}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <PasswordStrength password={password} />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  className={`w-full px-4 py-3 ${isRTL ? "pl-12" : "pr-12"} bg-(--background) border rounded-lg focus:border-[#10b981] focus:outline-none transition-colors ${
                    errors.confirmPassword ? "border-red-500" : "border-(--card-border)"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3" : "right-3"} text-(--text-muted) hover:text-[#10b981] transition-colors`}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("terms")}
                  className="w-4 h-4 mt-1 rounded border-(--card-border) bg-(--background) text-[#10b981] focus:ring-[#10b981]"
                />
                <label htmlFor="terms" className="text-sm text-(--text-muted)">
                  {t("iAgreeTerms")}{" "}
                  <Link href={`/${locale}/terms`} className="text-[#10b981] hover:text-[#059669]">
                    {t("termsOfService")}
                  </Link>{" "}
                  {t("and")}{" "}
                  <Link href={`/${locale}/privacy`} className="text-[#10b981] hover:text-[#059669]">
                    {t("privacyPolicy")}
                  </Link>
                </label>
              </div>
              {/* Error message below the flex */}
              {errors.terms && (
                <p className="mt-1 text-sm text-red-500">{t(errors.terms.message as string)}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full px-6 py-3 bg-[#10b981] text-(--background) font-semibold rounded-lg hover:bg-[#059669] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("creatingAccount") : success ? t("redirecting") : t("signUp")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-(--text-muted)">
              {t("hasAccount")}{" "}
              <Link
                href={`/${locale}/login`}
                className="text-[#f59e0b] font-semibold hover:text-[#d97706] transition-colors"
              >
                {t("signIn")}
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-(--card-border)" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-(--card-bg) text-(--text-muted)">
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          {/* Social Register */}
          <div className="space-y-3">
            <GoogleLogin />
            <GitHubLogin />
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
