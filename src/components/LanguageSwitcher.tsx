"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    
    const segments = pathname.split("/");
    // Remove the current locale from the path
    if (["en", "ar", "ru", "fr", "de"].includes(segments[1])) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }
    
    const newPath = segments.join("/");
    
    startTransition(() => {
      router.replace(newPath);
    });
  }

  return (
    <select
      aria-label={t("language")}
      value={locale}
      onChange={onSelectChange}
      disabled={isPending}
      className="bg-(--card-bg) border border-(--card-border) text-(--text-muted) text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-(--primary) transition-colors cursor-pointer"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
