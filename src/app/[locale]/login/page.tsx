"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GoogleLogin from "@/components/GoogleLogin";
import GitHubLogin from "@/components/GitHubLogin";
import { useTranslations } from "next-intl";

// Zod Schema for login
const loginSchema = z.object({
  email: z.string().email("invalidEmail"),
  password: z.string().min(1, "passwordRequired"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || "en";
  const isRTL = locale === "ar";
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Check for specific error types if needed (e.g., invalid credentials)
        if (result.error === "CredentialsSignin") {
          setError(t("invalidCredentials"));
        } else if (result.error === "EmailNotVerified") {
          setError(t("emailNotVerified") || "Please verify your email before logging in.");
        } else {
          // Handle other error cases
          setError(result.error);
        }
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
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
          {t("welcomeBack").split(" ")[0]}{" "}
          <span className="text-(--primary)">
            {t("welcomeBack").split(" ").slice(1).join(" ")}
          </span>
        </h1>
        <p className="text-xl text-(--text-muted)">{t("signInDesc")}</p>
      </section>

      {/* Login Form */}
      <section className="max-w-md mx-auto px-6 pb-16">
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`w-full px-4 py-3 bg-(--background) border rounded-lg focus:border-(--primary) focus:outline-none transition-colors ${
                  errors.email ? "border-red-500" : "border-(--card-border)"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{t(errors.email.message as string)}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  className={`w-full px-4 py-3 ${isRTL ? "pl-12" : "pr-12"} bg-(--background) border rounded-lg focus:border-(--primary) focus:outline-none transition-colors ${
                    errors.password ? "border-red-500" : "border-(--card-border)"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3" : "right-3"} text-(--text-muted) hover:text-(--primary) transition-colors`}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{t(errors.password.message as string)}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-(--card-border) bg-(--background) text-(--primary) focus:ring-(--primary)"
                />
                <span className="text-(--text-muted)">{t("rememberMe")}</span>
              </label>
              <Link
                href={`/${locale}/forgot-password`}
                className="text-sm text-(--primary) hover:text-(--primary-hover) transition-colors"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-(--text-muted)">
              {t("noAccount")}{" "}
              <Link
                href={`/${locale}/register`}
                className="text-[#f59e0b] font-semibold hover:text-[#d97706] transition-colors"
              >
                {t("signUp")}
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

          {/* Social Login - Using Separate Components */}
          <div className="space-y-3">
            <GoogleLogin />
            <GitHubLogin />
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
