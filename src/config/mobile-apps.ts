export const mobileApps = {
  dotreminder: {
    name: "DotReminder",
    packageId: "com.FreeRave.remindme",
    repository: "kareem2099/DotReminder",
    screens: ["home", "add", "calendar"],
  },
  dotshredzilla: {
    name: "DotShredzilla",
    packageId: "com.FreeRave.shredzilla",
    repository: "kareem2099/Shredzilla",
    screens: ["home", "workout", "records"],
  },
} as const;

export type MobileAppId = keyof typeof mobileApps;
export const appDocuments = ["terms", "privacy", "delete-account"] as const;
export type AppDocument = (typeof appDocuments)[number];
export const mobileAppIds = ["dotreminder", "dotshredzilla"] as const;

export function mobileProductPath(locale: string, app: MobileAppId) {
  return `/${locale}/product/${app}`;
}

export function mobileDocumentPath(locale: string, app: string, document: AppDocument) {
  return `/${locale}/${app}/${document}`;
}

export function mobileAsset(app: MobileAppId, image: string) {
  return `/products/${app}/${image}.webp`;
}
