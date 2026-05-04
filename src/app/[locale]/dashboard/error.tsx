"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const t = useTranslations("Error");

  useEffect(() => { console.error("Dashboard error:", error); }, [error]);

  return (
    <ErrorDisplay
      type="error"
      title={t("title", { defaultMessage: "Something went wrong!" })}
      message={error.message || t("message", { defaultMessage: "An unexpected error occurred in the dashboard." })}
      primaryAction={{ label: t("tryAgain", { defaultMessage: "Try Again" }), onClick: reset }}
      secondaryAction={{ label: t("goHome", { defaultMessage: "Go Home" }), onClick: () => router.push(`/${locale}`) }}
    />
  );
}