import { type Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { products as staticProducts } from "@/config/products";
import Script from "next/script";

const BASE_URL = process.env.NEXTAUTH_URL || "https://dotsuite.dev";
const locales = ["en", "ar", "fr", "de", "ru"] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "dotsuite — VS Code Extensions & Developer Tools",
    ar: "dotsuite — إضافات VS Code وأدوات المطورين",
    fr: "dotsuite — Extensions VS Code & Outils Développeurs",
    de: "dotsuite — VS Code Erweiterungen & Entwickler-Tools",
    ru: "dotsuite — Расширения VS Code и инструменты разработчика",
  };

  const descriptions: Record<string, string> = {
    en: "dotsuite builds the developer tools you wish existed. 9+ VS Code extensions, Python utilities & web solutions — downloaded 13,000+ times and trusted by developers worldwide.",
    ar: "dotsuite تبني أدوات المطورين التي طالما تمنيتها. أكثر من 9 إضافات VS Code، أدوات Python وحلول ويب — حُمّلت أكثر من 13,000 مرة.",
    fr: "dotsuite crée les outils développeurs que vous souhaitiez avoir. Plus de 9 extensions VS Code, utilitaires Python et solutions web — téléchargées plus de 13 000 fois.",
    de: "dotsuite entwickelt die Entwickler-Tools, die Sie sich immer gewünscht haben. 9+ VS Code-Erweiterungen, Python-Tools und Web-Lösungen — über 13.000 Mal heruntergeladen.",
    ru: "dotsuite создаёт инструменты разработчика, о которых вы мечтали. 9+ расширений VS Code, Python-утилиты и веб-решения — загружены более 13 000 раз.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}`])
      ),
    },
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: `${BASE_URL}/${locale}`,
    },
  };
}

// ─── Static data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: "13,663+", labelKey: "statDownloads" },
  { value: "3,937+", labelKey: "statFollowers" },
  { value: "9", labelKey: "statTools" },
  { value: "62+", labelKey: "statArticles" },
] as const;

const WHY_FEATURES = [
  {
    icon: "🛡️",
    titleKey: "featureSecTitle",
    descKey: "featureSecDesc",
  },
  {
    icon: "🌍",
    titleKey: "featureLangTitle",
    descKey: "featureLangDesc",
  },
  {
    icon: "⚡",
    titleKey: "featurePerfTitle",
    descKey: "featurePerfDesc",
  },
  {
    icon: "🔓",
    titleKey: "featureOpenTitle",
    descKey: "featureOpenDesc",
  },
  {
    icon: "🔄",
    titleKey: "featureUpdTitle",
    descKey: "featureUpdDesc",
  },
  {
    icon: "🤝",
    titleKey: "featureSupTitle",
    descKey: "featureSupDesc",
  },
] as const;

const categoryColors: Record<string, string> = {
  vscode: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  python: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  nextjs: "text-white bg-white/10 border-white/20",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  // SSR the featured products (first 6) — Google sees them directly in HTML
  const featuredProducts = staticProducts.slice(0, 6);

  // BreadcrumbList JSON-LD for home
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BASE_URL}/${locale}`,
      },
    ],
  };

  // FAQ Schema JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faqQ1"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faqA1"),
        },
      },
      {
        "@type": "Question",
        name: t("faqQ2"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faqA2"),
        },
      },
      {
        "@type": "Question",
        name: t("faqQ3"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faqA3"),
        },
      },
      {
        "@type": "Question",
        name: t("faqQ4"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faqA4"),
        },
      },
      {
        "@type": "Question",
        name: t("faqQ5"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faqA5"),
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-breadcrumb-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-faq-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen">

        {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          {/* Background grid effect */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(var(--card-border) 1px, transparent 1px),
                linear-gradient(to right, var(--card-border) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-(--primary)/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium
                            bg-(--card-bg) border border-(--card-border) rounded-full
                            text-(--text-muted) shadow-sm">
              <span className="w-2 h-2 rounded-full bg-(--primary) animate-pulse" />
              Trusted by <strong className="text-(--foreground) mx-1">13,000+</strong> developers worldwide
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.08] tracking-tight">
              {t("heroLine1")}{" "}
              <span
                className="text-(--primary)"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {t("heroLine2")}
              </span>
            </h1>

            <p className="text-xl text-(--text-muted) max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/product`}
                id="cta-explore-products"
                className="group inline-flex items-center gap-2 px-8 py-4
                           bg-(--primary) text-(--background) font-semibold
                           rounded-xl hover:bg-(--primary-hover) transition-all
                           duration-200 shadow-lg hover:shadow-(--primary)/25
                           hover:-translate-y-0.5"
              >
                {t("exploreProducts")}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={`/${locale}/about`}
                id="cta-learn-more"
                className="inline-flex items-center gap-2 px-8 py-4
                           border border-(--card-border) text-(--foreground)
                           font-semibold rounded-xl hover:border-(--primary)
                           hover:text-(--primary) transition-all duration-200
                           hover:-translate-y-0.5"
              >
                {t("learnMore")}
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            STATS BAR
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="border-y border-(--card-border) bg-(--card-bg)">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map((stat) => (
                <div key={stat.labelKey}>
                  <div className="text-3xl md:text-4xl font-extrabold text-(--primary) tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-sm text-(--text-muted) mt-1">
                    {t(stat.labelKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FEATURED PRODUCTS (SSR — Google sees all content)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24" aria-labelledby="products-heading">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-(--primary) mb-3 block">
              {t("productsLabel")}
            </span>
            <h2 id="products-heading" className="text-3xl md:text-4xl font-bold mb-4">
              {t("productsTitle")}
            </h2>
            <p className="text-(--text-muted) max-w-xl mx-auto">
              {t("productsSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const translation = product.translations[locale as keyof typeof product.translations]
                ?? product.translations.en;
              const categoryColor = categoryColors[product.category] ?? "text-(--primary) bg-(--primary)/10 border-(--primary)/20";

              return (
                <Link
                  key={product._id}
                  href={`/${locale}/product/${product.slug}`}
                  className="group p-6 bg-(--card-bg) border border-(--card-border) rounded-xl
                             hover:border-(--primary) hover:-translate-y-1 hover:shadow-lg
                             transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${categoryColor}`}>
                      {product.category === "vscode" ? "VS Code" : product.category}
                    </span>
                    {product.hasLicense && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full
                                       bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Premium
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-(--primary) transition-colors">
                    {translation.title}
                  </h3>
                  <p className="text-sm text-(--text-muted) leading-relaxed">
                    {translation.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-(--primary)
                                  opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("viewProduct")}
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href={`/${locale}/product`}
              id="cta-view-all-products"
              className="inline-flex items-center gap-2 px-6 py-3
                         border border-(--card-border) text-(--foreground) font-medium
                         rounded-xl hover:border-(--primary) hover:text-(--primary)
                         transition-all duration-200"
            >
              {t("viewAllProducts")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            WHY DOTSUITE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-(--card-bg) border-y border-(--card-border)">
          <div className="max-w-6xl mx-auto px-6 py-24" aria-labelledby="why-heading">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-(--primary) mb-3 block">
                {t("whyLabel")}
              </span>
              <h2 id="why-heading" className="text-3xl md:text-4xl font-bold mb-4">
                {t("whyTitle")}
              </h2>
              <p className="text-(--text-muted) max-w-xl mx-auto">
                {t("whySubtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_FEATURES.map((feat) => (
                <div
                  key={feat.titleKey}
                  className="p-6 bg-(--background) border border-(--card-border) rounded-xl
                             hover:border-(--primary)/40 transition-colors duration-300"
                >
                  <div className="text-3xl mb-4">{feat.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{t(feat.titleKey)}</h3>
                  <p className="text-sm text-(--text-muted) leading-relaxed">{t(feat.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FAQ SECTION (Rich Snippets for Search Engines)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="border-t border-(--card-border)/50 bg-(--card-bg)/30">
          <div className="max-w-4xl mx-auto px-6 py-24" aria-labelledby="faq-heading">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-(--primary) mb-3 block">
                {t("faqLabel")}
              </span>
              <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold mb-4">
                {t("faqTitle")}
              </h2>
              <p className="text-(--text-muted) max-w-xl mx-auto">
                {t("faqSubtitle")}
              </p>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((idx) => (
                <details
                  key={idx}
                  className="group bg-(--background) border border-(--card-border) rounded-xl p-6 transition-all duration-200 open:border-(--primary)/50 open:shadow-sm"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-(--foreground) hover:text-(--primary) transition-colors">
                    <span>{t(`faqQ${idx}` as any)}</span>
                    <span className="ml-4 flex-shrink-0 text-(--primary) transition-transform duration-200 group-open:rotate-180">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-(--text-muted) leading-relaxed text-sm md:text-base border-t border-(--card-border)/60 pt-4">
                    {t(`faqA${idx}` as any)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CTA SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="relative overflow-hidden p-12 bg-(--card-bg) border border-(--card-border)
                          rounded-2xl text-center">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px]
                            bg-(--primary)/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative">
              <span className="text-xs font-semibold uppercase tracking-widest text-(--primary) mb-4 block">
                {t("ctaLabel")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("ctaTitle")}
              </h2>
              <p className="text-(--text-muted) mb-8 max-w-xl mx-auto leading-relaxed">
                {t("ctaDescription")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/${locale}/product`}
                  id="cta-get-started"
                  className="group inline-flex items-center gap-2 px-8 py-4
                             bg-(--primary) text-(--background) font-semibold
                             rounded-xl hover:bg-(--primary-hover) transition-all
                             duration-200 shadow-lg hover:shadow-(--primary)/25
                             hover:-translate-y-0.5"
                >
                  {t("getStarted")}
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  id="cta-contact-us"
                  className="inline-flex items-center gap-2 px-8 py-4
                             border border-(--card-border) text-(--foreground)
                             font-semibold rounded-xl hover:border-(--primary)
                             hover:text-(--primary) transition-all duration-200
                             hover:-translate-y-0.5"
                >
                  {t("contactUs")}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
