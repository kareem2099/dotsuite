import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function About({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  const skills = [
    { name: t("skillVSCode"), level: 95 },
    { name: t("skillNextJS"), level: 90 },
    { name: t("skillPython"), level: 85 },
    { name: t("skillTypeScript"), level: 88 },
    { name: t("skillNodeJS"), level: 82 },
    { name: t("skillTailwind"), level: 92 },
  ];

  const timeline = [
    {
      year: "2024",
      title: t("timeline1Title"),
      description: t("timeline1Desc"),
    },
    {
      year: "2024",
      title: t("timeline2Title"),
      description: t("timeline2Desc"),
    },
    {
      year: "2025",
      title: t("timeline3Title"),
      description: t("timeline3Desc"),
    },
    {
      year: "2025",
      title: t("timeline4Title"),
      description: t("timeline4Desc"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {t("title")}
        </h1>
        <p className="text-xl text-(--text-muted) max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              {t("mission")}
            </h2>
            <p className="text-(--text-muted) text-lg mb-6">
              {t("missionDesc1")}
            </p>
            <p className="text-(--text-muted) text-lg">
              {t("missionDesc2")}
            </p>
          </div>
          <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
            <h3 className="text-xl font-bold mb-6 text-(--primary)">{t("whatWeDo")}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-(--primary) text-xl">▹</span>
                <span className="text-(--text-muted)">{t("whatWeDo1")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-(--primary) text-xl">▹</span>
                <span className="text-(--text-muted)">{t("whatWeDo2")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-(--primary) text-xl">▹</span>
                <span className="text-(--text-muted)">{t("whatWeDo3")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-(--primary) text-xl">▹</span>
                <span className="text-(--text-muted)">{t("whatWeDo4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("expertise")}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <div key={index} className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{skill.name}</span>
                <span className="text-(--primary)">{skill.level}%</span>
              </div>
              <div className="h-2 bg-(--card-border) rounded-full overflow-hidden">
                <div
                  className="h-full bg-(--primary) rounded-full"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("journey")}
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-(--card-border)" />
          <div className="space-y-12">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-1 md:text-right">
                  <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl">
                    <span className="text-(--primary) font-bold">{item.year}</span>
                    <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
                    <p className="text-(--text-muted) text-sm mt-1">{item.description}</p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-(--primary) rounded-full mx-4 relative z-10" />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="p-12 bg-(--card-bg) border border-(--card-border) rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("workTogether")}
          </h2>
          <p className="text-(--text-muted) mb-8 max-w-xl mx-auto">
            {t("workTogetherDesc")}
          </p>
          <a
            href="mailto:kareem209907@gmail.com"
            className="inline-block px-8 py-4 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors duration-200"
          >
            {t("getInTouch")}
          </a>
        </div>
      </section>
    </div>
  );
}
