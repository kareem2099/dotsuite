import { getPrivacyLanguage, type PrivacyLanguage } from "@/components/privacy/privacy-language";

export type TermsLabels = {
  terms: string; languages: string; privacy: string; deletion: string; source: string; description: string;
};

/**
 * An app's terms of use as published on dotsuite.dev. The markdown is bundled from the app's own
 * repository (docs/legal/terms.<language>.md, via its scripts/export-terms.py), so viewing it never
 * depends on GitHub availability.
 */
export type AppTerms = {
  /** URL segment and privacy-page anchor, e.g. "dotreminder". */
  slug: string;
  documents: Record<PrivacyLanguage, string>;
  labels: Record<PrivacyLanguage, TermsLabels>;
  /** GitHub repository holding docs/legal, e.g. "kareem2099/DotReminder". */
  sourceRepo: string;
};

export const appTermsPath = (app: Pick<AppTerms, "slug">, language: PrivacyLanguage) => `/${language}/${app.slug}/terms`;

export function getAppTerms(app: AppTerms, locale: string) {
  const language = getPrivacyLanguage(locale);
  const [heading, ...body] = app.documents[language].split("\n");
  return { language, title: heading.replace(/^#\s+/, ""), body: body.join("\n").trim(), labels: app.labels[language] };
}
