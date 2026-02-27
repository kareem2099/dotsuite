import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const BASE_URL = process.env.NEXTAUTH_URL || "";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "dotsuite - Developer Tools",
    template: "%s | dotsuite",
  },
  description: "VS Code extensions, Next.js tools, and Python solutions for developers",
  keywords: ["VS Code extensions", "developer tools", "Next.js", "Python", "dotsuite"],
  authors: [{ name: "kareem2099", url: "https://github.com/kareem2099" }],
  creator: "kareem2099",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "dotsuite",
    title: "dotsuite - Developer Tools",
    description: "VS Code extensions, Next.js tools, and Python solutions for developers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "dotsuite - Developer Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dotsuite - Developer Tools",
    description: "VS Code extensions, Next.js tools, and Python solutions for developers",
    creator: "@FreeRave2",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
};

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
      <body className="antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>
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
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}