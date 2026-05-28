"use client";

import { useState, useCallback, useEffect } from "react";

// ── Platform Definitions ───────────────────────────────────────────────────────

type PlatformId = "telegram" | "x" | "linkedin" | "reddit" | "devto" | "medium";

interface PlatformConfig {
  id: PlatformId;
  label: string;
  description: string;
  glowColor: string;
  borderColor: string;
  iconBg: string;
  icon: React.ReactNode;
  /** true = connected via DotSuite OAuth; false = user provides key via extension (BYOK) */
  oauthSupported: boolean;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "telegram",
    label: "Telegram",
    description: "Post to channels & groups",
    glowColor: "rgba(6, 182, 212, 0.15)",
    borderColor: "rgba(6, 182, 212, 0.35)",
    iconBg: "bg-cyan-500/10",
    oauthSupported: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-cyan-400">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: "x",
    label: "X (Twitter)",
    description: "Schedule tweets & threads",
    glowColor: "rgba(161, 161, 170, 0.12)",
    borderColor: "rgba(161, 161, 170, 0.3)",
    iconBg: "bg-zinc-700/30",
    oauthSupported: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-zinc-300">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Publish professional posts",
    glowColor: "rgba(59, 130, 246, 0.15)",
    borderColor: "rgba(59, 130, 246, 0.35)",
    iconBg: "bg-blue-500/10",
    oauthSupported: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "reddit",
    label: "Reddit",
    description: "Post to subreddits",
    glowColor: "rgba(251, 146, 60, 0.15)",
    borderColor: "rgba(251, 146, 60, 0.35)",
    iconBg: "bg-orange-500/10",
    oauthSupported: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
  {
    id: "devto",
    label: "Dev.to",
    description: "Publish developer articles",
    glowColor: "rgba(244, 244, 245, 0.15)",
    borderColor: "rgba(244, 244, 245, 0.35)",
    iconBg: "bg-zinc-800",
    oauthSupported: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-zinc-100">
        <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H3.71V7.93h2.3c1.47 0 2.1.19 2.54.77.34.46.43 1.09.43 2.9v.8c0 1.8-.09 2.44-.42 2.9zm4.27 0h-2.1V7.93h2.1v7.37zm5.54-1.28h-2.1v1.16h2.82v1.2H14.1V7.93h4.94v1.2h-2.82v1.28h2.1v1.16h-2.1v1.17h2.82v1.2h-4.94v-1.16zM20.29 15.3v-1.16h-2.1v-1.28h2.1v-1.2h-2.82V7.93h4.94v1.2h-2.82v1.2h2.82v1.28h-2.1v1.16h2.1v1.2h-4.94z" />
      </svg>
    ),
  },
  {
    id: "medium",
    label: "Medium",
    description: "Publish blog posts",
    glowColor: "rgba(24, 24, 27, 0.15)",
    borderColor: "rgba(244,244,245, 0.2)",
    iconBg: "bg-zinc-200 dark:bg-zinc-800",
    oauthSupported: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-zinc-900 dark:text-zinc-100">
        <path d="M6.86 12.33c0 3.8-3.07 6.88-6.86 6.88s-6.86-3.08-6.86-6.88 3.07-6.88 6.86-6.88 6.86 3.08 6.86 6.88z m6.8 0c0 3.6-1.53 6.51-3.41 6.51s-3.41-2.91-3.41-6.51 1.53-6.51 3.41-6.51 3.41 2.91 3.41 6.51z m4.51 0c0 3.2-0.65 5.8-1.44 5.8s-1.44-2.6-1.44-5.8 0.65-5.8 1.44-5.8 1.44 2.6 1.44 5.8z" />
      </svg>
    ),
  },
];

// ── Auth Method Badge ──────────────────────────────────────────────────────────

type AuthMethod = "oauth" | "byok";

function AuthBadge({ method }: { method: AuthMethod }) {
  if (method === "oauth") {
    return (
      <span
        title="Connected via DotSuite OAuth — managed automatically by the extension"
        className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide"
        style={{
          backgroundColor: "rgba(99,102,241,0.15)",
          border: "1px solid rgba(99,102,241,0.4)",
          color: "#818cf8",
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z" />
        </svg>
        OAuth
      </span>
    );
  }
  return (
    <span
      title="Connected via your own key (BYOK) — set from the VS Code extension"
      className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide"
      style={{
        backgroundColor: "rgba(234,179,8,0.12)",
        border: "1px solid rgba(234,179,8,0.35)",
        color: "#facc15",
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
        <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
      </svg>
      BYOK
    </span>
  );
}

// ── Platform Card (read-only) ──────────────────────────────────────────────────

interface PlatformCardProps {
  platform: PlatformConfig;
  connected: boolean;
  authMethod?: AuthMethod;
  isLoading: boolean;
}

function PlatformCard({ platform, connected, authMethod, isLoading }: PlatformCardProps) {
  return (
    <div
      className="relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300"
      style={{
        backgroundColor: connected
          ? `color-mix(in srgb, ${platform.glowColor}, #0a0a0a 90%)`
          : "#0f0f0f",
        borderColor: connected ? platform.borderColor : "rgba(38,38,38,1)",
        boxShadow: connected ? `0 0 20px ${platform.glowColor}` : "none",
      }}
    >
      {/* Icon + live dot */}
      <div className="relative shrink-0">
        <div
          className={`w-10 h-10 rounded-xl ${platform.iconBg} flex items-center justify-center`}
          style={connected ? { borderWidth: 1, borderColor: platform.borderColor } : {}}
        >
          {platform.icon}
        </div>
        {connected && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a0a0a]">
              <div className="w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm">{platform.label}</span>
          {connected && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: platform.glowColor, color: "white" }}
            >
              LIVE
            </span>
          )}
          {connected && authMethod && <AuthBadge method={authMethod} />}
        </div>
        <p className="text-xs text-zinc-500 mt-0.5">{platform.description}</p>
      </div>

      {/* Status indicator (no action button) */}
      <div className="shrink-0">
        {isLoading ? (
          <div className="w-8 h-8 flex items-center justify-center">
            <svg className="animate-spin w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : connected ? (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold"
            style={{
              backgroundColor: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)",
              color: "#10b981",
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Connected
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold"
            style={{
              backgroundColor: "rgba(39,39,42,0.6)",
              border: "1px solid rgba(63,63,70,1)",
              color: "#71717a",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Not connected
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface ConnectionState {
  [platform: string]: boolean;
}

interface AuthMethodState {
  [platform: string]: AuthMethod | undefined;
}

export default function ConnectedAccounts() {
  const [connections, setConnections] = useState<ConnectionState>({});
  const [authMethods, setAuthMethods] = useState<AuthMethodState>({});
  const [syncing, setSyncing] = useState(false);

  // Fetch current connection status from Rust via internal API — read-only
  const fetchConnections = useCallback(async (quiet = false) => {
    if (!quiet) setSyncing(true);
    try {
      const res = await fetch("/api/oauth/status");
      if (res.ok) {
        const data: {
          connected_platforms: string[];
          auth_methods?: Record<string, string>;
        } = await res.json();

        const state: ConnectionState = {};
        const methods: AuthMethodState = {};

        PLATFORMS.forEach((p) => {
          state[p.id] = data.connected_platforms.includes(p.id);
          if (state[p.id]) {
            // Prefer server-provided auth_methods map; fall back to oauthSupported flag
            methods[p.id] = (data.auth_methods?.[p.id] as AuthMethod | undefined)
              ?? (p.oauthSupported ? "oauth" : "byok");
          }
        });

        setConnections(state);
        setAuthMethods(methods);
      }
    } catch {
      // Silently fail on background refresh
    } finally {
      if (!quiet) setSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
    // Auto-refresh every 30s so the page reflects changes made in the extension
    const interval = setInterval(() => fetchConnections(true), 30_000);
    return () => clearInterval(interval);
  }, [fetchConnections]);

  const connectedCount = Object.values(connections).filter(Boolean).length;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: "#0a0a0a", borderColor: "#1a1a1a" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#1a1a1a" }}>
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.2))",
              borderWidth: 1,
              borderColor: "rgba(168,85,247,0.3)",
            }}
          >
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-sm">Connected Accounts</h2>
            <p className="text-xs text-zinc-500">
              {connectedCount === 0
                ? "No accounts connected yet"
                : `${connectedCount} of ${PLATFORMS.length} connected`}
            </p>
          </div>
        </div>

        {/* Sync button */}
        <button
          onClick={() => fetchConnections()}
          disabled={syncing}
          title="Refresh connection status"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all"
        >
          <svg
            className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Platform list — status only, no actions */}
      <div className="p-4 space-y-3">
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            connected={!!connections[platform.id]}
            authMethod={authMethods[platform.id]}
            isLoading={false}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 border-t flex items-start gap-2"
        style={{ borderColor: "#1a1a1a", backgroundColor: "#080808" }}
      >
        <svg className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-zinc-600 leading-relaxed">
          Connections are managed exclusively from the{" "}
          <span className="text-zinc-400 font-medium">DotShare VS Code extension</span>.
          Tokens are encrypted in VS Code&apos;s secure storage and synced to the server — nothing is entered here.
        </p>
      </div>
    </div>
  );
}
