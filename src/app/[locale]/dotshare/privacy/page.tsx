import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { dotSharePrivacyCopy, type DotShareBlock } from "@/components/privacy/dotshare-privacy-copy";
import { getPrivacyLanguage, privacyLanguageNames, privacyLanguages } from "@/components/privacy/privacy-language";
import { SUPPORT_EMAIL } from "@/lib/support";

type Props = { params: Promise<{ locale: string }> };

const path = (locale: string) => `/${locale}/dotshare/privacy`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const language = getPrivacyLanguage((await params).locale);
  const t = dotSharePrivacyCopy[language];
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: path(language),
      languages: Object.fromEntries(privacyLanguages.map(locale => [locale, path(locale)])),
    },
    openGraph: { type: "article", title: t.title, description: t.description, url: path(language) },
  };
}

/** **bold**, `code` and the support address become markup; everything else stays text. */
function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|support@dotsuite\.dev)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i} className="text-(--foreground) font-semibold">{rich(part.slice(2, -2))}</strong>;
    if (part.startsWith("`")) return <code key={i} dir="ltr" className="rounded bg-(--card-bg) border border-(--card-border) px-1.5 py-0.5 text-[0.9em] break-words">{part.slice(1, -1)}</code>;
    if (part === SUPPORT_EMAIL) return <a key={i} href={`mailto:${SUPPORT_EMAIL}`} className="text-(--primary) underline underline-offset-4">{part}</a>;
    return part;
  });
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-(--card-border)">
      <table className="w-full min-w-[36rem] text-sm text-start">
        <thead className="bg-(--card-bg)">
          <tr>{head.map(cell => <th key={cell} scope="col" className="px-4 py-3 text-start font-semibold">{cell}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row[0]} className="border-t border-(--card-border) align-top">
              {row.map((cell, i) => (
                <td key={i} className={`px-4 py-3 leading-7 ${i === 0 ? "font-medium" : "text-(--text-muted)"}`}>{rich(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ block }: { block: DotShareBlock }) {
  if ("p" in block) return <p className="text-(--text-muted) leading-8">{rich(block.p)}</p>;
  if ("list" in block) {
    return (
      <ul className="space-y-3 text-(--text-muted) leading-8 list-disc ps-6 marker:text-(--primary)">
        {block.list.map(item => <li key={item}>{rich(item)}</li>)}
      </ul>
    );
  }
  return <Table head={block.table.head} rows={block.table.rows} />;
}

export default async function DotSharePrivacyPage({ params }: Props) {
  const language = getPrivacyLanguage((await params).locale);
  const t = dotSharePrivacyCopy[language];
  // German, French and Russian show the English policy with a note in that language.
  const contentLanguage = t.translationNote ? "en" : language;
  const rtl = contentLanguage === "ar";

  return (
    <div lang={contentLanguage} dir={rtl ? "rtl" : "ltr"} className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-xs uppercase tracking-widest text-(--primary) font-semibold mb-3">{t.eyebrow}</p>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 break-words">{t.title}</h1>
      <p className="text-sm text-(--text-muted)">{t.updated}</p>

      <nav aria-label="Languages" className="flex flex-wrap gap-2 mt-6">
        {privacyLanguages.map(locale => (
          <Link key={locale} href={path(locale)} hrefLang={locale} lang={locale}
            aria-current={language === locale ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm ${language === locale ? "border-(--primary) text-(--primary)" : "border-(--card-border) text-(--text-muted) hover:text-(--primary)"}`}>
            {privacyLanguageNames[locale]}
          </Link>
        ))}
      </nav>

      {t.translationNote && (
        <p lang={language} dir="ltr" className="mt-6 rounded-xl border border-(--card-border) bg-(--card-bg) px-4 py-3 text-sm">{t.translationNote}</p>
      )}

      <div className="mt-8 space-y-4">
        {t.intro.map(paragraph => <p key={paragraph} className="text-lg text-(--text-muted) leading-8">{rich(paragraph)}</p>)}
      </div>

      <section aria-labelledby="glance" className="mt-10">
        <h2 id="glance" className="text-2xl font-semibold mb-4">{t.glanceTitle}</h2>
        <Table head={t.glance.head} rows={t.glance.rows} />
      </section>

      <section aria-labelledby="promises" className="mt-10 rounded-2xl border border-(--card-border) bg-(--card-bg) p-5 sm:p-8">
        <h2 id="promises" className="text-2xl font-semibold mb-4">{t.promisesTitle}</h2>
        <ul className="space-y-3">
          {t.promises.map(promise => (
            <li key={promise} className="flex gap-3 leading-7 text-(--text-muted)">
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-(--primary) font-bold">✕</span>
              <span>{rich(promise)}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-[14rem_1fr]">
        <nav aria-labelledby="toc" className="lg:sticky lg:top-24 lg:self-start">
          <h2 id="toc" className="text-sm font-semibold uppercase tracking-wider text-(--text-muted) mb-3">{t.tocTitle}</h2>
          <ol className="space-y-2 text-sm">
            {t.sections.map(section => (
              <li key={section.id}><a href={`#${section.id}`} className="text-(--text-muted) hover:text-(--primary)">{section.title}</a></li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-12">
          {t.sections.map(section => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28">
              <h2 id={`${section.id}-title`} className="text-2xl font-semibold mb-4">{section.title}</h2>
              <div className="space-y-5">
                {section.blocks.map((block, i) => <Block key={i} block={block} />)}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section aria-labelledby="related" className="mt-14 rounded-2xl border border-(--card-border) bg-(--card-bg) p-5 sm:p-8">
        <h2 id="related" className="font-semibold mb-3">{t.related.title}</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-(--primary) underline underline-offset-4">
          <li><Link href={`/${language}/privacy`}>{t.related.general}</Link></li>
          <li><Link href={`/${language}/terms`}>{t.related.terms}</Link></li>
          <li><a href="https://github.com/kareem2099/DotShare">{t.related.github}</a></li>
          <li><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
        </ul>
      </section>
    </div>
  );
}
