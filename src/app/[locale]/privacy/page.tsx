import Link from "next/link";
import type { Metadata } from "next";
import LegacyAppPrivacyLinks from "@/components/privacy/LegacyAppPrivacyLinks";
import { generalPrivacyCopy, privacyPageCopy } from "@/components/privacy/general-privacy-copy";
import { getPrivacyLanguage, privacyLanguages, privacyLanguageNames } from "@/components/privacy/privacy-language";
import { SUPPORT_EMAIL } from "@/lib/support";
import { dotSharePrivacyCopy } from "@/components/privacy/dotshare-privacy-copy";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const language = getPrivacyLanguage((await params).locale);
  const t = privacyPageCopy[language];
  return {
    title: t.pageTitle,
    description: `${t.pageTitle} · ${t.generalTitle}`,
    alternates: {
      canonical: `https://dotsuite.dev/${language}/privacy`,
      languages: Object.fromEntries(privacyLanguages.map(locale => [locale, `https://dotsuite.dev/${locale}/privacy`])),
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const language = getPrivacyLanguage((await params).locale);
  const t = privacyPageCopy[language];
  return (
    <div lang={language} dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 break-words [hyphens:auto]">{t.pageTitle}</h1>
        <nav aria-label={t.languages} className="flex flex-wrap gap-2 mb-8">
          {privacyLanguages.map(locale => (
            <Link key={locale} href={`/${locale}/privacy`} hrefLang={locale} lang={locale}
              aria-current={language === locale ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 ${language === locale ? "border-(--primary) text-(--primary)" : "border-(--card-border) text-(--text-muted) hover:text-(--primary)"}`}>
              {privacyLanguageNames[locale]}
            </Link>
          ))}
        </nav>
        <h2 className="text-2xl font-semibold mb-6">{t.generalTitle}</h2>
        <div className="space-y-6">
          {generalPrivacyCopy[language].map((section, index) => (
            <section key={section.title} className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
              {section.paragraphs.map(text => <p key={text} className="text-(--text-muted) leading-8 mb-3">{text}</p>)}
              {section.bullets && <ul className="list-disc ps-6 text-(--text-muted) space-y-2 mb-3 leading-7">{section.bullets.map(text => <li key={text}>{text}</li>)}</ul>}
              {section.closing && <p className="text-(--text-muted) leading-8">{section.closing}</p>}
              {index === generalPrivacyCopy[language].length - 1 && <a href={`mailto:${SUPPORT_EMAIL}`} dir="ltr" className="text-(--primary) underline underline-offset-4 break-all">{SUPPORT_EMAIL}</a>}
            </section>
          ))}
        </div>
        <Link href={`/${language}/dotshare/privacy`}
          className="mt-10 block rounded-xl border border-(--card-border) bg-(--card-bg) p-5 hover:border-(--primary) transition-colors">
          <span className="font-semibold">{dotSharePrivacyCopy[language].title}</span>
          <span className="block text-sm text-(--text-muted) mt-1">{dotSharePrivacyCopy[language].description}</span>
        </Link>
        <LegacyAppPrivacyLinks language={language} />
        <div className="mt-12 text-center">
          <Link href={`/${language}`} className="text-(--primary) hover:text-(--primary-hover) transition-colors">{t.back}</Link>
        </div>
      </div>
    </div>
  );
}
