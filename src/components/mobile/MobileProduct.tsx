import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, FileText, Mail, Shield, Trash2 } from "lucide-react";
import { getPrivacyLanguage, privacyLanguages } from "@/components/privacy/privacy-language";
import { mobileAppCopy } from "@/config/mobile-app-copy";
import { mobileApps, mobileAsset, mobileDocumentPath, mobileProductPath, type MobileAppId } from "@/config/mobile-apps";
import { SUPPORT_EMAIL } from "@/lib/support";
import styles from "./mobile.module.css";

export function mobileProductMetadata(appId: MobileAppId, locale: string): Metadata {
  const language = getPrivacyLanguage(locale);
  const app = mobileApps[appId];
  const { category, intro } = mobileAppCopy[language].apps[appId];
  const title = `${app.name} · ${category}`;
  const path = mobileProductPath(language, appId);
  return {
    title,
    description: intro,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(privacyLanguages.map(l => [l, mobileProductPath(l, appId)])),
    },
    openGraph: { title, description: intro, url: path, images: [mobileAsset(appId, "icon")] },
    twitter: { card: "summary", title, description: intro, images: [mobileAsset(appId, "icon")] },
  };
}

export default function MobileProduct({ appId, locale }: { appId: MobileAppId; locale: string }) {
  const language = getPrivacyLanguage(locale);
  const t = mobileAppCopy[language];
  const app = mobileApps[appId];
  const copy = t.apps[appId];
  const resources = [
    { label: t.terms, href: mobileDocumentPath(language, appId, "terms"), icon: FileText },
    { label: t.privacy, href: mobileDocumentPath(language, appId, "privacy"), icon: Shield },
    { label: t.deletion, href: mobileDocumentPath(language, appId, "delete-account"), icon: Trash2 },
    { label: t.support, href: `mailto:${SUPPORT_EMAIL}?subject=${app.name}`, icon: Mail },
  ];

  return (
    <div className={styles.page} data-app={appId} lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <nav className={styles.breadcrumb} aria-label={t.catalog}>
        <Link href={`/${language}/product#android-apps`}>{t.catalog}</Link>
        <span aria-hidden="true">/</span><span aria-current="page">{app.name}</span>
      </nav>
      <section className={styles.hero} aria-labelledby="app-title">
        <div className={styles.intro}>
          <div className={styles.brand}>
            <Image src={mobileAsset(appId, "icon")} alt="" width={58} height={58} />
            <p>DotSuite / Android</p>
          </div>
          <h1 id="app-title">{app.name}</h1>
          <p className={styles.headline}>{copy.headline}</p>
          <p className={styles.description}>{copy.intro}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={`https://play.google.com/store/apps/details?id=${app.packageId}`}>{t.install}<ArrowUpRight size={17} aria-hidden /></a>
            <a className={styles.secondary} href="#app-resources">{t.resources}<ArrowDown size={16} aria-hidden /></a>
          </div>
        </div>
        <div className={styles.stage} aria-hidden="true">
          <div className={`${styles.phone} ${styles.phoneBehind}`}>
            <Image src={mobileAsset(appId, app.screens[1])} alt="" width={720} height={1490} unoptimized />
          </div>
          <div className={`${styles.phone} ${styles.phoneFront}`}>
            <Image src={mobileAsset(appId, app.screens[0])} alt="" width={720} height={1490} preload unoptimized />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="screens-title">
        <p className={styles.eyebrow}>{copy.category}</p>
        <h2 id="screens-title">{t.screenshots}</h2>
        <div className={styles.gallery}>
          {copy.features.map(([title, description], index) => (
            <figure className={styles.feature} key={app.screens[index]}>
              <div className={styles.featureArt}>
                <Image src={mobileAsset(appId, app.screens[index])} alt={`${app.name} · ${title}`} width={720} height={1490} unoptimized />
              </div>
              <figcaption>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="app-resources" className={`${styles.section} ${styles.resources}`} aria-labelledby="resources-title">
        <div>
          <p className={styles.eyebrow}>{app.name}</p>
          <h2 id="resources-title">{t.resources}</h2>
          <p className={styles.resourceIntro}>{t.resourceIntro}</p>
          <a className={styles.source} href={`https://github.com/${app.repository}`}>{t.source}<ArrowUpRight size={16} aria-hidden /></a>
        </div>
        <ul className={styles.resourceLinks}>
          {resources.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              {href.startsWith("mailto:") ? (
                <a href={href}><Icon size={19} aria-hidden /><span>{label}<small dir="ltr">{SUPPORT_EMAIL}</small></span><ArrowUpRight size={16} aria-hidden /></a>
              ) : (
                <Link href={href}><Icon size={19} aria-hidden /><span>{label}</span><ArrowUpRight size={16} aria-hidden /></Link>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
