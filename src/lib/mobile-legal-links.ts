import { mobileAppIds, mobileDocumentPath } from "@/config/mobile-apps";

export function legacyAppPrivacyPath(locale: string, hash: string) {
  for (const app of mobileAppIds) {
    if (hash === `#delete-${app}`) return mobileDocumentPath(locale, app, "delete-account");
    if (hash === `#${app}`) return mobileDocumentPath(locale, app, "privacy");
    if (hash === `#${app}-data`) return `${mobileDocumentPath(locale, app, "privacy")}${hash}`;
  }
  return undefined;
}

/** The bundled terms still contain the public URLs in the original source documents. */
export function updateLegacyPrivacyLink(href: string | undefined) {
  const legacy = href?.match(/^(?:https:\/\/dotsuite\.dev)?\/(en|ar|de|fr|ru)\/privacy(#[\w-]+)$/);
  return legacy ? legacyAppPrivacyPath(legacy[1], legacy[2]) ?? href : href;
}
