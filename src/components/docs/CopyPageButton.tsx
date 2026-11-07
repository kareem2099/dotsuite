"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies the page's Markdown, ready to paste into an AI assistant or a note. */
export default function CopyPageButton({ markdown, label, copiedLabel }: { markdown: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy page:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-(--card-border) bg-(--card-bg) hover:border-(--primary) transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-(--text-muted)" />}
      <span className={copied ? "text-emerald-500" : ""}>{copied ? copiedLabel : label}</span>
    </button>
  );
}
