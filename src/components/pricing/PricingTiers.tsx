"use client";

import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";
import Link from "next/link";

interface PricingTiersProps {
  /** Called from upgrade page instead of navigating to href */
  onUpgrade?: (tier: "basic" | "pro" | "max") => void;
  /** Which tier is currently loading checkout */
  upgradingTier?: string | null;
  /** The user's currently active tier (e.g. "free", "basic", "pro", "max") */
  currentTier?: string | null;
}

export default function PricingTiers({ onUpgrade, upgradingTier, currentTier }: PricingTiersProps = {}) {
  const t = useTranslations("Pricing");

  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: t("freeDesc", { defaultMessage: "Perfect to test the waters" }),
      features: [
        { name: t("featPosts100", { defaultMessage: "100 posts / month" }), included: true },
        { name: t("featImages10", { defaultMessage: "10 image posts / month" }), included: true },
        { name: t("featVideo", { defaultMessage: "Video posts" }), included: false },
        { name: t("featCron60", { defaultMessage: "1-hour scheduling window" }), included: true },
      ],
      buttonText: t("getStarted", { defaultMessage: "Get Started" }),
      buttonVariant: "outline",
      href: "/dashboard/keys",
    },
    {
      name: "Basic",
      price: "$5",
      period: "/mo",
      description: t("basicDesc", { defaultMessage: "For casual developers" }),
      features: [
        { name: t("featPosts300", { defaultMessage: "300 posts / month" }), included: true },
        { name: t("featImages100", { defaultMessage: "100 image posts / month" }), included: true },
        { name: t("featVideo", { defaultMessage: "Video posts" }), included: false },
        { name: t("featCron30", { defaultMessage: "30-min scheduling window" }), included: true },
      ],
      buttonText: t("subscribeBasic", { defaultMessage: "Subscribe to Basic" }),
      buttonVariant: "primary",
      isPopular: false,
      tier: "basic" as const,
      href: "/dashboard/dotshare/upgrade",
    },
    {
      name: "Pro",
      price: "$15",
      period: "/mo",
      description: t("proDesc", { defaultMessage: "For power users & creators" }),
      features: [
        { name: t("featPostsUnlimited", { defaultMessage: "Unlimited posts" }), included: true },
        { name: t("featImagesUnlimited", { defaultMessage: "Unlimited image posts" }), included: true },
        { name: t("featVideo", { defaultMessage: "Video posts" }), included: true },
        { name: t("featCron15", { defaultMessage: "15-min scheduling window" }), included: true },
      ],
      buttonText: t("subscribePro", { defaultMessage: "Subscribe to Pro" }),
      buttonVariant: "primary",
      isPopular: true,
      tier: "pro" as const,
      href: "/dashboard/dotshare/upgrade",
    },
    {
      name: "Max",
      price: "$30",
      period: "/mo",
      description: t("maxDesc", { defaultMessage: "The ultimate automation tier" }),
      features: [
        { name: t("featPostsUnlimited", { defaultMessage: "Unlimited posts" }), included: true },
        { name: t("featImagesUnlimited", { defaultMessage: "Unlimited image posts" }), included: true },
        { name: t("featVideo", { defaultMessage: "Video posts" }), included: true },
        { name: t("featInstant", { defaultMessage: "Instant Look-Ahead dispatch" }), included: true },
      ],
      buttonText: t("subscribeMax", { defaultMessage: "Get Max Power" }),
      buttonVariant: "gradient",
      tier: "max" as const,
      href: "/dashboard/dotshare/upgrade",
    },
  ];

  return (
    <div className="py-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          {t("title", { defaultMessage: "Simple, transparent pricing" })}
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          {t("subtitle", { defaultMessage: "Choose the perfect plan for your automated code sharing workflow." })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tiers.map((tier) => {
          const tierKey = (tier as { tier?: string }).tier;
          const isCurrentPlan =
            !!(currentTier && tierKey && currentTier === tierKey) ||
            (!tierKey && currentTier === "free");

          return (
          <div
            key={tier.name}
            className={`relative flex flex-col p-8 rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl ${
              isCurrentPlan
                ? "border-green-500 shadow-lg shadow-green-500/20 scale-105 z-10"
                : tier.isPopular
                ? "border-primary shadow-lg scale-105 z-10"
                : "border-border/50"
            }`}
          >
            {isCurrentPlan && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  ✓ Current Plan
                </span>
              </div>
            )}
            {!isCurrentPlan && tier.isPopular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {t("mostPopular", { defaultMessage: "Most Popular" })}
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground">{tier.name}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{tier.description}</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">{tier.price}</span>
              {tier.period && <span className="text-muted-foreground font-medium">{tier.period}</span>}
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground/50" />
                    )}
                  </div>
                  <span
                    className={`ml-3 text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/50 line-through"
                      }`}
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            {isCurrentPlan ? (
              <div className="w-full py-3 px-4 rounded-xl font-semibold text-center text-green-400 border border-green-500/40 bg-green-500/10 cursor-default">
                ✓ Your Current Plan
              </div>
            ) : tier.tier && onUpgrade ? (
              <button
                onClick={() => onUpgrade(tier.tier!)}
                disabled={!!upgradingTier}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                  tier.buttonVariant === "gradient"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                    : tier.buttonVariant === "primary"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {upgradingTier === tier.tier ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Loading…
                  </span>
                ) : tier.buttonText}
              </button>
            ) : (
              <Link
                href={tier.href}
                className={`block w-full text-center py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  tier.buttonVariant === "gradient"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                    : tier.buttonVariant === "primary"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {tier.buttonText}
              </Link>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
