import AppPrivacy from "./AppPrivacy";
import { dotShredzillaDeletionCopy, dotShredzillaPolicyCopy } from "./dotshredzilla-privacy-copy";
import { getPrivacyLanguage } from "./privacy-language";
import { dotShredzillaTermsLabels, dotShredzillaTermsPath } from "@/lib/dotshredzilla-terms";

export default function DotShredzillaPrivacy({ locale }: { locale: string }) {
  const language = getPrivacyLanguage(locale);
  return (
    <AppPrivacy
      appId="dotshredzilla"
      language={language}
      policy={dotShredzillaPolicyCopy[language]}
      deletion={dotShredzillaDeletionCopy[language]}
      extraLinks={[{ href: dotShredzillaTermsPath(language), label: dotShredzillaTermsLabels[language].terms }]}
      providerLinks={[{ href: "https://policies.google.com/privacy", label: "Google / Firebase / AdMob" }]}
    />
  );
}
