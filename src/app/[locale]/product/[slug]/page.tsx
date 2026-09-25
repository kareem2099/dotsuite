import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products as staticProducts } from "@/config/products";
import { getProductDetails } from "@/lib/productData";
import ProductClient from "./ProductClient";
import Script from "next/script";

const BASE_URL = process.env.NEXTAUTH_URL || "https://dotsuite.dev";
const locales = ["en", "ar", "fr", "de", "ru"] as const;

// ─── Category labels for SEO ─────────────────────────────────────────────────
const categoryLabels: Record<string, string> = {
  vscode: "VS Code Extension",
  python: "Python Tool",
  nextjs: "Next.js Solution",
};

// ─── generateStaticParams — pre-render all product+locale combos ──────────────
export async function generateStaticParams() {
  return staticProducts.flatMap((product) =>
    locales.map((locale) => ({
      locale,
      slug: product.slug,
    }))
  );
}

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const product = staticProducts.find((p) => p.slug === slug);
  if (!product) return {};

  const translation =
    product.translations[locale as keyof typeof product.translations] ??
    product.translations.en;

  const title = translation.title;
  const description = translation.description;
  const categoryLabel = categoryLabels[product.category] ?? "Developer Tool";

  const seoTitle = `${title} — ${categoryLabel} | dotsuite`;
  const seoDescription = `${description}. Free and open-source ${categoryLabel.toLowerCase()} by dotsuite. Trusted by 13,000+ developers. Install directly from VS Code Marketplace.`;

  const keywords = [
    title,
    `${title} VS Code`,
    `${title} extension`,
    `${title} download`,
    categoryLabel,
    "VS Code extension",
    "developer productivity",
    "dotsuite",
    "open source developer tools",
  ].filter(Boolean);

  const ogImageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}&category=${encodeURIComponent(product.category)}&brand=dotsuite`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}/product/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}/product/${slug}`])
      ),
    },
    openGraph: {
      type: "website",
      title: seoTitle,
      description: seoDescription,
      url: `${BASE_URL}/${locale}/product/${slug}`,
      siteName: "dotsuite",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — ${categoryLabel} by dotsuite`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      creator: "@FreeRave2",
      site: "@FreeRave2",
      images: [ogImageUrl],
    },
  };
}

// ─── Server Component — fetches product data server-side ─────────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Find product in static config
  const product = staticProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  // Fetch GitHub + OpenVSX data directly on the server (fully SSR — Google sees all content)
  const productData = await getProductDetails(slug);
  if (!productData) notFound();

  // ─── JSON-LD: SoftwareApplication Schema ─────────────────────────────────
  const translation =
    product.translations[locale as keyof typeof product.translations] ??
    product.translations.en;

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: translation.title,
    description: translation.description,
    applicationCategory: product.category === "vscode"
      ? "DeveloperApplication"
      : "UtilitiesApplication",
    operatingSystem: product.category === "vscode"
      ? "Windows, macOS, Linux"
      : "Windows, macOS, Linux",
    url: `${BASE_URL}/${locale}/product/${product.slug}`,
    downloadUrl: product.extensionId
      ? `https://marketplace.visualstudio.com/items?itemName=FreeRave.${product.extensionId}`
      : `https://github.com/${product.githubRepo}`,
    offers: {
      "@type": "Offer",
      price: product.price ?? 0,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    softwareVersion: productData.github?.version ?? "N/A",
    author: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "dotsuite",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "dotsuite",
    },
    aggregateRating: productData.github?.stars > 0
      ? undefined
      : undefined,
    codeRepository: `https://github.com/${product.githubRepo}`,
    license: "https://opensource.org/licenses/MIT",
    keywords: [
      translation.title,
      categoryLabels[product.category] ?? "Developer Tool",
      "dotsuite",
      "developer tools",
    ].join(", "),
  };

  return (
    <>
      {/* SoftwareApplication JSON-LD */}
      <Script
        id={`schema-product-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      {/* Hand off to Client Component for interactive parts */}
      <ProductClient
        initialData={productData}
        locale={locale}
        slug={slug}
      />
    </>
  );
}