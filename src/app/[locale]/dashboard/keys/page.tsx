"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Key, Copy, Check, Trash2, Plus, AlertCircle, Eye, EyeOff, X } from "lucide-react";
import { useToast } from "@/components/Toast";

interface ApiKey {
  key_prefix: string;
  label: string;
  last_used_at: string | null;
  created_at: string;
}

export default function ApiKeysPage() {
  const t = useTranslations("DashboardKeys");
  const { toast } = useToast();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<{ plaintext: string; label: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

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
    if (!newLabel.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim() }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate key");
      }

      const data = await res.json();
      setNewlyGeneratedKey({ plaintext: data.plaintext_key, label: data.label });
      setNewLabel("");
      fetchKeys();
      toast.success(t("keyGeneratedSuccess", { defaultMessage: "API Key generated successfully!" }));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeKey = async (prefix: string) => {
    if (!window.confirm(t("confirmRevoke", { defaultMessage: "Are you sure you want to revoke this key? Any extension using it will be disconnected immediately." }))) {
      return;
    }

    try {
      const res = await fetch(`/api/keys/${prefix}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to revoke key");
      }

      toast.success(t("keyRevokedSuccess", { defaultMessage: "API Key revoked successfully." }));
      fetchKeys();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Key className="w-8 h-8 text-primary" />
          {t("title", { defaultMessage: "API Keys" })}
        </h1>
        <p className="text-muted-foreground">
          {t("subtitle", { defaultMessage: "Manage your API keys used to authenticate the DotShare VS Code Extension." })}
        </p>
      </div>

      {/* Newly Generated Key Alert */}
      {newlyGeneratedKey && (
        <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-xl shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-primary mb-1">
                {t("saveYourKey", { defaultMessage: "Please save this key now" })}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("keyWarning", { defaultMessage: "For security reasons, this is the only time you will see the full API key. If you lose it, you will need to generate a new one." })}
              </p>
              
              <div className="flex items-center gap-2 max-w-full">
                <div className="flex-1 bg-background border border-border rounded-lg p-3 font-mono text-sm break-all relative group">
                  {showKey ? newlyGeneratedKey.plaintext : "•".repeat(56)}
                  
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => copyToClipboard(newlyGeneratedKey.plaintext)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t("copied", { defaultMessage: "Copied!" }) : t("copy", { defaultMessage: "Copy" })}
                </button>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setNewlyGeneratedKey(null)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Key Form */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-4">{t("createNewKey", { defaultMessage: "Create New Key" })}</h2>
            <form onSubmit={handleGenerateKey} className="space-y-4">
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-foreground mb-1">
                  {t("keyLabel", { defaultMessage: "Key Label" })}
                </label>
                <input
                  id="label"
                  type="text"
                  required
                  maxLength={50}
                  placeholder={t("keyLabelPlaceholder", { defaultMessage: "e.g., VS Code Desktop" })}
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {t("maxKeysInfo", { defaultMessage: "You can have up to 10 active API keys at a time." })}
                </p>
              </div>
              <button
                type="submit"
                disabled={isGenerating || !newLabel.trim()}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-lg font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
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

        {/* Keys List */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border bg-muted/30">
              <h2 className="text-xl font-semibold">{t("activeKeys", { defaultMessage: "Active Keys" })}</h2>
            </div>
            
            <div className="divide-y divide-border">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                  {t("loadingKeys", { defaultMessage: "Loading your keys..." })}
                </div>
              ) : keys.length === 0 ? (
                <div className="p-12 text-center">
                  <Key className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">
                    {t("noKeysFound", { defaultMessage: "No active API keys found." })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("noKeysDesc", { defaultMessage: "Generate a new key to authenticate the DotShare extension." })}
                  </p>
                </div>
              ) : (
                keys.map((key) => (
                  <div key={key.key_prefix} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{key.label}</h3>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                          {t("activeStatus", { defaultMessage: "ACTIVE" })}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <p className="font-mono bg-muted px-1.5 py-0.5 rounded w-fit">{key.key_prefix}••••••••••••••••••••••••••••••••••••••••</p>
                        <p>
                          {t("createdOn", { defaultMessage: "Created:" })} {new Date(key.created_at).toLocaleDateString()}
                          <span className="mx-2">•</span>
                          {t("lastUsed", { defaultMessage: "Last used:" })} {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : t("never", { defaultMessage: "Never" })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeKey(key.key_prefix)}
                      className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-md transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t("revokeBtn", { defaultMessage: "Revoke" })}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
