import Link from "next/link";
import { mobileAppCopy } from "@/config/mobile-app-copy";
import { appDocuments, mobileApps, mobileDocumentPath, mobileProductPath, type AppDocument, type MobileAppId } from "@/config/mobile-apps";
import { privacyLanguages, privacyLanguageNames, type PrivacyLanguage } from "@/components/privacy/privacy-language";

export default function AppLegalNav({ app, language, document, languagesLabel }: {
  app: MobileAppId; language: PrivacyLanguage; document: AppDocument; languagesLabel: string;
}) {
  const t = mobileAppCopy[language];
  const labels = { terms: t.terms, privacy: t.privacy, "delete-account": t.deletion };

  return (
    <div className="mb-8 space-y-4">
      <nav aria-label={`${mobileApps[app].name} · ${t.resources}`} className="flex flex-wrap items-center gap-2 text-sm">
        <Link href={mobileProductPath(language, app)} className="rounded-full border border-(--card-border) px-4 py-2 font-semibold hover:text-(--primary)">
          {mobileApps[app].name}
        </Link>
        {appDocuments.map(other => (
          <Link key={other} href={mobileDocumentPath(language, app, other)} aria-current={other === document ? "page" : undefined}
            className={`rounded-full border px-4 py-2 hover:text-(--primary) ${other === document ? "border-(--primary) text-(--primary)" : "border-(--card-border) text-(--text-muted)"}`}>
            {labels[other]}
          </Link>
        ))}
      </nav>
      <nav aria-label={languagesLabel} className="flex flex-wrap gap-3 text-sm">
        {privacyLanguages.map(other => (
          <Link key={other} href={mobileDocumentPath(other, app, document)} hrefLang={other} lang={other}
            aria-current={other === language ? "page" : undefined}
            className={other === language ? "font-semibold text-(--primary)" : "text-(--text-muted) hover:text-(--primary)"}>
            {privacyLanguageNames[other]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
