"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import TimezoneSelect from "react-timezone-select";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import LanguageSelector from "@/components/LanguageSelector";
import SettingsSkeleton from "@/components/skeletons/SettingsSkeleton";


export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("Settings");

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "privacy">("account");
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  // Account Settings
  const [account, setAccount] = useState({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Cairo",
  });
  
  // Keep language in sync - it will be managed by LanguageSelector component

  // Notifications
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    productNews: false,
    securityAlerts: true,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleSave = async () => {
    // replace with actual API call later
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (status === "loading") {
    return <SettingsSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">
        <span className="text-(--primary)">{t("title")}</span>
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 p-1 bg-(--card-bg) border border-(--card-border) rounded-xl w-fit">
        {(["account", "notifications", "privacy"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-(--primary) text-(--background)"
                : "text-(--text-muted) hover:text-(--foreground)"
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Success Toast */}
      {saved && (
        <div className="mb-6 px-4 py-3 bg-(--primary)/10 border border-(--primary)/20 rounded-lg text-sm text-(--primary) flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t("savedSuccess")}
        </div>
      )}

      {/* Account Tab */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
            <h3 className="text-lg font-semibold mb-6">{t("accountSettings")}</h3>
            <div className="space-y-4">
              {/* Email - readonly */}
              <div>
                <label className="block text-sm text-(--text-muted) mb-1">{t("email")}</label>
                <div className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm text-(--text-muted) flex items-center justify-between">
                  {session?.user?.email}
                  <span className="text-xs px-2 py-0.5 bg-(--card-border) rounded-full">{t("readOnly")}</span>
                </div>
              </div>

              {/* Language */}
              <LanguageSelector label={t("language")} />

              {/* Timezone */}
              <div>
                <label className="block text-sm text-(--text-muted) mb-1">{t("timezone")}</label>
                <TimezoneSelect
                  value={account.timezone}
                  onChange={(tz) => setAccount({ ...account, timezone: tz.value })}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "var(--background)",
                      borderColor: "var(--card-border)",
                      borderRadius: "0.5rem",
                      padding: "4px",
                      fontSize: "0.875rem",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#10b981" },
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "0.5rem",
                    }),
                    menuList: (base) => ({
                      ...base,
                      backgroundColor: "var(--card-bg)",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused
                        ? "var(--card-border)"
                        : "var(--card-bg)",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "var(--foreground)",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "var(--foreground)",
                    }),
                    indicatorSeparator: (base) => ({
                      ...base,
                      backgroundColor: "var(--card-border)",
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: "var(--text-muted)",
                      "&:hover": { color: "#10b981" },
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
            <h3 className="text-lg font-semibold mb-6">{t("connectedAccounts")}</h3>
            <div className="space-y-3">
              {/* Google */}
              <div className="flex items-center justify-between p-4 bg-(--background) border border-(--card-border) rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm">{t("google")}</span>
                </div>
                <span className="text-xs px-2 py-1 bg-(--primary)/10 text-(--primary) border border-(--primary)/20 rounded-full">
                  {t("connected")}
                </span>
              </div>

              {/* GitHub */}
              <div className="flex items-center justify-between p-4 bg-(--background) border border-(--card-border) rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm">{t("github")}</span>
                </div>
                <span className="text-xs px-2 py-1 bg-(--card-border) text-(--text-muted) rounded-full">
                  {t("notConnected")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
          <h3 className="text-lg font-semibold mb-6">{t("notificationPrefs")}</h3>
          <div className="space-y-4">
            {[
              { key: "emailUpdates", label: t("notifEmailUpdates"), desc: t("notifEmailUpdatesDesc") },
              { key: "productNews", label: t("notifProductNews"), desc: t("notifProductNewsDesc") },
              { key: "securityAlerts", label: t("notifSecurityAlerts"), desc: t("notifSecurityAlertsDesc") },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-(--background) border border-(--card-border) rounded-lg">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-(--text-muted) mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    notifications[key as keyof typeof notifications] ? "bg-(--primary)" : "bg-(--card-border)"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications[key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
            <h3 className="text-lg font-semibold mb-6">{t("privacySettings")}</h3>
            <div className="space-y-4">
              {[
                { key: "profileVisible", label: t("privacyPublicProfile"), desc: t("privacyPublicProfileDesc") },
                { key: "showEmail", label: t("privacyShowEmail"), desc: t("privacyShowEmailDesc") },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-4 bg-(--background) border border-(--card-border) rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-(--text-muted) mt-0.5">{desc}</p>
                  </div>
                  <button
                    onClick={() => setPrivacy({ ...privacy, [key]: !privacy[key as keyof typeof privacy] })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      privacy[key as keyof typeof privacy] ? "bg-(--primary)" : "bg-(--card-border)"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        privacy[key as keyof typeof privacy] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-8 bg-(--card-bg) border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-semibold mb-2 text-red-400">{t("dangerZone")}</h3>
            <p className="text-(--text-muted) text-sm mb-4">
              {t("dangerZoneDesc")}
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/10 transition-colors">
              {t("deleteAccount")}
            </button>
          </div>
          <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            />
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t("saveSettings")}
        </button>
      </div>
    </div>
  );
}
