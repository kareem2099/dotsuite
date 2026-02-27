"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: Props) {
  const { data: session } = useSession();
  const t = useTranslations("DeleteAccount");
  const [input, setInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const userEmail = session?.user?.email ?? "";
  const isMatch = input === userEmail;

  useEffect(() => {
    if (isOpen) {
      setInput("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!isMatch) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        setError(t("errorMessage"));
        setIsDeleting(false);
      }
    } catch {
      setError(t("errorMessage"));
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
        <div className="bg-(--card-bg) border border-red-500/30 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-(--danger-bg) border border-(--danger-border) flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-400">{t("title")}</h2>
              <p className="text-xs text-(--text-muted)">{t("subtitle")}</p>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-(--danger-bg) border border-(--danger-border) rounded-lg mb-6">
            <p className="text-sm text-red-400 leading-relaxed">
              {t("warning")}
            </p>
          </div>

          {/* Confirm Email */}
          <div className="mb-6">
            <label className="block text-sm text-(--text-muted) mb-2">
              {t("confirmLabel")}
              <span className="ml-1 text-(--foreground) font-medium select-none">
                {userEmail}
              </span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              onPaste={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              placeholder={t("placeholder")}
              className={`w-full px-4 py-3 bg-(--background) border rounded-lg text-sm focus:outline-none transition-colors ${
                input.length > 0
                  ? isMatch
                    ? "border-green-500 focus:border-green-500"
                    : "border-red-500 focus:border-red-500"
                  : "border-(--card-border) focus:border-red-500"
              }`}
            />
            {input.length > 0 && !isMatch && (
              <p className="text-xs text-red-400 mt-1">{t("emailDoesNotMatch")}</p>
            )}
            {isMatch && (
              <p className="text-xs text-green-500 mt-1">{t("emailConfirmed")}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 mb-4">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-(--card-border) rounded-lg text-sm text-(--text-muted) hover:border-(--text-muted) transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleDelete}
              disabled={!isMatch || isDeleting}
              className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              {isDeleting ? t("deleting") : t("deleteAccount")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
