import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { privacyLanguages } from "@/components/privacy/privacy-language";
import AppLegalNav from "@/components/mobile/AppLegalNav";
import { updateLegacyPrivacyLink } from "@/lib/mobile-legal-links";
import { appTermsPath, getAppTerms, type AppTerms } from "@/lib/app-terms";

const ORIGIN = "https://dotsuite.dev";

export function appTermsMetadata(app: AppTerms, locale: string): Metadata {
  const { language, title, labels } = getAppTerms(app, locale);
  const url = `${ORIGIN}${appTermsPath(app, language)}`;
  return {
    title, description: labels.description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(privacyLanguages.map(other => [other, `${ORIGIN}${appTermsPath(app, other)}`])),
        "x-default": `${ORIGIN}${appTermsPath(app, "en")}`,
      },
    },
    openGraph: { title, description: labels.description, url, type: "article" },
  };
}

/** One app's terms of use in the visitor's language, with links to its privacy section and deletion request. */
export default function AppTermsPage({ app, locale }: { app: AppTerms; locale: string }) {
  const { language, title, body, labels } = getAppTerms(app, locale);
  return (
    <div lang={language} dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-(--primary) font-semibold mb-3" dir="ltr">DotSuite · Android</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 break-words [hyphens:auto]">{title}</h1>
          <p className="text-(--text-muted) leading-8 mb-6">{labels.description}</p>
          <AppLegalNav app={app.slug} language={language} document="terms" languagesLabel={labels.languages} />
        </header>
        <article className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-5 sm:p-8 [overflow-wrap:anywhere]">
          <ReactMarkdown components={{
            h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-semibold mt-9 mb-4 leading-relaxed">{children}</h2>,
            p: ({ children }) => <p className="text-(--text-muted) leading-8 mb-4">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold text-(--foreground)">{children}</strong>,
            a: ({ href, children }) => <a href={updateLegacyPrivacyLink(href)} className="text-(--primary) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{children}</a>,
          }}>{body}</ReactMarkdown>
        </article>
        <nav aria-label={title} className="mt-8 flex flex-wrap gap-4 text-sm text-(--primary) underline underline-offset-4">
          <a href={`https://github.com/${app.sourceRepo}/blob/main/docs/legal/terms.${language}.md`}>{labels.source}</a>
        </nav>
      </div>
    </div>
  );
}
