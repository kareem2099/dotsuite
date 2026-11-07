import type { Metadata } from "next";
import AppLegalNav from "@/components/mobile/AppLegalNav";
import { mobileApps, mobileDocumentPath, type MobileAppId } from "@/config/mobile-apps";
import { dotReminderTermsLabels } from "@/lib/dotreminder-terms";
import { dotShredzillaTermsLabels } from "@/lib/dotshredzilla-terms";
import DeletionRequest from "./DeletionRequest";
import { deletionRequestCopy } from "./deletion-request-copy";
import { dotShredzillaDeletionCopy, dotShredzillaPolicyCopy } from "./dotshredzilla-privacy-copy";
import { getPrivacyLanguage, privacyLanguages } from "./privacy-language";
import { privacyPolicyCopy } from "./privacy-policy-copy";

export type PrivacyDocument = "privacy" | "delete-account";

const googlePrivacy = { href: "https://policies.google.com/privacy", label: "Google / Firebase / AdMob" };
const appCopy = {
  dotreminder: {
    policy: privacyPolicyCopy,
    deletion: deletionRequestCopy,
    labels: dotReminderTermsLabels,
    providers: [
      googlePrivacy,
      { href: "https://ai.google.dev/gemini-api/terms", label: "Gemini API" },
      { href: "https://www.facebook.com/privacy/policy/", label: "Facebook" },
    ],
  },
  dotshredzilla: {
    policy: dotShredzillaPolicyCopy,
    deletion: dotShredzillaDeletionCopy,
    labels: dotShredzillaTermsLabels,
    providers: [googlePrivacy],
  },
};

function getCopy(app: MobileAppId, locale: string, document: PrivacyDocument) {
  const language = getPrivacyLanguage(locale);
  const copy = appCopy[app];
  const policy = copy.policy[language];
  const deletion = copy.deletion[language];
  const labels = copy.labels[language];
  const title = document === "privacy" ? `${mobileApps[app].name} · ${labels.privacy}` : deletion.title;
  return { language, policy, deletion, labels, title, providers: copy.providers };
}

export function appPrivacyMetadata(app: MobileAppId, locale: string, document: PrivacyDocument): Metadata {
  const { language, policy, deletion, title } = getCopy(app, locale, document);
  const description = document === "privacy" ? policy.intro : deletion.intro;
  const path = mobileDocumentPath(language, app, document);
  return {
    title, description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(privacyLanguages.map(other => [other, mobileDocumentPath(other, app, document)])),
    },
    openGraph: { type: "article", title, description, url: path, images: [] },
    twitter: { card: "summary", title, description, images: [] },
  };
}

export default function AppPrivacy({ app, locale, document }: { app: MobileAppId; locale: string; document: PrivacyDocument }) {
  const { language, policy, deletion, labels, title, providers } = getCopy(app, locale, document);
  return (
    <div lang={language} dir={language === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <p className="text-xs uppercase tracking-widest text-(--primary) font-semibold mb-3">DotSuite · Android</p>
      <AppLegalNav app={app} language={language} document={document} languagesLabel={labels.languages} />
      {document === "privacy" ? (
        <article id={app} className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-5 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 break-words">{title}</h1>
          <p className="text-(--text-muted) leading-8">{policy.intro}</p>
          <p className="text-sm text-(--text-muted) mt-3">{policy.updated}</p>
          <div id={`${app}-data`} className="mt-8 space-y-7 scroll-mt-28">
            {policy.sections.map(([heading, text]) => (
              <section key={heading}>
                <h2 className="text-xl font-semibold mb-3">{heading}</h2>
                <p className="text-(--text-muted) leading-8">{text}</p>
              </section>
            ))}
          </div>
        </article>
      ) : <DeletionRequest appId={app} copy={deletion} />}
      <section className="mt-6 rounded-2xl border border-(--card-border) bg-(--card-bg) p-5 sm:p-8">
        <h2 className="font-semibold mb-3">{policy.linksTitle}</h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-3 text-(--primary) underline underline-offset-4">
          {providers.map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
        </ul>
      </section>
    </div>
  );
}
