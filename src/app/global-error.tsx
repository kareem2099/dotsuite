"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --background: #ffffff;
            --foreground: #0a0a0a;
            --primary: #10b981;
            --primary-text: #0a0a0a;
            --text-muted: #737373;
            --danger: #ef4444;
            --danger-bg: rgba(239,68,68,0.1);
            --danger-border: rgba(239,68,68,0.2);
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --background: #0a0a0a;
              --foreground: #ffffff;
              --text-muted: #a3a3a3;
            }
          }
        `}</style>
      </head>
      <body style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        margin: 0
      }}>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{ maxWidth: "28rem", width: "100%", textAlign: "center" }}>

            <p style={{ fontSize: "5rem", fontWeight: "800", color: "var(--danger)", marginBottom: "1rem" }}>
              500
            </p>

            <div style={{
              width: "64px", height: "64px", margin: "0 auto 1.5rem",
              borderRadius: "50%",
              backgroundColor: "var(--danger-bg)",
              border: "1px solid var(--danger-border)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="32" height="32" fill="none" stroke="var(--danger)" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              Something went wrong
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
              {error.message || "A critical error occurred. Please try again."}
            </p>

            <button
              onClick={reset}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--primary)",
                color: "var(--primary-text)",
                fontWeight: "600",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Try Again
            </button>

          </div>
        </div>
      </body>
    </html>
  );
}