import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight, ExternalLink, Languages } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsToc from "@/components/docs/DocsToc";
import CopyPageButton from "@/components/docs/CopyPageButton";
import { docsHref, getDocsPage } from "@/lib/productDocs";

const BASE_URL = process.env.NEXTAUTH_URL || "https://dotsuite.dev";

type Params = Promise<{ locale: string; slug: string; page?: string[] }>;

// Docs pages are a single path segment; anything deeper is not a page
const pageSlugFrom = (page: string[] | undefined) => (page && page.length === 1 ? page[0] : page ? null : undefined);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug, page } = await params;
  const pageSlug = pageSlugFrom(page);
  if (pageSlug === null) return {};
  const data = await getDocsPage(slug, pageSlug, locale);
  if (!data) return {};

  const productTitle = data.product.translations.en.title;
  const title = `${data.page.title} · ${productTitle} Docs | dotsuite`;
  // Docs are written in English: every locale points search engines at the English URL
  const canonical = `${BASE_URL}${docsHref("en", slug, data.index, data.page.slug)}`;

  return {
    title,
    description: data.description || `${productTitle} documentation`,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description: data.description,
      url: canonical,
      siteName: "dotsuite",
    },
  };
}

export default async function ProductDocsPage({ params }: { params: Params }) {
  const { locale, slug, page } = await params;
  const pageSlug = pageSlugFrom(page);
  if (pageSlug === null) notFound();

  const data = await getDocsPage(slug, pageSlug, locale);
  if (!data) notFound();

  const t = await getTranslations({ locale, namespace: "Docs" });
  const tProduct = await getTranslations({ locale, namespace: "Product" });

  const { product, index } = data;
  const productTitle =
    product.translations[locale as keyof typeof product.translations]?.title ?? product.translations.en.title;
  const docsBase = `/${locale}/product/${slug}/docs`;
  const href = (pageSlug: string) => docsHref(locale, slug, index, pageSlug);

  const sections = index.sections.map((s) => ({
    title: s.title,
    pages: s.pages.map((p) => ({ slug: p.slug, title: p.title, href: href(p.slug) })),
  }));
  const search = data.search.map((e) => ({
    page: e.page,
    section: e.section,
    heading: e.heading,
    href: e.id ? `${href(e.slug)}#${e.id}` : href(e.slug),
  }));
  // Copied Markdown keeps working outside the site: make doc links absolute
  const copyMarkdown = data.markdown.replaceAll(`](${docsBase}`, `](${BASE_URL}${docsBase}`);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8 text-sm text-(--text-muted)">
          <Link href={`/${locale}/product`} className="hover:text-(--primary) transition-colors">
            {tProduct("backToProducts")}
          </Link>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          <Link href={`/${locale}/product/${slug}`} className="hover:text-(--primary) transition-colors">
            {productTitle}
          </Link>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          <span className="text-(--foreground) font-medium">{t("title")}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_210px]">
          {/* Left: navigation */}
          <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
            <div className="flex items-center gap-2 px-3 mb-5">
              <span className="font-bold text-lg">{productTitle}</span>
              {index.version && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-(--primary)/10 text-(--primary) border border-(--primary)/20">
                  v{index.version}
                </span>
              )}
            </div>
            <DocsSidebar
              sections={sections}
              search={search}
              activeSlug={data.page.slug}
              labels={{ search: t("search"), noResults: t("noResults"), menu: t("menu") }}
            />
          </aside>

          {/* Center: page */}
          <main className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm text-(--text-muted)">
                {data.section.title} <span className="mx-1">›</span>
                <span className="text-(--foreground)">{data.page.title}</span>
              </p>
              <div className="flex items-center gap-2">
                <CopyPageButton markdown={copyMarkdown} label={t("copyPage")} copiedLabel={t("copied")} />
                <a
                  href={data.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-(--card-border) bg-(--card-bg) hover:border-(--primary) transition-colors"
                >
                  {t("editOnGitHub")}
                  <ExternalLink className="w-3 h-3 text-(--text-muted)" />
                </a>
              </div>
            </div>

            {locale !== "en" && (
              <p className="flex items-center gap-2 mb-6 px-4 py-2.5 text-sm rounded-lg border border-(--card-border) bg-(--card-bg) text-(--text-muted)">
                <Languages className="w-4 h-4 shrink-0" />
                {t("englishOnly")}
              </p>
            )}

            <article className="p-6 sm:p-8 bg-(--card-bg) border border-(--card-border) rounded-xl [&_h1]:scroll-mt-24 [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24 [&_h4]:scroll-mt-24">
              <MarkdownRenderer
                content={data.markdown}
                githubRepo={product.githubRepo}
                branch="main"
                showToolbar={false}
                headingAnchors
                internalLinkPrefix={docsBase}
              />
            </article>

            {/* Previous / next */}
            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              {data.prev ? (
                <Link
                  href={href(data.prev.slug)}
                  className="group p-4 rounded-xl border border-(--card-border) bg-(--card-bg) hover:border-(--primary) transition-colors"
                >
                  <span className="flex items-center gap-1 text-xs text-(--text-muted)">
                    <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" /> {t("previous")}
                  </span>
                  <span className="block mt-1 font-semibold group-hover:text-(--primary)">{data.prev.title}</span>
                </Link>
              ) : <span />}
              {data.next && (
                <Link
                  href={href(data.next.slug)}
                  className="group p-4 rounded-xl border border-(--card-border) bg-(--card-bg) hover:border-(--primary) transition-colors text-right"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-(--text-muted)">
                    {t("next")} <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </span>
                  <span className="block mt-1 font-semibold group-hover:text-(--primary)">{data.next.title}</span>
                </Link>
              )}
            </div>
          </main>

          {/* Right: on this page */}
          <aside className="hidden xl:block xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
            <DocsToc items={data.toc} label={t("onThisPage")} />
          </aside>
        </div>
      </div>
    </div>
  );
}
