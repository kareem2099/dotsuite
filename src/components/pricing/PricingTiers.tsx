"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Check, X, Sparkles, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface PricingTiersProps {
  onUpgrade?: (tier: "pro" | "max", cycle: "monthly" | "annually") => void;
  upgradingTier?: string | null;
  currentTier?: string | null;
}

const DEFAULT_PRICING = [
  { name: "free", price_usd_cents: 0, post_quota: 100, image_quota: 10, scheduler_interval_minutes: 60 },
  { name: "pro", price_usd_cents: 1500, post_quota: 4294967295, image_quota: 4294967295, scheduler_interval_minutes: 5 },
  { name: "max", price_usd_cents: 3000, post_quota: 4294967295, image_quota: 4294967295, scheduler_interval_minutes: 0 }
];

export default function PricingTiers({ onUpgrade, upgradingTier, currentTier }: PricingTiersProps = {}) {
  const t = useTranslations("Pricing");
  const [cycle, setCycle] = useState<"monthly" | "annually">("monthly");
  const [pricingData, setPricingData] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && Array.isArray(data)) setPricingData(data);
        else setPricingData(DEFAULT_PRICING); // Fallback if backend is unreachable
      })
      .catch((err) => {
        console.error("Failed to fetch pricing", err);
        setPricingData(DEFAULT_PRICING);
      });
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
      return <span className="animate-pulse bg-white/10 rounded-md w-24 h-12 inline-block align-middle"></span>;
    }
    return getPrice(tierName) || (cycle === "monthly" ? fallbackMonthly : fallbackAnnually);
  };

  const tiers = [
    {
      name: "Free",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      price: renderPrice("free", "$0", "$0"),
      description: t("freeDesc", { defaultMessage: "Perfect to test the waters" }),
      features: [
        { name: t("featPosts", { count: formatQuota(getFeature("free", "post_quota"), "100"), defaultMessage: "{count} posts / month" }), included: true },
        { name: t("featImages", { count: formatQuota(getFeature("free", "image_quota"), "10"), defaultMessage: "{count} image posts / month" }), included: true },
        { name: t("featVideo", { defaultMessage: "Video posts" }), included: false },
        { name: t("featCron", { count: getFeature("free", "scheduler_interval_minutes") || "60", defaultMessage: "{count}-min scheduling window" }), included: true },
      ],
      buttonText: t("getStarted", { defaultMessage: "Get Started" }),
      style: "border-white/10 hover:border-emerald-500/50 bg-black/40",
      buttonStyle: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
      href: "/dashboard/keys",
    },
    {
      name: "Pro",
      icon: <Zap className="w-6 h-6 text-amber-400" />,
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
      isPopular: true,
      tier: "pro" as const,
      style: "border-amber-500/50 shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)] bg-gradient-to-b from-amber-500/10 to-black/60 transform scale-105 z-10",
      buttonStyle: "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25",
      href: "/dashboard/dotshare/upgrade",
    },
    {
      name: "Max",
      icon: <Sparkles className="w-6 h-6 text-fuchsia-400" />,
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
      tier: "max" as const,
      style: "border-fuchsia-500/30 hover:border-fuchsia-500/60 shadow-[0_0_30px_-15px_rgba(217,70,239,0.2)] hover:shadow-[0_0_40px_-10px_rgba(217,70,239,0.4)] bg-gradient-to-b from-fuchsia-500/5 to-black/60",
      buttonStyle: "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25 border-0",
      href: "/dashboard/dotshare/upgrade",
    },
  ];

  return (
    <div className="py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
          {t("title", { defaultMessage: "Simple, transparent pricing" })}
        </h2>
        <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light">
          {t("subtitle", { defaultMessage: "Choose the perfect plan for your automated code sharing workflow." })}
        </p>
      </div>

      <div className="flex justify-center mb-16 relative z-10">
        <div className="bg-zinc-900/80 p-1.5 rounded-full inline-flex border border-white/10 backdrop-blur-md shadow-2xl">
          <button
            onClick={() => setCycle("monthly")}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              cycle === "monthly" 
                ? "bg-white text-black shadow-md" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {t("monthly", { defaultMessage: "Monthly" })}
          </button>
          <button
            onClick={() => setCycle("annually")}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              cycle === "annually" 
                ? "bg-white text-black shadow-md" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {t("annually", { defaultMessage: "Annually" })}
            <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold transition-colors ${
              cycle === "annually" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-500/20 text-emerald-400"
            }`}>
              2 Months Free
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-center">
        {tiers.map((tier) => {
          const tierKey = (tier as { tier?: string }).tier;
          const isCurrentPlan =
            !!(currentTier && tierKey && currentTier === tierKey) ||
            (!tierKey && currentTier === "free");

          return (
            <div
              key={tier.name}
              className={`relative flex flex-col p-8 md:p-10 rounded-[2rem] border transition-all duration-500 backdrop-blur-xl ${tier.style} ${
                isCurrentPlan ? "ring-2 ring-emerald-500/50" : ""
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-500 text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Current Plan
                  </span>
                </div>
              )}
              {!isCurrentPlan && tier.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-black" /> {t("mostPopular", { defaultMessage: "Most Popular" })}
                  </span>
                </div>
              )}

              <div className="mb-8 flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  {tier.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                  <p className="text-zinc-400 text-sm mt-1 font-medium">{tier.description}</p>
                </div>
              </div>

              <div className="mb-10 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-white tracking-tight">{tier.price}</span>
                {tier.period && <span className="text-zinc-400 font-semibold">{tier.period}</span>}
              </div>

              <ul className="flex-1 space-y-5 mb-10">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 p-1 rounded-full bg-white/5 border border-white/10">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-emerald-400" strokeWidth={3} />
                      ) : (
                        <X className="h-4 w-4 text-zinc-600" strokeWidth={3} />
                      )}
                    </div>
                    <span
                      className={`ml-4 text-[15px] font-medium leading-relaxed ${
                        feature.included ? "text-zinc-200" : "text-zinc-600"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <div className="w-full py-4 px-6 rounded-2xl font-bold text-center text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 cursor-default flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" /> Your Current Plan
                </div>
              ) : tier.tier && onUpgrade ? (
                <button
                  onClick={() => onUpgrade(tier.tier!, cycle)}
                  disabled={!!upgradingTier}
                  className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-center flex items-center justify-center ${tier.buttonStyle}`}
                >
                  {upgradingTier === tier.tier ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : tier.buttonText}
                </button>
              ) : (
                <Link
                  href={tier.href}
                  className={`block w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 text-center ${tier.buttonStyle}`}
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
