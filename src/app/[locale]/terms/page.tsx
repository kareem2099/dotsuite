import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

const EFFECTIVE_DATE = "May 24, 2026";
const CONTACT_EMAIL = "kareem209907@gmail.com";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });
  return {
    title: `${t("pageTitle")} — DotSuite`,
    description: t("intro"),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });

  const prohibited = [
    { icon: "🔞", key: "s4i1" },
    { icon: "💊", key: "s4i2" },
    { icon: "🎰", key: "s4i3" },
    { icon: "🏴‍☠️", key: "s4i4" },
    { icon: "⚔️", key: "s4i5" },
    { icon: "🤖", key: "s4i6" },
    { icon: "🎭", key: "s4i7" },
    { icon: "🦠", key: "s4i8" },
    { icon: "👤", key: "s4i9" },
    { icon: "⚖️", key: "s4i10" },
  ] as const;

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-(--primary)">{t("pageTitle")}</span>
          </h1>
          <p className="text-(--text-muted) text-sm">
            {t("effectiveDate")}: <strong>{EFFECTIVE_DATE}</strong> —{" "}
            {t("lastUpdated")}: <strong>{EFFECTIVE_DATE}</strong>
          </p>
          <p className="text-(--text-muted) mt-3 text-sm leading-relaxed">
            {t("intro")}
          </p>
        </div>

        <div className="space-y-6">
          {/* 1 */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("s1Title")}</h2>
            <p className="text-(--text-muted) leading-relaxed">{t("s1Body")}</p>
          </section>

          {/* 2 */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("s2Title")}</h2>
            <p className="text-(--text-muted) leading-relaxed">{t("s2Body")}</p>
          </section>

          {/* 3 */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("s3Title")}</h2>
            <p className="text-(--text-muted) leading-relaxed mb-4">{t("s3Intro")}</p>
            <ul className="text-(--text-muted) space-y-2 list-disc list-inside leading-relaxed">
              {(["s3i1","s3i2","s3i3","s3i4","s3i5","s3i6"] as const).map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
          </section>

          {/* 4 — Prohibited */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6 border-l-4 border-l-red-500">
            <h2 className="text-2xl font-semibold mb-4 text-red-500">{t("s4Title")}</h2>
            <p className="text-(--text-muted) leading-relaxed mb-4">{t("s4Intro")}</p>
            <ul className="text-(--text-muted) space-y-3 list-none leading-relaxed">
              {prohibited.map(({ icon, key }) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{icon}</span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5 — Owner Rights */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6 border-l-4 border-l-(--primary)">
            <h2 className="text-2xl font-semibold mb-4">{t("s5Title")}</h2>
            <p className="text-(--text-muted) leading-relaxed mb-4">{t("s5Intro")}</p>
            <ul className="text-(--text-muted) space-y-3 list-disc list-inside leading-relaxed">
              {(["s5i1","s5i2","s5i3","s5i4","s5i5"] as const).map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
          </section>

          {/* 6 — Owner Obligations */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("s6Title")}</h2>
            <p className="text-(--text-muted) leading-relaxed mb-4">{t("s6Intro")}</p>
            <ul className="text-(--text-muted) space-y-3 list-disc list-inside leading-relaxed">
              {(["s6i1","s6i2","s6i3","s6i4"] as const).map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
          </section>

          {/* 7 — User Rights */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("s7Title")}</h2>
            <ul className="text-(--text-muted) space-y-3 list-disc list-inside leading-relaxed">
              {(["s7i1","s7i2","s7i3","s7i4","s7i5"] as const).map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
          </section>

          {/* 8 */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("s8Title")}</h2>
            <p className="text-(--text-muted) leading-relaxed">{t("s8Body")}</p>
          </section>

          {/* 9 */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("s9Title")}</h2>
            <p className="text-(--text-muted) leading-relaxed">{t("s9Body")}</p>
          </section>

          {/* 10 */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("s10Title")}</h2>
            <p className="text-(--text-muted) leading-relaxed">{t("s10Body")}</p>
          </section>

          {/* 11 — Contact */}
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("s11Title")}</h2>
            <p className="text-(--text-muted) leading-relaxed">
              {t("s11Body")}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-(--primary) hover:underline font-medium"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex flex-wrap gap-6 justify-center text-sm">
          <Link href={`/${locale}/privacy`} className="text-(--primary) hover:text-(--primary-hover) transition-colors">
            {t("privacyLink")}
          </Link>
          <Link href={`/${locale}/contact`} className="text-(--primary) hover:text-(--primary-hover) transition-colors">
            {t("contactLink")}
          </Link>
          <Link href={`/${locale}`} className="text-(--text-muted) hover:text-(--text) transition-colors">
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
