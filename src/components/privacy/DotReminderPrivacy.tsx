import AppPrivacy from "./AppPrivacy";
import { deletionRequestCopy } from "./deletion-request-copy";
import { privacyPolicyCopy } from "./privacy-policy-copy";
import { getPrivacyLanguage } from "./privacy-language";
import { dotReminderTermsLabels, dotReminderTermsPath } from "@/lib/dotreminder-terms";

export default function DotReminderPrivacy({ locale }: { locale: string }) {
  const language = getPrivacyLanguage(locale);
  return (
    <AppPrivacy
      appId="dotreminder"
      language={language}
      policy={privacyPolicyCopy[language]}
      deletion={deletionRequestCopy[language]}
      extraLinks={[{ href: dotReminderTermsPath(language), label: dotReminderTermsLabels[language].terms }]}
      providerLinks={[
        { href: "https://policies.google.com/privacy", label: "Google / Firebase / AdMob" },
        { href: "https://ai.google.dev/gemini-api/terms", label: "Gemini API" },
        { href: "https://www.facebook.com/privacy/policy/", label: "Facebook" },
      ]}
    />
  );
}
