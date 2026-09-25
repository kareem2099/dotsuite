import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { ToastProvider } from "@/components/Toast";
import { ConfirmProvider } from "@/components/ConfirmModal";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import Script from "next/script";

const BASE_URL = process.env.NEXTAUTH_URL || "https://dotsuite.dev";
const locales = ["en", "ar", "fr", "de", "ru"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "dotsuite — Developer Productivity Tools",
    ar: "dotsuite — أدوات إنتاجية للمطورين",
    fr: "dotsuite — Outils de productivité pour développeurs",
    de: "dotsuite — Entwickler-Produktivitätswerkzeuge",
    ru: "dotsuite — Инструменты продуктивности для разработчиков",
  };

  const descriptions: Record<string, string> = {
    en: "dotsuite builds powerful VS Code extensions, Python tools, and web solutions trusted by 13,000+ developers worldwide. Open-source, multi-language, and always improving.",
    ar: "dotsuite تبني إضافات VS Code قوية وأدوات Python وحلول ويب موثوقة من قِبل أكثر من 13,000 مطور حول العالم.",
    fr: "dotsuite crée des extensions VS Code puissantes, des outils Python et des solutions web utilisées par plus de 13 000 développeurs dans le monde.",
    de: "dotsuite entwickelt leistungsstarke VS Code-Erweiterungen, Python-Tools und Web-Lösungen, denen über 13.000 Entwickler weltweit vertrauen.",
    ru: "dotsuite создаёт мощные расширения VS Code, Python-инструменты и веб-решения, которым доверяют более 13 000 разработчиков по всему миру.",
  };

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: titles[locale] ?? titles.en,
      template: "%s | dotsuite",
    },
    description: descriptions[locale] ?? descriptions.en,
    keywords: [
      "VS Code extensions",
      "developer tools",
      "developer productivity",
      "VS Code extension marketplace",
      "Python developer tools",
      "Next.js tools",
      "dotsuite",
      "CodeTune",
      "DotShare",
      "DotAegis",
      "open source developer tools",
    ],
    authors: [{ name: "dotsuite", url: "https://github.com/kareem2099" }],
    creator: "dotsuite",
    publisher: "dotsuite",
    category: "Software",
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_EG" : locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : locale === "ru" ? "ru_RU" : "en_US",
      url: `${BASE_URL}/${locale}`,
      siteName: "dotsuite",
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      images: [
        {
          url: `${BASE_URL}/api/og?title=dotsuite&subtitle=VS+Code+Extensions+%26+Developer+Tools&brand=dotsuite.dev`,
          width: 1200,
          height: 630,
          alt: "dotsuite — Developer Productivity Tools",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      creator: "@FreeRave2",
      site: "@FreeRave2",
      images: [`${BASE_URL}/api/og?title=dotsuite&brand=Developer+Tools`],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}`])
      ),
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
      shortcut: "/favicon.ico",
    },
    manifest: "/manifest.json",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Add Google Search Console verification token here when ready
      // google: "your-verification-token",
    },
  };
}

// ─── JSON-LD Schemas ─────────────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "dotsuite",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/icon.png`,
    width: 512,
    height: 512,
  },
  description:
    "dotsuite builds powerful VS Code extensions, Python tools, and web solutions trusted by 13,000+ developers worldwide.",
  foundingDate: "2024",
  sameAs: [
    "https://github.com/kareem2099",
    "https://dev.to/freerave",
    "https://x.com/FreeRave2",
    "https://www.linkedin.com/in/freerave/",
    "https://www.youtube.com/@DotFreeRave",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "kareem209907@gmail.com",
    contactType: "customer support",
    availableLanguage: ["English", "Arabic"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "dotsuite",
  description: "Developer productivity tools — VS Code extensions, Python tools, and web solutions.",
  publisher: { "@id": `${BASE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/en/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: ["en", "ar", "fr", "de", "ru"],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        {/* PWA theme colors */}
        <meta name="theme-color" content="#10b981" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="dotsuite" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Organization JSON-LD */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* WebSite JSON-LD with SearchAction */}
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <NextIntlClientProvider messages={messages}>
          <Providers>
            <ToastProvider>
              <ConfirmProvider>
                <ServiceWorkerRegister />
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-(--primary) focus:text-(--background) focus:rounded-lg focus:font-semibold focus:shadow-lg"
                >
                  Skip to main content
                </a>
                <Header />
                <main id="main-content" className="pt-20 flex-1">
                  {children}
                </main>
                <Footer />
              </ConfirmProvider>
            </ToastProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}