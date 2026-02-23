import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { z } from "zod";

const productSlugSchema = z.object({
  slug: z.string().min(1).max(100),
});

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubHeaders = {
  Authorization: `token ${GITHUB_TOKEN}`,
  "User-Agent": "dotsuite-app/1.0",
  Accept: "application/vnd.github.v3+json",
};

// caching options for GitHub API requests to reduce latency and avoid hitting rate limits
const getFetchOptions = (repo: string): RequestInit => ({
  headers: githubHeaders,
  next: { tags: [`github-${repo}`] },
});

const getNoTokenOptions = (repo: string): RequestInit => ({
  headers: { "User-Agent": "dotsuite-app/1.0" },
  next: { tags: [`github-${repo}`] },
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Validate slug
    const validation = productSlugSchema.safeParse({ slug });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid product slug" },
        { status: 400 }
      );
    }

    // 🛡️ Rate Limiting (30 requests per minute per IP for ALL products)
    const ip = getClientIP(req.headers);
    const rateLimitIdentifier = `${ip}_product_detail`; // unique identifier for product detail endpoint
    const rateLimit = await checkRateLimit(rateLimitIdentifier, "fetch-product-detail", 30, 60);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    await connectDB();
    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const repo = product.githubRepo;

    // if no repo, return product data with null GitHub and OpenVSX info (some products might not have a GitHub repo, especially if they are not open-source or are custom solutions)
    if (!repo) {
      return NextResponse.json({
        product,
        github: null,
        openVsx: null,
      });
    }

    // new way to fetch all GitHub data in parallel with proper error handling and caching
    const [repoRes, readmeRes, releasesRes, changelogRes, packageRes, openVsxRes] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${repo}`, getFetchOptions(repo)),
      fetch(`https://api.github.com/repos/${repo}/readme`, getFetchOptions(repo)),
      fetch(`https://api.github.com/repos/${repo}/releases/latest`, getFetchOptions(repo)),
      fetch(`https://raw.githubusercontent.com/${repo}/main/CHANGELOG.md`, getNoTokenOptions(repo)),
      fetch(`https://raw.githubusercontent.com/${repo}/main/package.json`, getNoTokenOptions(repo)),
      // cache for 24 hours since OpenVSX data doesn't change frequently and we want to minimize requests to their API
      fetch(`https://open-vsx.org/api/freerave/${slug}`, { next: { revalidate: 86400 } }), 
    ]);

    const repoData = repoRes.status === "fulfilled" && repoRes.value.ok
      ? await repoRes.value.json() : {};

    const readmeData = readmeRes.status === "fulfilled" && readmeRes.value.ok
      ? await readmeRes.value.json() : null;

    const releaseData = releasesRes.status === "fulfilled" && releasesRes.value.ok
      ? await releasesRes.value.json() : null;

    const changelogText = changelogRes.status === "fulfilled" && changelogRes.value.ok
      ? await changelogRes.value.text() : null;

    const packageData = packageRes.status === "fulfilled" && packageRes.value.ok
      ? await packageRes.value.json() : null;

    const openVsxData = openVsxRes.status === "fulfilled" && openVsxRes.value.ok
      ? await openVsxRes.value.json() : null;

    const readme = readmeData?.content
      ? Buffer.from(readmeData.content, "base64").toString("utf-8")
      : null;

    const version = releaseData?.tag_name ?? (packageData?.version ? `v${packageData.version}` : "N/A");

    return NextResponse.json({
      product,
      github: {
        stars: repoData.stargazers_count ?? 0,
        forks: repoData.forks_count ?? 0,
        issues: repoData.open_issues_count ?? 0,
        description: repoData.description ?? "",
        version,
        readme,
        changelog: changelogText,
      },
      openVsx: openVsxData ? {
        version: openVsxData?.version ?? null,
        downloads: openVsxData.downloadCount ?? 0,
        description: openVsxData.description ?? "",
        url: `https://open-vsx.org/extension/freerave/${slug}`,
      } : null,
    });
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}