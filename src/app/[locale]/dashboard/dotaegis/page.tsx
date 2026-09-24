"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Key,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Code2,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/Toast";

interface Finding {
  line: number;
  variableName: string;
  maskedValue: string;
  entropy: number;
  confidence: "low" | "medium" | "high" | "critical";
  category: string;
  reasoning: string[];
}

interface ServiceStatus {
  online: boolean;
  latencyMs: number;
  version?: string;
  serviceUrl?: string;
  error?: string;
}

const SAMPLE_LEAK_ENV = `# DotSuite Sample Environment File
APP_NAME=DotSuite
PORT=3000
NODE_ENV=production

# Exposed third-party secrets
STRIPE_SECRET_KEY=sk_test_51M0abcdef1234567890abcdefghijklmnopqrstuvwxyz1234
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
GITHUB_TOKEN=ghp_MOCK1234567890abcdefghijklmnopqrstuvwxyzAB
DATABASE_URL=postgres://admin:SuperSecretPassword992@db.internal:5432/dotsuite_prod
`;

const SAMPLE_CLEAN_ENV = `# DotSuite Secure Configuration
APP_NAME=DotSuite
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
FEATURE_AI_ANALYZER=true
CACHE_TTL_SECONDS=300
`;

export default function DotAegisDashboardPage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const t = useTranslations("DotAegisDashboard");
  const { toast } = useToast();

  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Scanner state
  const [content, setContent] = useState(SAMPLE_LEAK_ENV);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<{
    totalLines: number;
    secretsDetected: number;
    findings: Finding[];
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Check health on mount
  useEffect(() => {
    checkServiceHealth();
  }, []);

  const checkServiceHealth = async () => {
    setCheckingStatus(true);
    try {
      const res = await fetch("/api/dotaegis/scan", { method: "GET" });
      const data = await res.json();
      setServiceStatus(data);
    } catch {
      setServiceStatus({ online: false, latencyMs: 0 });
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleScan = async () => {
    if (!content.trim()) return;
    setScanning(true);
    try {
      const res = await fetch("/api/dotaegis/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        throw new Error(t("serviceOffline"));
      }
      const data = await res.json();
      setScanResults({
        totalLines: data.totalLines || 0,
        secretsDetected: data.secretsDetected || 0,
        findings: data.findings || [],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to scan content";
      toast.error(msg);
    } finally {
      setScanning(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast.success(locale === "ar" ? "تم النسخ للحافظة" : "Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getConfidenceBadge = (confidence: Finding["confidence"]) => {
    switch (confidence) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "high":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "medium":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {locale === "ar" ? "العودة للوحة التحكم" : "Back to Dashboard"}
        </Link>

        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-card border border-border/80 shadow-sm relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner">
              <Shield className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t("title")}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  v2.1.3
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Service Status Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative z-10">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/60 border border-border/60 text-xs font-medium">
              {checkingStatus ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                  <span className="text-muted-foreground">Checking service...</span>
                </>
              ) : serviceStatus?.online ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-semibold">{t("serviceOnline")}</span>
                  <span className="text-muted-foreground border-l border-border/60 pl-2 font-mono">
                    {serviceStatus.latencyMs}ms
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  <span className="text-red-400 font-semibold">{t("serviceOffline")}</span>
                </>
              )}
            </div>

            <Link
              href="https://github.com/kareem2099/DotAegis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Code / Config Input */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  {t("playgroundTitle")}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("playgroundSubtitle")}
                </p>
              </div>

              {/* Sample Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setContent(SAMPLE_LEAK_ENV)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors font-medium"
                >
                  {t("loadSampleEnv")}
                </button>
                <button
                  onClick={() => setContent(SAMPLE_CLEAN_ENV)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors font-medium"
                >
                  {t("loadSampleClean")}
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="relative rounded-xl overflow-hidden border border-border/70 bg-black/40 dark:bg-black/60 font-mono text-xs">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder={t("inputPlaceholder")}
                className="w-full p-4 bg-transparent text-emerald-300 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-y leading-relaxed font-mono"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground font-mono">
                {content.split(/\r?\n/).length} lines • {content.length} characters
              </span>

              <button
                onClick={handleScan}
                disabled={scanning || !content.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-sm transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t("scanning")}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{t("scanBtn")}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Integration / VS Code Extensions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DotEnvy Card */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{t("dotenvyTitle")}</h3>
                  <p className="text-[11px] text-muted-foreground">VS Code Extension</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("dotenvyDesc")}
              </p>
              <div className="pt-1">
                <Link
                  href={`/${locale}/product/dotenvy`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>{t("dotenvyAction")}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </div>

            {/* API Keys Card */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">DotSuite API Key</h3>
                  <p className="text-[11px] text-muted-foreground">CI/CD & CLI Access</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("apiUsageDesc")}
              </p>
              <div className="pt-1">
                <Link
                  href={`/${locale}/dashboard/keys`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>{t("keysLink")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scan Findings & Live Results */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm min-h-[460px] flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-border/60 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                {t("resultsTitle")}
              </h2>

              {scanResults && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    scanResults.secretsDetected > 0
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  {scanResults.secretsDetected > 0
                    ? t("secretsDetected", { count: scanResults.secretsDetected })
                    : t("noSecretsFound")}
                </span>
              )}
            </div>

            {/* Results Display */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {!scanResults ? (
                <div className="h-full flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <Sparkles className="w-12 h-12 text-muted-foreground/30 mb-3 animate-pulse" />
                  <p className="text-sm font-medium">Ready to analyze</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Click &quot;Scan with DotAegis&quot; to run AI secret detection on your inputs.
                  </p>
                </div>
              ) : scanResults.findings.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 shadow-inner">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">All Clean!</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    {t("noSecretsFound")}
                  </p>
                </div>
              ) : (
                scanResults.findings.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-muted/40 border border-border/80 hover:border-border transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                          L{f.line}
                        </span>
                        <span className="text-xs font-bold text-foreground font-mono">
                          {f.variableName}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getConfidenceBadge(
                          f.confidence
                        )}`}
                      >
                        {f.confidence}
                      </span>
                    </div>

                    {/* Masked Value & Category */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/20 font-mono text-xs">
                      <span className="text-muted-foreground truncate">{f.maskedValue}</span>
                      <span className="text-[11px] text-primary shrink-0 font-sans">{f.category}</span>
                    </div>

                    {/* Entropy & Reasoning */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span>Entropy:</span>
                        <span className="text-foreground font-bold">{f.entropy}</span>
                      </div>
                      <span className="truncate max-w-[200px]">{f.reasoning[0]}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick cURL Example Footer */}
            <div className="mt-4 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  API Command
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `curl -X POST https://aegis.dotsuite.dev/analyze \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"secret_value": "sk_live_..."}'`,
                      "curl-cmd"
                    )
                  }
                  className="text-[11px] text-primary hover:underline flex items-center gap-1"
                >
                  {copiedKey === "curl-cmd" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>Copy cURL</span>
                </button>
              </div>
              <pre className="p-2.5 rounded-lg bg-black/40 text-[10px] text-muted-foreground font-mono overflow-x-auto leading-relaxed">
                curl -X POST https://aegis.dotsuite.dev/analyze
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
