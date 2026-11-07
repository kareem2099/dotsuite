"use client";

import Link from "next/link";
import { useEffect } from "react";
import { mobileAppCopy } from "@/config/mobile-app-copy";
import { mobileAppIds, mobileApps, mobileDocumentPath } from "@/config/mobile-apps";
import { legacyAppPrivacyPath } from "@/lib/mobile-legal-links";
import type { PrivacyLanguage } from "./privacy-language";

export default function LegacyAppPrivacyLinks({ language }: { language: PrivacyLanguage }) {
  useEffect(() => {
    function followOldLink() {
      const target = legacyAppPrivacyPath(language, window.location.hash);
      if (target) window.location.replace(target);
    }
    followOldLink();
    window.addEventListener("hashchange", followOldLink);
    return () => window.removeEventListener("hashchange", followOldLink);
  }, [language]);

  // Keep a usable route for visitors with scripting disabled and links shared before the split.
  const t = mobileAppCopy[language];
  return (
    <nav aria-label={t.legalIndex} className="mt-10 border-t border-(--card-border) pt-6">
      <h2 className="text-lg font-semibold mb-4">{t.legalIndex}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {mobileAppIds.map(app => (
          <div key={app} id={app} className="scroll-mt-28 rounded-xl border border-(--card-border) p-4">
            <p className="font-semibold mb-2">{mobileApps[app].name}</p>
            <ul className="space-y-2 text-(--primary) underline underline-offset-4">
              <li id={`${app}-data`} className="scroll-mt-28"><Link href={mobileDocumentPath(language, app, "privacy")}>{t.privacy}</Link></li>
              <li id={`delete-${app}`} className="scroll-mt-28"><Link href={mobileDocumentPath(language, app, "delete-account")}>{t.deletion}</Link></li>
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
