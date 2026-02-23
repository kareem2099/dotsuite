"use client";

import { useTranslations } from "next-intl";

interface Props {
  twitter: string;
  github: string;
  isEditing: boolean;
  onChange: (field: "twitter" | "github", value: string) => void;
}

const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

interface SocialLink {
  key: "twitter" | "github";
  labelKey: string;
  prefix: string;
  baseUrl: string;
  value: string;
  icon: React.ReactNode;
}

export default function SocialLinks({ twitter, github, isEditing, onChange }: Props) {
  const t = useTranslations("Profile");

  const links: SocialLink[] = [
    {
      key: "twitter",
      labelKey: "twitterLabel",
      prefix: "x.com/",
      baseUrl: "https://x.com/",
      value: twitter,
      icon: <TwitterIcon />,
    },
    {
      key: "github",
      labelKey: "githubLabel",
      prefix: "github.com/",
      baseUrl: "https://github.com/",
      value: github,
      icon: <GitHubIcon />,
    },
  ];

  return (
    <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{t("socialLinks")}</h3>
        {!isEditing && (
          <span className="flex items-center gap-1.5 text-xs text-(--text-muted) bg-(--background) border border-(--card-border) px-3 py-1.5 rounded-full">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t("clickToUpdate")}
          </span>
        )}
      </div>
      <div className="space-y-4">
        {links.map(({ key, labelKey, prefix, baseUrl, value, icon }) => (
          <div key={key}>
            <label className="flex items-center gap-2 text-sm text-(--text-muted) mb-1">
              {icon}
              {t(labelKey as any)}
            </label>
            {isEditing ? (
              <div className="flex">
                <span className="px-4 py-3 bg-(--background) border border-r-0 border-(--card-border) rounded-l-lg text-sm text-(--text-muted)">
                  {prefix}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder={t("usernamePlaceholder")}
                  className="flex-1 px-4 py-3 bg-(--background) border border-(--card-border) rounded-r-lg text-sm focus:border-[#10b981] focus:outline-none transition-colors"
                />
              </div>
            ) : (
              <div className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm">
                {value ? (
                  <a
                    href={`${baseUrl}${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#10b981] hover:underline flex items-center gap-2"
                  >
                    {icon}
                    {key === "twitter" ? `@${value}` : value}
                  </a>
                ) : (
                  <span className="text-(--text-muted)">{t("notSet")}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
