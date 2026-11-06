import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { privacyLanguages, privacyLanguageNames } from "@/components/privacy/privacy-language";
import { dotReminderTermsPath, getDotReminderTerms } from "@/lib/dotreminder-terms";

type Props = { params: Promise<{ locale: string }> };
const ORIGIN = "https://dotsuite.dev";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language, title, labels } = getDotReminderTerms((await params).locale);
  const url = `${ORIGIN}${dotReminderTermsPath(language)}`;
  return {
    title, description: labels.description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(privacyLanguages.map(locale => [locale, `${ORIGIN}${dotReminderTermsPath(locale)}`])),
        "x-default": `${ORIGIN}${dotReminderTermsPath("en")}`,
      },
    },
    openGraph: { title, description: labels.description, url, type: "article" },
  };
}

export default async function DotReminderTermsPage({ params }: Props) {
  const { language, title, body, labels } = getDotReminderTerms((await params).locale);
  return (
    <div lang={language} dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-(--primary) font-semibold mb-3" dir="ltr">DotSuite · Android</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 break-words [hyphens:auto]">{title}</h1>
          <p className="text-(--text-muted) leading-8 mb-6">{labels.description}</p>
          <nav aria-label={labels.languages} className="flex flex-wrap gap-2">
            {privacyLanguages.map(locale => (
              <Link key={locale} href={dotReminderTermsPath(locale)} hrefLang={locale} lang={locale}
                aria-current={locale === language ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 ${locale === language ? "border-(--primary) text-(--primary)" : "border-(--card-border) text-(--text-muted) hover:text-(--primary)"}`}>
                {privacyLanguageNames[locale]}
              </Link>
            ))}
          </nav>
        </header>
        <article className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-5 sm:p-8 [overflow-wrap:anywhere]">
          <ReactMarkdown components={{
            h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-semibold mt-9 mb-4 leading-relaxed">{children}</h2>,
            p: ({ children }) => <p className="text-(--text-muted) leading-8 mb-4">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold text-(--foreground)">{children}</strong>,
            a: ({ href, children }) => <a href={href} className="text-(--primary) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{children}</a>,
          }}>{body}</ReactMarkdown>
        </article>
        <nav aria-label={title} className="mt-8 flex flex-wrap gap-4 text-sm text-(--primary) underline underline-offset-4">
          <Link href={`/${language}/privacy#dotreminder`}>{labels.privacy}</Link>
          <Link href={`/${language}/privacy#delete-dotreminder`}>{labels.deletion}</Link>
          <a href={`https://github.com/kareem2099/DotReminder/blob/main/docs/legal/terms.${language}.md`}>{labels.source}</a>
        </nav>
      </div>
    </div>
  );
}
