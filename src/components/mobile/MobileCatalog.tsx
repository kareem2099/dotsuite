import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPrivacyLanguage } from "@/components/privacy/privacy-language";
import { mobileAppCopy } from "@/config/mobile-app-copy";
import { mobileApps, mobileAppIds, mobileAsset, mobileProductPath } from "@/config/mobile-apps";
import styles from "./mobile.module.css";

export default function MobileCatalog({ locale }: { locale: string }) {
  const language = getPrivacyLanguage(locale);
  const t = mobileAppCopy[language];
  return (
    <section id="android-apps" className={styles.catalog} aria-labelledby="android-apps-title">
      <h2 id="android-apps-title">{t.android}</h2>
      <div className={styles.catalogGrid}>
        {mobileAppIds.map(appId => {
          const app = mobileApps[appId];
          return (
            <Link key={appId} href={mobileProductPath(language, appId)} className={styles.catalogCard} data-app={appId}>
              <div className={styles.catalogText}>
                <Image src={mobileAsset(appId, "icon")} alt="" width={52} height={52} />
                <p>{t.apps[appId].category}</p>
                <h3>{app.name}</h3>
                <span>{t.details}<ArrowUpRight size={15} aria-hidden /></span>
              </div>
              <div className={styles.catalogArt} aria-hidden="true">
                <Image src={mobileAsset(appId, "home")} alt="" width={720} height={1490} unoptimized />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
