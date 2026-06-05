"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";
import Link from "next/link";

interface PricingTiersProps {
  /** Called from upgrade page instead of navigating to href */
  onUpgrade?: (tier: "pro" | "max", cycle: "monthly" | "annually") => void;
  /** Which tier is currently loading checkout */
  upgradingTier?: string | null;
  /** The user's currently active tier (e.g. "free", "pro", "max") */
  currentTier?: string | null;
}

export default function PricingTiers({ onUpgrade, upgradingTier, currentTier }: PricingTiersProps = {}) {
  const t = useTranslations("Pricing");
  const [cycle, setCycle] = useState<"monthly" | "annually">("monthly");
  const [pricingData, setPricingData] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && Array.isArray(data)) setPricingData(data);
      })
      .catch((err) => console.error("Failed to fetch pricing", err));
  }, []);

  const getPrice = (tierName: string) => {
    const d = pricingData?.find(t => t.name === tierName.toLowerCase());
    if (!d) return null;
    const monthly = d.price_usd_cents / 100;
    return cycle === "monthly" ? `$${monthly}` : `$${monthly * 10}`;
  };

  const UNLIMITED = 4294967295;
  const getFeature = (tierName: string, key: "post_quota" | "image_quota" | "scheduler_interval_minutes") => {
    const d = pricingData?.find(t => t.name === tierName.toLowerCase());
    return d ? d[key] : null;
  };

  const formatQuota = (q: number | null, fallback: string) => {
    if (q === null) return fallback;
    return q >= UNLIMITED ? "Unlimited" : q.toString();
  };

  const renderPrice = (tierName: string, fallbackMonthly: string, fallbackAnnually: string) => {
    if (pricingData === null) {
      return <span className="animate-pulse bg-muted/50 rounded w-20 h-10 inline-block align-middle"></span>;
    }
    return getPrice(tierName) || (cycle === "monthly" ? fallbackMonthly : fallbackAnnually);
  };

  const tiers = [
    {
      name: "Free",
      price: renderPrice("free", "$0", "$0"),
      description: t("freeDesc", { defaultMessage: "Perfect to test the waters" }),
      features: [
        { name: t("featPosts", { count: formatQuota(getFeature("free", "post_quota"), "100"), defaultMessage: "{count} posts / month" }), included: true },
        { name: t("featImages", { count: formatQuota(getFeature("free", "image_quota"), "10"), defaultMessage: "{count} image posts / month" }), included: true },
        { name: t("featVideo", { defaultMessage: "Video posts" }), included: false },
        { name: t("featCron", { count: getFeature("free", "scheduler_interval_minutes") || "60", defaultMessage: "{count}-min scheduling window" }), included: true },
      ],
      buttonText: t("getStarted", { defaultMessage: "Get Started" }),
      buttonVariant: "outline",
      href: "/dashboard/keys",
    },
    {
      name: "Pro",
      price: renderPrice("pro", "$15", "$150"),
      period: cycle === "monthly" ? "/mo" : "/yr",
      description: t("proDesc", { defaultMessage: "For power users & creators" }),
      features: [
        { name: t("featPostsUnlimited", { defaultMessage: `${formatQuota(getFeature("pro", "post_quota"), "Unlimited")} posts` }), included: true },
        { name: t("featImagesUnlimited", { defaultMessage: `${formatQuota(getFeature("pro", "image_quota"), "Unlimited")} image posts` }), included: true },
        { name: t("featVideo", { defaultMessage: "Video posts" }), included: true },
        { name: t("featCron", { count: getFeature("pro", "scheduler_interval_minutes") || "5", defaultMessage: "{count}-min priority scheduling" }), included: true },
      ],
      buttonText: t("subscribePro", { defaultMessage: "Subscribe to Pro" }),
      buttonVariant: "primary",
      isPopular: true,
      tier: "pro" as const,
      href: "/dashboard/dotshare/upgrade",
    },
    {
      name: "Max",
      price: renderPrice("max", "$30", "$300"),
      period: cycle === "monthly" ? "/mo" : "/yr",
      description: t("maxDesc", { defaultMessage: "The ultimate automation tier" }),
      features: [
        { name: t("featPostsUnlimited", { defaultMessage: `${formatQuota(getFeature("max", "post_quota"), "Unlimited")} posts` }), included: true },
        { name: t("featImagesUnlimited", { defaultMessage: `${formatQuota(getFeature("max", "image_quota"), "Unlimited")} image posts` }), included: true },
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
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          {t("title", { defaultMessage: "Simple, transparent pricing" })}
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          {t("subtitle", { defaultMessage: "Choose the perfect plan for your automated code sharing workflow." })}
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-secondary/50 p-1 rounded-full inline-flex border border-border/50 items-center">
          <button
            onClick={() => setCycle("monthly")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              cycle === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("monthly", { defaultMessage: "Monthly" })}
          </button>
          <button
            onClick={() => setCycle("annually")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              cycle === "annually" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("annually", { defaultMessage: "Annually" })}
            <span className="bg-green-500/10 text-green-500 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">
              2 Months Free
            </span>
          </button>
        </div>
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
                onClick={() => onUpgrade(tier.tier!, cycle)}
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
