import documents from "@/content/dotshredzilla-terms.json";
import type { PrivacyLanguage } from "@/components/privacy/privacy-language";
import { appTermsPath, type AppTerms, type TermsLabels } from "@/lib/app-terms";

// Text is generated from Shredzilla/docs/legal via scripts/export-terms.py.
export const dotShredzillaTermsLabels = {
  en: {
    terms: "DotShredzilla Terms of Use", languages: "Languages", privacy: "Privacy policy",
    deletion: "Delete account and data", source: "Source document",
    description: "Terms of use for DotShredzilla: workout tracking, training safety, account controls and your legal rights.",
  },
  ar: {
    terms: "شروط استخدام DotShredzilla", languages: "اللغات", privacy: "سياسة الخصوصية",
    deletion: "حذف الحساب والبيانات", source: "النص الأصلي",
    description: "شروط استخدام DotShredzilla: تسجيل التمارين وسلامة التمرين وإدارة الحساب وحقوقك القانونية.",
  },
  de: {
    terms: "DotShredzilla-Nutzungsbedingungen", languages: "Sprachen", privacy: "Datenschutzerklärung",
    deletion: "Konto und Daten löschen", source: "Quelldokument",
    description: "Nutzungsbedingungen für DotShredzilla: Trainingserfassung, sicheres Training, Kontoverwaltung und Ihre gesetzlichen Rechte.",
  },
  fr: {
    terms: "Conditions d’utilisation de DotShredzilla", languages: "Langues", privacy: "Politique de confidentialité",
    deletion: "Supprimer le compte et les données", source: "Document source",
    description: "Conditions d’utilisation de DotShredzilla : suivi d’entraînement, sécurité, gestion du compte et droits légaux.",
  },
  ru: {
    terms: "Условия использования DotShredzilla", languages: "Языки", privacy: "Политика конфиденциальности",
    deletion: "Удалить аккаунт и данные", source: "Исходный документ",
    description: "Условия использования DotShredzilla: учёт тренировок, безопасность, управление аккаунтом и законные права.",
  },
} satisfies Record<PrivacyLanguage, TermsLabels>;

export const dotShredzillaTerms: AppTerms = {
  slug: "dotshredzilla",
  documents,
  labels: dotShredzillaTermsLabels,
  sourceRepo: "kareem2099/Shredzilla",
};

export const dotShredzillaTermsPath = (language: PrivacyLanguage) => appTermsPath(dotShredzillaTerms, language);
