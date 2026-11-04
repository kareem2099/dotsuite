export const privacyLanguages = ["en", "ar", "de", "fr", "ru"] as const;
export type PrivacyLanguage = (typeof privacyLanguages)[number];

export const privacyLanguageNames: Record<PrivacyLanguage, string> = {
  en: "English", ar: "العربية", de: "Deutsch", fr: "Français", ru: "Русский",
};

export function getPrivacyLanguage(locale: string): PrivacyLanguage {
  return privacyLanguages.find(language => language === locale) ?? "en";
}
