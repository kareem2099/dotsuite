"use client";

import { useTranslations } from "next-intl";

export const CATEGORY_ICONS: Record<string, string> = {
  vscode: "⚡",
  python: "🐍",
  nextjs: "▲",
};

interface TagFilterProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function TagFilter({ currentCategory, onCategoryChange }: TagFilterProps) {
  const t = useTranslations("Product");
  const categories = ["all", "vscode", "python", "nextjs"];

  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
            currentCategory === cat
              ? "bg-(--primary) text-(--background) shadow-md shadow-(--primary)/20 scale-[1.02]"
              : "bg-(--card-bg) border border-(--card-border) text-(--text-muted) hover:border-(--primary) hover:text-(--primary) hover:bg-(--primary)/5"
          }`}
        >
          {cat === "all" ? t("all") : (
            <span className="flex items-center gap-1.5">
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
