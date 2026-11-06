import documents from "@/content/dotreminder-terms.json";
import { getPrivacyLanguage, type PrivacyLanguage } from "@/components/privacy/privacy-language";

// Text is generated from DotReminder/docs/legal via scripts/export-terms.py.
// Bundle the public legal copy so viewing it never depends on GitHub availability.
export const dotReminderTermsPath = (language: PrivacyLanguage) => `/${language}/dotreminder/terms`;

export const dotReminderTermsLabels = {
  en: {
    terms: "DotReminder Terms of Use", languages: "Languages", privacy: "Privacy policy",
    deletion: "Request account deletion", source: "Source document",
    description: "Terms of use for DotReminder: reminders, optional AI, account controls and your legal rights.",
  },
  ar: {
    terms: "شروط استخدام DotReminder", languages: "اللغات", privacy: "سياسة الخصوصية",
    deletion: "طلب حذف الحساب", source: "النص الأصلي",
    description: "شروط استخدام DotReminder: التذكيرات والذكاء الاصطناعي الاختياري وإدارة الحساب وحقوقك القانونية.",
  },
  de: {
    terms: "DotReminder-Nutzungsbedingungen", languages: "Sprachen", privacy: "Datenschutzerklärung",
    deletion: "Kontolöschung beantragen", source: "Quelldokument",
    description: "Nutzungsbedingungen für DotReminder: Erinnerungen, optionale KI, Kontoverwaltung und Ihre gesetzlichen Rechte.",
  },
  fr: {
    terms: "Conditions d’utilisation de DotReminder", languages: "Langues", privacy: "Politique de confidentialité",
    deletion: "Demander la suppression du compte", source: "Document source",
    description: "Conditions d’utilisation de DotReminder : rappels, IA facultative, gestion du compte et droits légaux.",
  },
  ru: {
    terms: "Условия использования DotReminder", languages: "Языки", privacy: "Политика конфиденциальности",
    deletion: "Запросить удаление аккаунта", source: "Исходный документ",
    description: "Условия использования DotReminder: напоминания, дополнительный ИИ, управление аккаунтом и законные права.",
  },
} satisfies Record<PrivacyLanguage, Record<string, string>>;

export function getDotReminderTerms(locale: string) {
  const language = getPrivacyLanguage(locale);
  const markdown = documents[language];
  const [heading, ...body] = markdown.split("\n");
  return { language, title: heading.replace(/^#\s+/, ""), body: body.join("\n").trim(), labels: dotReminderTermsLabels[language] };
}
