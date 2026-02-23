"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

interface LanguageSelectorProps {
  label?: string;
  className?: string;
}

export default function LanguageSelector({ label, className = "" }: LanguageSelectorProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
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
    <div className={className}>
      {label && (
        <label className="block text-sm text-(--text-muted) mb-1">{label}</label>
      )}
      <select
        value={locale}
        onChange={onSelectChange}
        disabled={isPending}
        className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm focus:border-[#10b981] focus:outline-none transition-colors"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
