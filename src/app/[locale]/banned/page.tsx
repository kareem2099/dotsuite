import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Terminated — DotSuite",
  robots: { index: false, follow: false },
};

export default function BannedPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Subtle radial glow behind the card */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(220,38,38,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          textAlign: "center",
          padding: "3rem 2.5rem",
          border: "1px solid rgba(127,29,29,0.6)",
          borderRadius: "16px",
          maxWidth: "440px",
          width: "90%",
          background:
            "linear-gradient(135deg, rgba(12,3,3,0.95) 0%, rgba(20,5,5,0.95) 100%)",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 0 0 1px rgba(220,38,38,0.08), 0 24px 64px rgba(0,0,0,0.8)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: "4.5rem",
            marginBottom: "1.5rem",
            lineHeight: 1,
            filter: "drop-shadow(0 0 16px rgba(220,38,38,0.4))",
          }}
        >
          ⛔
        </div>

        {/* Heading */}
        <h1
          style={{
            color: "#ef4444",
            fontSize: "1.625rem",
            fontWeight: 700,
            margin: "0 0 0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          Account Terminated
        </h1>

        {/* Subheading */}
        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            margin: "0 0 0.5rem",
          }}
        >
          Your account has been permanently suspended for violating{" "}
          <strong style={{ color: "#d1d5db" }}>DotSuite Terms of Service</strong>
          .
        </p>

        <p
          style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            margin: "0 0 2rem",
          }}
        >
          All active sessions, API keys, and scheduled posts have been
          terminated. Any active subscription has been cancelled.
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(127,29,29,0.3)",
            margin: "0 0 1.5rem",
          }}
        />

        {/* Support */}
        <p style={{ color: "#4b5563", fontSize: "0.8125rem", margin: 0 }}>
          If you believe this is an error, contact support:
        </p>
        <a
          href="mailto:kareem209907@gmail.com"
          style={{
            color: "#9ca3af",
            fontSize: "0.875rem",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            marginTop: "0.375rem",
            display: "inline-block",
            transition: "color 0.2s",
          }}
        >
          kareem209907@gmail.com
        </a>

        {/* Code badge */}
        <div
          style={{
            marginTop: "2rem",
            display: "inline-block",
            padding: "0.25rem 0.75rem",
            background: "rgba(220,38,38,0.08)",
            border: "1px solid rgba(220,38,38,0.2)",
            borderRadius: "999px",
            color: "#7f1d1d",
            fontSize: "0.6875rem",
            letterSpacing: "0.08em",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          ACCOUNT_TERMINATED
        </div>
      </div>
    </main>
  );
}
