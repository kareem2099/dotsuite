import DeletionRequest from "./DeletionRequest";
import type { DeletionRequestCopy } from "./deletion-request-copy";
import type { PrivacyLanguage } from "./privacy-language";
import type { PrivacyPolicyCopy } from "./privacy-policy-copy";

type LinkItem = { href: string; label: string };

type Props = {
  /** Anchor prefix: #appId, #delete-appId and #appId-data. */
  appId: string;
  language: PrivacyLanguage;
  policy: PrivacyPolicyCopy;
  deletion: DeletionRequestCopy;
  providerLinks: LinkItem[];
  /** Extra buttons next to "request deletion" and "read the policy", e.g. the app's terms. */
  extraLinks?: LinkItem[];
};

/** One app's privacy section on the shared privacy page: intro, deletion request and data practices. */
export default function AppPrivacy({ appId, language, policy: t, deletion, providerLinks, extraLinks = [] }: Props) {
  return (
    <div lang={language} dir={language === "ar" ? "rtl" : "ltr"} className="space-y-6 mb-12">
      <section id={appId} className="scroll-mt-28 rounded-2xl border border-(--primary)/40 bg-(--card-bg) p-6 md:p-8">
        <p className="text-xs uppercase tracking-widest text-(--primary) font-semibold mb-3">DotSuite · Android</p>
        <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
        <p className="text-(--text-muted) leading-8">{t.intro}</p>
        <p className="text-sm text-(--text-muted) mt-3">{t.updated}</p>
        <nav aria-label={t.title} className="flex flex-wrap gap-3 mt-6">
          <a href={`#delete-${appId}`} className="rounded-xl px-5 py-3 bg-(--primary) text-(--background) font-semibold focus-visible:outline-2 focus-visible:outline-offset-4">{t.request}</a>
          <a href={`#${appId}-data`} className="rounded-xl border border-(--card-border) px-5 py-3 focus-visible:outline-2 focus-visible:outline-offset-4">{t.policy}</a>
          {extraLinks.map(link => (
            <a key={link.href} href={link.href} className="rounded-xl border border-(--card-border) px-5 py-3 focus-visible:outline-2 focus-visible:outline-offset-4">{link.label}</a>
          ))}
        </nav>
      </section>
      <DeletionRequest appId={appId} copy={deletion} />
      <section id={`${appId}-data`} className="scroll-mt-28 rounded-2xl border border-(--card-border) bg-(--card-bg) p-6 md:p-8 space-y-7">
        {t.sections.map(([title, text]) => (
          <div key={title}>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-(--text-muted) leading-8">{text}</p>
          </div>
        ))}
        <div>
          <h3 className="font-semibold mb-3">{t.linksTitle}</h3>
          <ul className="flex flex-wrap gap-x-5 gap-y-3 text-(--primary) underline underline-offset-4">
            {providerLinks.map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
          </ul>
        </div>
      </section>
    </div>
  );
}
