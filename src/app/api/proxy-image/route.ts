import { NextRequest, NextResponse } from "next/server";

// Cache image responses for 24 hours
const CACHE_CONTROL = "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

// Allowed domains for image proxying
const ALLOWED_HOSTNAMES = [
  "raw.githubusercontent.com",
  "github.com",
  "user-images.githubusercontent.com",
  "camo.githubusercontent.com",
  "avatars.githubusercontent.com",
  "img.shields.io",
  "shields.io",
  "cdn.jsdelivr.net",
  "cdn.buymeacoffee.com",
  "badgen.net",
  "vscode-marketplace.azureedge.net",
  "open-vsx.org",
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");
    const repo = searchParams.get("repo");
    const path = searchParams.get("path");
    const branch = searchParams.get("branch") || "main";

    let urlToFetch = targetUrl;

    if (!urlToFetch && repo && path) {
      const cleanPath = path.replace(/^\.?\//, "");
      urlToFetch = `https://raw.githubusercontent.com/${repo}/${branch}/${cleanPath}`;
    }

    if (!urlToFetch) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    // Safety check URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlToFetch);
    } catch {
      return new NextResponse("Invalid URL", { status: 400 });
    }

    // Domain validation
    const isAllowed = ALLOWED_HOSTNAMES.some(
      (h) => parsedUrl.hostname === h || parsedUrl.hostname.endsWith(`.${h}`)
    );

    if (!isAllowed && !parsedUrl.hostname.includes("github") && !parsedUrl.hostname.includes("shields")) {
      return new NextResponse("Domain not allowed for image proxy", { status: 403 });
    }

    // Fetch image with browser-like headers
    let response = await fetch(urlToFetch, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      next: { revalidate: 86400 },
    });

    // If 404 and was requesting main branch on GitHub, retry with master branch
    if (response.status === 404 && urlToFetch.includes("raw.githubusercontent.com") && urlToFetch.includes("/main/")) {
      const fallbackUrl = urlToFetch.replace("/main/", "/master/");
      const fallbackRes = await fetch(fallbackUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "image/*,*/*;q=0.8",
        },
        next: { revalidate: 86400 },
      });
      if (fallbackRes.ok) {
        response = fallbackRes;
      }
    }

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": CACHE_CONTROL,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy image error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
