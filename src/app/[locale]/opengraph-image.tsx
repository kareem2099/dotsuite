import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "dotsuite — Developer Productivity Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Primary glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            left: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Secondary glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "56px 72px",
          }}
        >
          {/* Top: Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: "800",
                color: "#000",
              }}
            >
              d
            </div>
            <span
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "-0.5px",
              }}
            >
              dotsuite.dev
            </span>
          </div>

          {/* Center: Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "80px",
                fontWeight: "800",
                color: "#ffffff",
                lineHeight: 1.05,
                letterSpacing: "-3px",
              }}
            >
              Developer tools
              <br />
              <span style={{ color: "#10b981" }}>you&apos;ll love</span>
            </div>
            <div
              style={{
                fontSize: "28px",
                color: "#a1a1aa",
                fontWeight: "400",
                lineHeight: 1.4,
                maxWidth: "680px",
              }}
            >
              VS Code extensions, Python tools & web solutions — trusted by
              13,000+ developers worldwide.
            </div>
          </div>

          {/* Bottom: Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {[
              { label: "9+ Tools", color: "#10b981" },
              { label: "Open Source", color: "#818cf8" },
              { label: "5 Languages", color: "#f59e0b" },
              { label: "MIT License", color: "#a1a1aa" },
            ].map((pill) => (
              <div
                key={pill.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  fontSize: "18px",
                  color: pill.color,
                  fontWeight: "600",
                }}
              >
                {pill.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
