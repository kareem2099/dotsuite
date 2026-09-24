"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Key,
  Copy,
  Check,
  Trash2,
  Plus,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Pencil,
  Clock,
  Shield,
  Activity,
  Calendar,
  Zap,
  Sparkles,
  Lock,
} from "lucide-react";
import { useToast } from "@/components/Toast";

interface ApiKey {
  key_prefix: string;
  label: string;
  scopes?: string[];
  expires_at?: string | null;
  request_count?: number;
  last_used_at: string | null;
  created_at: string;
}

type PresetKey = "full" | "dotshare" | "dotscramble" | "dotaegis" | "readonly";

const PRESET_CONFIG: Record<
  PresetKey,
  {
    titleKey: string;
    descKey: string;
    scopes: string[];
    accentColor: string;
    badgeColor: string;
  }
> = {
  full: {
    titleKey: "presetFullTitle",
    descKey: "presetFullDesc",
    scopes: ["*"],
    accentColor: "border-amber-500/40 bg-amber-500/5",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  dotshare: {
    titleKey: "presetDotShareTitle",
    descKey: "presetDotShareDesc",
    scopes: ["dotshare:read", "dotshare:write", "account:read"],
    accentColor: "border-blue-500/40 bg-blue-500/5",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  dotscramble: {
    titleKey: "presetDotScrambleTitle",
    descKey: "presetDotScrambleDesc",
    scopes: ["dotscramble:verify", "account:read"],
    accentColor: "border-emerald-500/40 bg-emerald-500/5",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  dotaegis: {
    titleKey: "presetDotAegisTitle",
    descKey: "presetDotAegisDesc",
    scopes: ["*"],
    accentColor: "border-cyan-500/40 bg-cyan-500/5",
    badgeColor: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  },
  readonly: {
    titleKey: "presetReadOnlyTitle",
    descKey: "presetReadOnlyDesc",
    scopes: ["dotshare:read", "account:read"],
    accentColor: "border-purple-500/40 bg-purple-500/5",
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
};

const EXPIRATION_OPTIONS = [
  { value: null, labelKey: "neverExpires" },
  { value: 30, labelKey: "days30" },
  { value: 90, labelKey: "days90" },
  { value: 180, labelKey: "days180" },
  { value: 365, labelKey: "days365" },
];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function ApiKeysPage() {
  const t = useTranslations("DashboardKeys");
  const { toast } = useToast();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  // Creation State
  const [newLabel, setNewLabel] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("full");
  const [selectedExpiration, setSelectedExpiration] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generated Key Modal / Display
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<{
    plaintext: string;
    label: string;
    scopes: string[];
    expires_at: string | null;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Inline Rename State
  const [editingPrefix, setEditingPrefix] = useState<string | null>(null);
  const [editLabelValue, setEditLabelValue] = useState("");
  const [isSavingRename, setIsSavingRename] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newLabel.trim();
    if (!trimmed) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: trimmed,
          scopes: PRESET_CONFIG[selectedPreset].scopes,
          expires_in_days: selectedExpiration,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate key");
      }

      const data = await res.json();
      setNewlyGeneratedKey({
        plaintext: data.plaintext_key,
        label: data.label,
        scopes: data.scopes || PRESET_CONFIG[selectedPreset].scopes,
        expires_at: data.expires_at || null,
      });
      setShowKey(false);
      setCopied(false);
      setNewLabel("");
      void fetchKeys();
      toast.success(t("keyGeneratedSuccess", { defaultMessage: "API Key generated successfully!" }));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to generate API key"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartRename = (key: ApiKey) => {
    setEditingPrefix(key.key_prefix);
    setEditLabelValue(key.label);
  };

  const handleCancelRename = () => {
    setEditingPrefix(null);
    setEditLabelValue("");
  };

  const handleSaveRename = async (prefix: string) => {
    const trimmed = editLabelValue.trim();
    if (!trimmed) {
      toast.error(t("keyLabelEmpty", { defaultMessage: "Key label cannot be empty" }));
      return;
    }

    setIsSavingRename(true);
    try {
      const res = await fetch(`/api/keys/${prefix}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: trimmed }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update key label");
      }

      setKeys((prev) =>
        prev.map((k) => (k.key_prefix === prefix ? { ...k, label: trimmed } : k))
      );
      setEditingPrefix(null);
      setEditLabelValue("");
      toast.success(t("keyRenamedSuccess", { defaultMessage: "API Key label updated successfully!" }));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update API key"));
    } finally {
      setIsSavingRename(false);
    }
  };

  const handleRevokeKey = async (prefix: string) => {
    if (
      !window.confirm(
        t("confirmRevoke", {
          defaultMessage:
            "Are you sure you want to revoke this key? Any extension or app using it will be disconnected immediately.",
        })
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/keys/${prefix}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to revoke key");
      }

      setKeys((prev) => prev.filter((k) => k.key_prefix !== prefix));
      toast.success(t("keyRevokedSuccess", { defaultMessage: "API Key revoked successfully." }));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to revoke API key"));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScopeBadgeClass = (scope: string) => {
    if (scope === "*") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    if (scope.startsWith("dotshare:")) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (scope.startsWith("dotscramble:")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (scope.startsWith("dotaegis:")) return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
    return "bg-muted text-muted-foreground border-border";
  };

  const isExpired = (expiresAt?: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt).getTime() < Date.now();
  };

  const formatDaysRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const activeKeysCount = keys.filter((k) => !isExpired(k.expires_at)).length;
  const isLimitReached = activeKeysCount >= 10;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Key className="w-7 h-7" />
          </div>
          {t("title", { defaultMessage: "API Keys" })}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          {t("subtitle", {
            defaultMessage: "Manage your API keys used to authenticate DotShare and DotScramble.",
          })}
        </p>
      </div>

      {/* Newly Generated Key Alert */}
      {newlyGeneratedKey && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/30 p-6 rounded-2xl shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {t("saveYourKey", { defaultMessage: "Save Your API Key" })}:{" "}
                  <span className="text-primary font-normal">{newlyGeneratedKey.label}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("keyWarning", {
                    defaultMessage:
                      "For security reasons, this is the only time you will see the full API key. Store it somewhere safe.",
                  })}
                </p>
              </div>

              {/* Scopes and Expiration Pill */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-primary" /> {t("scopesLabel", { defaultMessage: "Scopes" })}:
                </span>
                {newlyGeneratedKey.scopes.map((s) => (
                  <span
                    key={s}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${getScopeBadgeClass(s)}`}
                  >
                    {s === "*" ? t("fullAccessBadge", { defaultMessage: "Full Access (*)" }) : s}
                  </span>
                ))}
                {newlyGeneratedKey.expires_at && (
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 ml-2 font-mono">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {new Date(newlyGeneratedKey.expires_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Key display with copy */}
              <div className="flex items-center gap-2 max-w-2xl pt-1">
                <div className="flex-1 bg-background/90 border border-border rounded-xl p-3 font-mono text-sm break-all relative group flex items-center justify-between shadow-inner">
                  <span className="select-all">
                    {showKey ? newlyGeneratedKey.plaintext : "•".repeat(48)}
                  </span>
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors shrink-0 ml-2"
                    title={showKey ? t("hideKey", { defaultMessage: "Hide key" }) : t("showKey", { defaultMessage: "Show key" })}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => copyToClipboard(newlyGeneratedKey.plaintext)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-sm shrink-0 active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t("copied", { defaultMessage: "Copied!" }) : t("copy", { defaultMessage: "Copy" })}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setNewlyGeneratedKey(null)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Key Form (Sidebar) */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                {t("createNewKey", { defaultMessage: "Create New Key" })}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {t("maxKeysInfo", { defaultMessage: "You can have up to 10 active API keys at a time." })}
              </p>
            </div>

            <form onSubmit={handleGenerateKey} className="space-y-5">
              {/* Label */}
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("keyLabel", { defaultMessage: "Key Label" })} <span className="text-primary">*</span>
                </label>
                <input
                  id="label"
                  type="text"
                  required
                  maxLength={100}
                  placeholder={t("keyLabelPlaceholder", { defaultMessage: "e.g., VS Code Desktop or CLI" })}
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  disabled={isLimitReached || isGenerating}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  {t("permissionsPreset", { defaultMessage: "Access Preset" })}
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {(Object.keys(PRESET_CONFIG) as PresetKey[]).map((presetKey) => {
                    const preset = PRESET_CONFIG[presetKey];
                    const isSelected = selectedPreset === presetKey;
                    return (
                      <button
                        type="button"
                        key={presetKey}
                        onClick={() => setSelectedPreset(presetKey)}
                        disabled={isLimitReached || isGenerating}
                        className={`text-left p-3 rounded-xl border transition-all relative ${
                          isSelected
                            ? `${preset.accentColor} border-primary ring-1 ring-primary/40`
                            : "border-border hover:bg-muted/40"
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-foreground">
                            {t(preset.titleKey, { defaultMessage: presetKey })}
                          </span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${preset.badgeColor}`}
                          >
                            {preset.scopes.length === 1 && preset.scopes[0] === "*"
                              ? "*"
                              : `${preset.scopes.length} scopes`}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t(preset.descKey, { defaultMessage: "" })}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {preset.scopes.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background/60 border border-border/80 text-muted-foreground"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expiration Selector */}
              <div>
                <label htmlFor="expiration" className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {t("expirationLabel", { defaultMessage: "Expiration" })}
                </label>
                <select
                  id="expiration"
                  value={selectedExpiration === null ? "never" : selectedExpiration.toString()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedExpiration(val === "never" ? null : parseInt(val, 10));
                  }}
                  disabled={isLimitReached || isGenerating}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {EXPIRATION_OPTIONS.map((opt) => (
                    <option key={opt.value === null ? "never" : opt.value} value={opt.value === null ? "never" : opt.value}>
                      {t(opt.labelKey, { defaultMessage: opt.labelKey })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Limit reached alert */}
              {isLimitReached && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <p className="leading-relaxed">
                    {t("limitReachedDesc", {
                      defaultMessage:
                        "You have reached the maximum of 10 active API keys. Revoke an existing key to generate a new one.",
                    })}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating || !newLabel.trim() || isLimitReached}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-semibold px-4 py-3 rounded-xl hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : isLimitReached ? (
                  <>
                    <Lock className="w-4 h-4" />
                    {t("limitReachedBtn", { defaultMessage: "Key Limit Reached (10/10)" })}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    {t("generateKeyBtn", { defaultMessage: "Generate API Key" })}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Keys List (Main area) */}
        <div className="lg:col-span-7">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{t("activeKeys", { defaultMessage: "Active Keys" })}</h2>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                    isLimitReached
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}
                >
                  {activeKeysCount} / 10
                </span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {loading ? (
                <div className="p-12 text-center text-muted-foreground space-y-3">
                  <div className="w-7 h-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                  <p className="text-sm">{t("loadingKeys", { defaultMessage: "Loading your keys..." })}</p>
                </div>
              ) : keys.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
                    <Key className="w-7 h-7 opacity-40" />
                  </div>
                  <h3 className="text-foreground font-semibold text-base">
                    {t("noKeysFound", { defaultMessage: "No active API keys found." })}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {t("noKeysDesc", {
                      defaultMessage: "Generate a new key to authenticate DotShare or DotScramble.",
                    })}
                  </p>
                </div>
              ) : (
                keys.map((key) => {
                  const expired = isExpired(key.expires_at);
                  const isEditing = editingPrefix === key.key_prefix;

                  return (
                    <div
                      key={key.key_prefix}
                      className={`p-6 transition-colors hover:bg-muted/10 space-y-4 ${
                        expired ? "bg-red-500/[0.02]" : ""
                      }`}
                    >
                      {/* Header Row: Label / Rename & Status Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex-1 min-w-[200px]">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                maxLength={100}
                                value={editLabelValue}
                                onChange={(e) => setEditLabelValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveRename(key.key_prefix);
                                  if (e.key === "Escape") handleCancelRename();
                                }}
                                className="px-3 py-1.5 bg-background border border-primary rounded-lg text-sm font-medium focus:outline-none ring-2 ring-primary/20 flex-1 max-w-xs"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveRename(key.key_prefix)}
                                disabled={isSavingRename}
                                className="p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                title={t("save", { defaultMessage: "Save" })}
                              >
                                {isSavingRename ? (
                                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={handleCancelRename}
                                disabled={isSavingRename}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                title={t("cancel", { defaultMessage: "Cancel" })}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group">
                              <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                                {key.label}
                              </h3>
                              <button
                                onClick={() => handleStartRename(key)}
                                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors opacity-80 group-hover:opacity-100"
                                title={t("editLabel", { defaultMessage: "Rename" })}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2">
                          {expired ? (
                            <span className="px-2.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">
                              {t("expiredStatus", { defaultMessage: "EXPIRED" })}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">
                              {t("activeStatus", { defaultMessage: "ACTIVE" })}
                            </span>
                          )}

                          <button
                            onClick={() => handleRevokeKey(key.key_prefix)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t("revokeBtn", { defaultMessage: "Revoke" })}
                          </button>
                        </div>
                      </div>

                      {/* Key Prefix & Scopes */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="font-mono text-xs bg-muted/80 px-2.5 py-1 rounded-md text-foreground/90 border border-border/60">
                          {key.key_prefix}••••••••••••••••••••••••••••••••••••••••
                        </span>

                        {/* Scopes */}
                        {key.scopes && key.scopes.length > 0 ? (
                          key.scopes.map((s) => (
                            <span
                              key={s}
                              className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${getScopeBadgeClass(s)}`}
                            >
                              {s === "*" ? t("fullAccessBadge", { defaultMessage: "Full Access (*)" }) : s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md border bg-amber-500/10 text-amber-500 border-amber-500/20">
                            {t("fullAccessBadge", { defaultMessage: "Full Access (*)" })}
                          </span>
                        )}
                      </div>

                      {/* Metadata Row: Requests, Created, Last Used, Expiration */}
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Activity className="w-3.5 h-3.5 text-primary" />
                          <span>
                            {t("requestCount", {
                              count: key.request_count || 0,
                              defaultMessage: `${key.request_count || 0} requests`,
                            })}
                          </span>
                        </div>

                        <span className="text-border">•</span>

                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {t("createdOn", { defaultMessage: "Created:" })}{" "}
                            {new Date(key.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <span className="text-border">•</span>

                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>
                            {t("lastUsed", { defaultMessage: "Last used:" })}{" "}
                            {key.last_used_at
                              ? new Date(key.last_used_at).toLocaleDateString()
                              : t("never", { defaultMessage: "Never" })}
                          </span>
                        </div>

                        <span className="text-border">•</span>

                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          {key.expires_at ? (
                            <span className={expired ? "text-red-500 font-medium" : ""}>
                              {expired
                                ? `${t("expiredStatus", { defaultMessage: "Expired" })} (${new Date(key.expires_at).toLocaleDateString()})`
                                : `${t("expiresOn", { defaultMessage: "Expires:" })} ${new Date(key.expires_at).toLocaleDateString()} (${t("expiresIn", { days: formatDaysRemaining(key.expires_at), defaultMessage: `Expires in ${formatDaysRemaining(key.expires_at)} days` })})`}
                            </span>
                          ) : (
                            <span>{t("neverExpires", { defaultMessage: "Never expires" })}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
