import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL || "https://dotsuite.dev";
const locales = ["en", "ar", "fr", "de", "ru"] as const;

const titles: Record<string, string> = {
  en: "All Products — VS Code Extensions & Developer Tools | dotsuite",
  ar: "جميع المنتجات — إضافات VS Code وأدوات المطورين | dotsuite",
  fr: "Tous les produits — Extensions VS Code & Outils Développeurs | dotsuite",
  de: "Alle Produkte — VS Code Erweiterungen & Entwickler-Tools | dotsuite",
  ru: "Все продукты — Расширения VS Code и инструменты разработчика | dotsuite",
};

const descriptions: Record<string, string> = {
  en: "Browse all dotsuite developer tools — 9+ VS Code extensions, Python utilities, and web solutions. Open-source, free, actively maintained. Trusted by 13,000+ developers.",
  ar: "تصفح جميع أدوات dotsuite للمطورين — أكثر من 9 إضافات VS Code، وأدوات Python، وحلول ويب. مفتوح المصدر، مجاني، ومُصان بنشاط.",
  fr: "Parcourez tous les outils dotsuite — 9+ extensions VS Code, utilitaires Python et solutions web. Open-source, gratuit, activement maintenu.",
  de: "Alle dotsuite-Tools durchsuchen — 9+ VS Code-Erweiterungen, Python-Utilities und Web-Lösungen. Open-source, kostenlos, aktiv gepflegt.",
  ru: "Просмотрите все инструменты dotsuite — 9+ расширений VS Code, Python-утилиты и веб-решения. Open-source, бесплатно, активно поддерживается.",
};

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const ogImageUrl = `${BASE_URL}/api/og?title=All+Developer+Tools&subtitle=${encodeURIComponent("Browse 9+ open-source tools — VS Code, Python, Next.js")}&brand=dotsuite`;

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    keywords: [
      "VS Code extensions list",
      "developer tools catalog",
      "open source VS Code plugins",
      "Python developer utilities",
      "dotsuite products",
      "free developer tools",
      "CodeTune",
      "DotCommand",
    ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/product`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}/product`])
      ),
    },
    openGraph: {
      type: "website",
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `${BASE_URL}/${locale}/product`,
      siteName: "dotsuite",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "dotsuite — All Developer Tools",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      creator: "@FreeRave2",
      site: "@FreeRave2",
      images: [ogImageUrl],
    },
  };
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
