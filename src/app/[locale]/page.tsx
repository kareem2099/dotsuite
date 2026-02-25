import Link from "next/link";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  const products = [
    {
      title: t("vsCodeExtension"),
      description: t("vsCodeExtensionDesc"),
      icon: "📝",
    },
    {
      title: t("nextjsTools"),
      description: t("nextjsToolsDesc"),
      icon: "⚡",
    },
    {
      title: t("pythonSolutions"),
      description: t("pythonSolutionsDesc"),
      icon: "🐍",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-block px-4 py-2 mb-6 text-sm font-medium text-(--primary) bg-(--primary)/10 rounded-full border border-(--primary)/20">
          {t("heroBadge")}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {t("title")}{" "}
          <span className="text-(--primary)">dotsuite</span>
        </h1>
        <p className="text-xl text-(--text-muted) max-w-2xl mx-auto mb-10">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/product`}
            className="px-8 py-4 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors duration-200"
          >
            {t("viewProducts")}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="px-8 py-4 border border-(--card-border) text-(--foreground) font-semibold rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors duration-200"
          >
            {t("learnMore")}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("whatWeOffer")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-(--primary) transition-colors duration-300"
            >
              <div className="text-4xl mb-4">{product.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{product.title}</h3>
              <p className="text-(--text-muted)">{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="p-12 bg-(--card-bg) border border-(--card-border) rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("readyToBoost")}
          </h2>
          <p className="text-(--text-muted) mb-8 max-w-xl mx-auto">
            {t("ctaDescription")}
          </p>
          <Link
            href={`/${locale}/product`}
            className="inline-block px-8 py-4 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors duration-200"
          >
            {t("getStarted")}
          </Link>
        </div>
      </section>
    </div>
  );
}
