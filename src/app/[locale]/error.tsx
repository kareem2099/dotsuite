"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const t = useTranslations("Error");

  useEffect(() => { console.error("Application error:", error); }, [error]);

  return (
    <ErrorDisplay
      type="error"
      code="500"
      title={t("title")}
      message={error.message || t("message")}
      primaryAction={{ label: t("tryAgain"), onClick: reset }}
      secondaryAction={{ label: t("goBack"), onClick: () => router.back() }}
    />
  );
}