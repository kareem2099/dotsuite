"use client";

import Link from "next/link";

interface ErrorDisplayProps {
  title: string;
  message: string;
  primaryAction: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  type?: "error" | "notfound";
  code?: string;
}

export default function ErrorDisplay({
  title,
  message,
  primaryAction,
  secondaryAction,
  type = "error",
  code,
}: ErrorDisplayProps) {
  const isNotFound = type === "notfound";

  const ActionButton = ({ action, isPrimary }: { action: typeof primaryAction; isPrimary: boolean }) => {
    const className = isPrimary
      ? "px-6 py-2.5 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors"
      : "px-6 py-2.5 bg-(--card-bg) border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors";

    if (action.href) {
      return <Link href={action.href} className={className}>{action.label}</Link>;
    }
    return <button onClick={action.onClick} className={className}>{action.label}</button>;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Code (404 or 500) */}
        {code && (
          <p className="text-8xl font-bold text-(--primary) mb-4">{code}</p>
        )}

        {/* Icon */}
        <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
          isNotFound
            ? "bg-(--card-bg) border border-(--card-border)"
            : "bg-(--danger-bg) border border-(--danger-border)"
        }`}>
          {isNotFound ? (
            <svg className="w-8 h-8 text-(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-(--danger)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-(--text-muted) mb-8">{message}</p>

        <div className="flex gap-3 justify-center">
          <ActionButton action={primaryAction} isPrimary={true} />
          {secondaryAction && <ActionButton action={secondaryAction} isPrimary={false} />}
        </div>

      </div>
    </div>
  );
}