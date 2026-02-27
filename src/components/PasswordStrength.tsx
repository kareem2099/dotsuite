"use client";

import { useTranslations } from "next-intl";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const t = useTranslations("PasswordStrength");

  const requirements = [
    { label: t("minChars"), test: (p: string) => p.length >= 8 },
    { label: t("uppercase"), test: (p: string) => /[A-Z]/.test(p) },
    { label: t("lowercase"), test: (p: string) => /[a-z]/.test(p) },
    { label: t("number"), test: (p: string) => /\d/.test(p) },
    { label: t("special"), test: (p: string) => /[!@#$%^&*]/.test(p) },
  ];

  const passedRequirements = requirements.filter((req) => req.test(password));
  const progress = (passedRequirements.length / requirements.length) * 100;

  const getColor = () => {
    if (progress <= 20) return "bg-red-500";
    if (progress <= 40) return "bg-red-400";
    if (progress <= 60) return "bg-yellow-500";
    if (progress <= 80) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getTextColor = () => {
    if (progress <= 20) return "text-(--danger)";
    if (progress <= 40) return "text-red-400";
    if (progress <= 60) return "text-yellow-500";
    if (progress <= 80) return "text-yellow-400";
    return "text-green-500";
  };

  const getStrengthText = () => {
    if (progress <= 20) return t("veryWeak");
    if (progress <= 40) return t("weak");
    if (progress <= 60) return t("medium");
    if (progress <= 80) return t("strong");
    return t("veryStrong");
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${getTextColor()} min-w-20`}>
          {getStrengthText()}
        </span>
      </div>

      {/* Requirements List */}
      <ul className="space-y-1">
        {requirements.map((req, index) => {
          const isPassed = req.test(password);
          return (
            <li
              key={index}
              className={`text-sm flex items-center gap-2 ${
                isPassed
                  ? "text-green-500 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <svg
                className={`w-4 h-4 shrink-0 ${
                  isPassed ? "text-green-500" : "text-gray-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isPassed ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                )}
              </svg>
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
