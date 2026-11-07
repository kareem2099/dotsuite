import type { Metadata } from "next";
import { getPrivacyLanguage, privacyLanguages } from "@/components/privacy/privacy-language";
import { mobileAppCopy } from "@/config/mobile-app-copy";

const BASE_URL = process.env.NEXTAUTH_URL || "https://dotsuite.dev";
type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const copy = mobileAppCopy[getPrivacyLanguage(locale)];
  const title = copy.catalog;
  const description = copy.catalogIntro;
  const ogImageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}&brand=dotsuite`;

  return {
    title: title,
    description: description,
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
        privacyLanguages.map((l) => [l, `${BASE_URL}/${l}/product`])
      ),
    },
    openGraph: {
      type: "website",
      title: title,
      description: description,
      url: `${BASE_URL}/${locale}/product`,
      siteName: "dotsuite",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      creator: "@FreeRave2",
      site: "@FreeRave2",
      images: [ogImageUrl],
    },
  };
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
