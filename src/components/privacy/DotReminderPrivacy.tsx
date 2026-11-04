import DeletionRequest from "./DeletionRequest";
import { privacyPolicyCopy } from "./privacy-policy-copy";
import { getPrivacyLanguage } from "./privacy-language";

export default function DotReminderPrivacy({ locale }: { locale: string }) {
  const language = getPrivacyLanguage(locale);
  const t = privacyPolicyCopy[language];
  return (
    <div lang={language} dir={language === "ar" ? "rtl" : "ltr"} className="space-y-6 mb-12">
      <section id="dotreminder" className="scroll-mt-28 rounded-2xl border border-(--primary)/40 bg-(--card-bg) p-6 md:p-8">
        <p className="text-xs uppercase tracking-widest text-(--primary) font-semibold mb-3">DotSuite · Android</p>
        <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
        <p className="text-(--text-muted) leading-8">{t.intro}</p>
        <p className="text-sm text-(--text-muted) mt-3">{t.updated}</p>
        <nav aria-label={t.title} className="flex flex-wrap gap-3 mt-6">
          <a href="#delete-dotreminder" className="rounded-xl px-5 py-3 bg-(--primary) text-(--background) font-semibold focus-visible:outline-2 focus-visible:outline-offset-4">{t.request}</a>
          <a href="#dotreminder-data" className="rounded-xl border border-(--card-border) px-5 py-3 focus-visible:outline-2 focus-visible:outline-offset-4">{t.policy}</a>
        </nav>
      </section>
      <DeletionRequest language={language} />
      <section id="dotreminder-data" className="scroll-mt-28 rounded-2xl border border-(--card-border) bg-(--card-bg) p-6 md:p-8 space-y-7">
        {t.sections.map(([title, text]) => (
          <div key={title}>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-(--text-muted) leading-8">{text}</p>
          </div>
        ))}
        <div>
          <h3 className="font-semibold mb-3">{t.linksTitle}</h3>
          <ul className="flex flex-wrap gap-x-5 gap-y-3 text-(--primary) underline underline-offset-4">
            <li><a href="https://policies.google.com/privacy">Google / Firebase / AdMob</a></li>
            <li><a href="https://ai.google.dev/gemini-api/terms">Gemini API</a></li>
            <li><a href="https://www.facebook.com/privacy/policy/">Facebook</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
