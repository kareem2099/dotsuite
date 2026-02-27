"use client";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <ErrorDisplay
      type="notfound"
      code="404"
      title={t("title")}
      message={t("message")}
      primaryAction={{ label: t("goHome"), href: `/${locale}` }}
      secondaryAction={{ label: t("viewProducts") || "View Products", href: `/${locale}/product` }}
    />
  );
}