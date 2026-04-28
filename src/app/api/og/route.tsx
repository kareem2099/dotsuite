import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic params
    const title = searchParams.get("title") || "DotSuite Product";
    const rating = searchParams.get("rating") || "0.0";
    const brand = searchParams.get("brand") || "DotSuite";
    const image = searchParams.get("image");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#09090b", // zinc-950
            backgroundImage: "radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            fontFamily: "Inter, sans-serif",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 80px",
              background: "rgba(24, 24, 27, 0.8)", // zinc-900 with opacity
              border: "1px solid rgba(63, 63, 70, 0.5)", // zinc-700
              borderRadius: "24px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              maxWidth: "80%",
            }}
          >
            {image ? (
              <img
                src={image}
                alt="Product"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "20px",
                  marginBottom: "30px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "20px",
                  background: "linear-gradient(to bottom right, #3b82f6, #8b5cf6)", // blue-500 to violet-500
                  marginBottom: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                  fontWeight: "bold",
                }}
              >
                {title.charAt(0)}
              </div>
            )}
            
            <h1
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                textAlign: "center",
                margin: "0 0 20px 0",
                lineHeight: 1.1,
                background: "linear-gradient(to right, #ffffff, #a1a1aa)", // white to zinc-400
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {title}
            </h1>
            
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                fontSize: "32px",
                color: "#a1a1aa", // zinc-400
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="#eab308" // yellow-500
                  stroke="#eab308"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "10px" }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {rating}
              </div>
              <span style={{ color: "#3f3f46" }}>•</span>
              <span style={{ color: "#3b82f6", fontWeight: "600" }}>{brand}</span>
            </div>
          </div>
          
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              alignItems: "center",
              fontSize: "24px",
              fontWeight: "600",
              color: "#a1a1aa",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "#3b82f6",
                marginRight: "12px",
              }}
            />
            DotSuite
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
