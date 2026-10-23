"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { KeyRound, Plus, RefreshCw, Search, Copy, Eye, EyeOff, Check, X, Pencil, Trash2, RotateCw } from "lucide-react";

type ApiKey = {
  key_prefix: string; label: string; scopes: string[]; expires_at: string | null;
  created_at: string; last_used_at: string | null; request_count: number;
  is_active: boolean; status: "active" | "expired" | "revoked"; source: string;
  revoked_at: string | null; rotated_at: string | null;
};
type Secret = { plaintext_key: string; key_prefix: string; label: string };
type Pending = { key: ApiKey; action: "rename" | "rotate" | "revoke" };
type Filter = "active" | "all" | "expired" | "revoked";
const presets = [
  { id: "dotshare", name: "presetDotShareTitle", scopes: ["dotshare:read", "dotshare:write", "account:read"] },
  { id: "dotscramble", name: "presetDotScrambleTitle", scopes: ["dotscramble:verify", "account:read"] },
  { id: "readonly", name: "presetReadOnlyTitle", scopes: ["dotshare:read", "account:read"] },
  { id: "full", name: "presetFullTitle", scopes: ["*"] },
] as const;
const inputStyle = "w-full rounded-xl border border-(--card-border) bg-(--background) px-3 py-2.5 text-sm text-(--foreground)";
const buttonStyle = "inline-flex items-center justify-center gap-2 rounded-lg border border-(--card-border) px-3 py-2 text-sm font-medium hover:bg-(--card-bg) disabled:cursor-not-allowed disabled:opacity-50";

export default function ApiKeysPage() {
  const t = useTranslations("DashboardKeys");
  const locale = useLocale();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [label, setLabel] = useState("");
  const [preset, setPreset] = useState("dotshare");
  const [expiry, setExpiry] = useState("90");
  const [filter, setFilter] = useState<Filter>("active");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [pending, setPending] = useState<Pending | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [secret, setSecret] = useState<Secret | null>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(0);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/keys?include_inactive=true", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Unable to load keys");
      if (!Array.isArray(data)) throw Error("Invalid key list");
      setKeys(data); setNow(Date.now());
    } catch (e) { setError(e instanceof Error ? e.message : t("loadError")); }
    finally { setLoading(false); }
  }, [t]);
  useEffect(() => { startTransition(() => { void load(); }); }, [load]);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(timer); }, []);
  const status = (key: ApiKey) => !key.is_active ? "revoked" : key.expires_at && Date.parse(key.expires_at) <= now ? "expired" : "active";
  const active = keys.filter(k => status(k) === "active").length;
  const expired = keys.filter(k => status(k) === "expired").length;
  const remaining = Math.max(0, 10 - active);
  const date = (value: string | null) => value ? new Date(value).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" }) : t("never");
  const shown = keys.filter(k => (filter === "all" || status(k) === filter)
    && `${k.label} ${k.key_prefix} ${k.scopes.join(" ")} ${k.source}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "name" ? a.label.localeCompare(b.label) : sort === "used"
      ? Date.parse(b.last_used_at || b.created_at) - Date.parse(a.last_used_at || a.created_at)
      : Date.parse(b.created_at) - Date.parse(a.created_at));

  async function mutate(path: string, method: string, body?: unknown) {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(path, { method, headers: { "Content-Type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      const data = response.status === 204 ? null : await response.json();
      if (!response.ok) throw Error(data?.error || t("actionError"));
      if (data?.plaintext_key) { setSecret(data); setVisible(false); setCopied(false); }
      setPending(null); setShowCreate(false); setLabel("");
      setNotice(t(method === "DELETE" ? "keyRevokedSuccess" : method === "PATCH" ? "keyRenamedSuccess" : path.endsWith("/rotate") ? "rotatedSuccess" : "keyGeneratedSuccess"));
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : t("actionError")); }
    finally { setBusy(false); }
  }
  async function copy() {
    if (!secret) return;
    try { await navigator.clipboard.writeText(secret.plaintext_key); setCopied(true); }
    catch { setError(t("copyError")); }
  }
  const openAction = (key: ApiKey, action: Pending["action"]) => { setPending({ key, action }); setEditLabel(key.label); setError(""); setNotice(""); };

  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-bold flex items-center gap-3"><KeyRound className="text-(--primary)" />{t("title")}</h1><p className="mt-2 text-sm text-(--text-muted) max-w-2xl">{t("managementSubtitle")}</p></div>
      <div className="flex gap-2">
        <button className={buttonStyle} disabled={busy || loading} onClick={() => void load()}><RefreshCw size={16} className={loading ? "animate-spin" : ""} />{t("refresh")}</button>
        <button className={`${buttonStyle} bg-(--primary) text-(--primary-text)`} disabled={busy || loading || !!error || remaining === 0 || !!secret} onClick={() => setShowCreate(!showCreate)}><Plus size={16} />{t("createNewKey")}</button>
      </div>
    </header>

    <section aria-label={t("capacity")} className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-5">
      <div className="flex flex-wrap justify-between gap-2"><strong>{loading ? t("loadingKeys") : t("activeCount", { count: active })}</strong><span className="text-sm text-(--text-muted)">{loading ? t("loadingKeys") : t("slotsRemaining", { count: remaining })}</span></div>
      <progress aria-label={t("capacity")} max={10} value={active} className="w-full h-2 mt-3 accent-(--primary)" />
      <p className="mt-2 text-sm text-(--text-muted)">{remaining === 0 ? t("capacityFull") : t("capacityHelp")}</p>
    </section>
    {error && <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm"><p>{error}</p><button className="underline mt-2" disabled={busy || loading} onClick={() => void load()}>{t("refresh")}</button></div>}
    {notice && <p role="status" className="rounded-xl border border-(--primary)/30 bg-(--primary)/10 p-4 text-sm">{notice}</p>}

    {secret && <section aria-label={t("saveYourKey")} className="rounded-2xl border border-(--primary)/50 p-5 space-y-4">
      <h2 className="font-bold text-lg">{t("saveYourKey")} — {secret.label}</h2><p className="text-sm text-(--text-muted)">{t("secretHelp")}</p>
      <div className="flex flex-wrap gap-2"><code className="flex-1 min-w-0 break-all rounded-lg bg-(--card-bg) p-3" dir="ltr">{visible ? secret.plaintext_key : `${secret.key_prefix}••••••••••••••••••••••••••••••••••••••••`}</code>
        <button className={buttonStyle} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}{t(visible ? "hideKey" : "showKey")}</button>
        <button className={buttonStyle} onClick={() => void copy()}>{copied ? <Check size={16} /> : <Copy size={16} />}{t(copied ? "copied" : "copy")}</button></div>
      <button className={buttonStyle} onClick={() => { setSecret(null); setVisible(false); }}>{t("savedKey")}</button>
    </section>}

    {showCreate && <section className="rounded-2xl border border-(--card-border) p-5 space-y-4">
      <div className="flex justify-between"><h2 className="text-xl font-bold">{t("createNewKey")}</h2><button className={buttonStyle} aria-label={t("cancel")} onClick={() => setShowCreate(false)}><X size={16} /></button></div>
      <form onSubmit={e => { e.preventDefault(); const chosen = presets.find(p => p.id === preset)!; void mutate("/api/keys", "POST", { label: label.trim(), scopes: chosen.scopes, expires_in_days: expiry === "never" ? null : Number(expiry), source: "dashboard" }); }} className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 sm:col-span-2"><span className="text-sm font-medium">{t("keyLabel")}</span><input className={inputStyle} value={label} maxLength={100} required placeholder={t("keyLabelPlaceholder")} onChange={e => setLabel(e.target.value)} /></label>
        <label className="space-y-2"><span className="text-sm font-medium">{t("permissionsPreset")}</span><select className={inputStyle} value={preset} onChange={e => setPreset(e.target.value)}>{presets.map(p => <option key={p.id} value={p.id}>{t(p.name)}</option>)}</select></label>
        <label className="space-y-2"><span className="text-sm font-medium">{t("expirationLabel")}</span><select className={inputStyle} value={expiry} onChange={e => setExpiry(e.target.value)}>{["30", "90", "180", "365"].map(days => <option key={days} value={days}>{t(`days${days}`)}</option>)}<option value="never">{t("neverExpires")}</option></select></label>
        <p className="text-sm text-(--text-muted) sm:col-span-2">{t(preset === "full" ? "fullWarning" : "presetHelp")}</p>
        <button className={`${buttonStyle} bg-(--primary) text-(--primary-text) sm:col-span-2`} disabled={busy || !label.trim() || remaining === 0 || !!secret}>{busy ? t("working") : t("generateKeyBtn")}</button>
      </form>
    </section>}

    <section aria-label={t("keyList")} className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <label className="relative grow"><span className="sr-only">{t("search")}</span><Search size={16} className="absolute start-3 top-3.5 text-(--text-muted)" /><input className={`${inputStyle} ps-9`} value={query} onChange={e => setQuery(e.target.value)} placeholder={t("search")} /></label>
        <label><span className="sr-only">{t("filterStatus")}</span><select className={inputStyle} value={filter} onChange={e => setFilter(e.target.value as Filter)}>{(["active", "all", "expired", "revoked"] as const).map(v => <option key={v} value={v}>{t(`filter_${v}`)}{v === "expired" ? ` (${expired})` : ""}</option>)}</select></label>
        <label><span className="sr-only">{t("sortKeys")}</span><select className={inputStyle} value={sort} onChange={e => setSort(e.target.value)}>{["newest", "used", "name"].map(v => <option key={v} value={v}>{t(`sort_${v}`)}</option>)}</select></label>
      </div>
      {loading && <p role="status" className="py-6 text-(--text-muted)">{t("loadingKeys")}</p>}
      {!loading && !error && !shown.length && <div className="rounded-2xl border border-dashed border-(--card-border) py-12 text-center"><KeyRound className="mx-auto mb-3 text-(--text-muted)" /><h2 className="font-semibold">{t("noMatches")}</h2><p className="text-sm text-(--text-muted) mt-2">{t("noMatchesHelp")}</p></div>}
      {shown.map(key => {
        const state = status(key); const selected = pending?.key.key_prefix === key.key_prefix;
        return <article key={key.key_prefix} aria-label={`${key.label} ${key.key_prefix}`} className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-5 space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-semibold break-all">{key.label}</h2><span className={`rounded-full border px-2.5 py-1 text-xs ${state === "active" ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400" : state === "expired" ? "border-amber-500/40 text-amber-600 dark:text-amber-400" : "border-(--card-border) text-(--text-muted)"}`}>{t(`filter_${state}`)}</span></div><code dir="ltr" className="text-xs text-(--text-muted)">{key.key_prefix}••••••••</code></div>
            {state !== "revoked" && <div className="flex flex-wrap gap-2">
              <button className={buttonStyle} disabled={busy || !!secret} onClick={() => openAction(key, "rename")}><Pencil size={14} />{t("editLabel")}</button>
              {state === "active" && <button className={buttonStyle} disabled={busy || !!secret} onClick={() => openAction(key, "rotate")}><RotateCw size={14} />{t("rotate")}</button>}
              <button className={`${buttonStyle} text-red-600 dark:text-red-400`} disabled={busy || !!secret} onClick={() => openAction(key, "revoke")}><Trash2 size={14} />{t("revokeBtn")}</button>
            </div>}
          </div>
          <div className="flex flex-wrap gap-2">{key.scopes.map(scope => <span key={scope} className="rounded-md border border-(--card-border) bg-(--background) px-2 py-1 text-xs" dir="ltr">{scope === "*" ? t("fullAccessBadge") : scope}</span>)}</div>
          <dl className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
            <div><dt className="text-(--text-muted)">{t("source")}</dt><dd className="mt-1">{t(["vscode", "dotscramble", "dashboard"].includes(key.source) ? `source_${key.source}` : "source_legacy")}</dd></div>
            <div><dt className="text-(--text-muted)">{t("lastUsed")}</dt><dd className="mt-1">{date(key.last_used_at)}</dd></div>
            <div><dt className="text-(--text-muted)">{t("expirationLabel")}</dt><dd className="mt-1">{key.expires_at ? date(key.expires_at) : t("neverExpires")}</dd></div>
            <div><dt className="text-(--text-muted)">{t("createdOn")}</dt><dd className="mt-1">{date(key.created_at)}</dd></div>
          </dl>
          <p className="text-xs text-(--text-muted)">{t("requestCount", { count: key.request_count })}{key.rotated_at ? ` · ${t("lastReplaced")}: ${date(key.rotated_at)}` : ""}{key.revoked_at ? ` · ${t("revokedOn")}: ${date(key.revoked_at)}` : ""}</p>
          {selected && pending && <form aria-label={t(`confirm_${pending.action}`)} onSubmit={e => { e.preventDefault(); void mutate(`/api/keys/${key.key_prefix}${pending.action === "rotate" ? "/rotate" : ""}`, pending.action === "rename" ? "PATCH" : pending.action === "revoke" ? "DELETE" : "POST", pending.action === "rename" ? { label: editLabel.trim() } : undefined); }} className="rounded-xl border border-(--card-border) bg-(--background) p-4 space-y-3">
            <h3 className="font-semibold">{t(`confirm_${pending.action}`)} — {key.label}</h3>
            {pending.action === "rename" ? <label className="block space-y-2"><span className="text-sm">{t("keyLabel")}</span><input className={inputStyle} value={editLabel} maxLength={100} required onChange={e => setEditLabel(e.target.value)} autoFocus /></label> : <p className="text-sm text-(--text-muted)">{t(pending.action === "rotate" ? "rotateWarning" : "revokeWarning")}</p>}
            <div className="flex gap-2"><button className={`${buttonStyle} ${pending.action === "revoke" ? "bg-red-600 text-white" : "bg-(--primary) text-(--primary-text)"}`} disabled={busy || (pending.action === "rename" && !editLabel.trim())}>{busy ? t("working") : t(pending.action === "rename" ? "save" : `confirm_${pending.action}`)}</button><button type="button" className={buttonStyle} disabled={busy} onClick={() => setPending(null)}>{t("cancel")}</button></div>
          </form>}
        </article>;
      })}
    </section>
    <aside className="text-sm text-(--text-muted) space-y-2 border-t border-(--card-border) pt-5"><p>{t("connectionHelp")}</p><p>{t("historyHelp")}</p></aside>
  </main>;
}
