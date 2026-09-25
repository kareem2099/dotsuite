import { products as staticProducts, IProduct } from "@/config/products";

export interface ProductDetails {
  product: IProduct;
  github: {
    stars: number;
    forks: number;
    issues: number;
    version: string;
    description: string;
    defaultBranch: string;
    readme: string | null;
    changelog: string | null;
  };
  openVsx: {
    version: string | null;
    downloads: number;
    description: string;
    url: string;
  } | null;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubHeaders: Record<string, string> = {
  "User-Agent": "dotsuite-app/1.0",
  Accept: "application/vnd.github.v3+json",
};

if (GITHUB_TOKEN) {
  githubHeaders.Authorization = `token ${GITHUB_TOKEN}`;
}

const getFetchOptions = (repo: string): RequestInit => ({
  headers: githubHeaders,
  next: { tags: [`github-${repo}`], revalidate: 3600 },
});

const getNoTokenOptions = (repo: string): RequestInit => ({
  headers: { "User-Agent": "dotsuite-app/1.0" },
  next: { tags: [`github-${repo}`], revalidate: 3600 },
});

export async function getProductDetails(slug: string): Promise<ProductDetails | null> {
  const product = staticProducts.find((p) => p.slug === slug);
  if (!product) return null;

  const defaultGithub = {
    stars: 0,
    forks: 0,
    issues: 0,
    version: "N/A",
    description: "",
    defaultBranch: "main",
    readme: null,
    changelog: null,
  };

  const repo = product.githubRepo;
  if (!repo) {
    return {
      product,
      github: defaultGithub,
      openVsx: null,
    };
  }

  try {
    const [repoRes, readmeRes, releasesRes, changelogRes, packageRes, openVsxRes] =
      await Promise.allSettled([
        fetch(`https://api.github.com/repos/${repo}`, getFetchOptions(repo)),
        fetch(`https://api.github.com/repos/${repo}/readme`, getFetchOptions(repo)),
        fetch(`https://api.github.com/repos/${repo}/releases/latest`, getFetchOptions(repo)),
        fetch(`https://raw.githubusercontent.com/${repo}/main/CHANGELOG.md`, getNoTokenOptions(repo)),
        fetch(`https://raw.githubusercontent.com/${repo}/main/package.json`, getNoTokenOptions(repo)),
        fetch(
          `https://open-vsx.org/api/freerave/${product.extensionId || slug}`,
          { next: { revalidate: 86400 } }
        ),
      ]);

    const repoData =
      repoRes.status === "fulfilled" && repoRes.value.ok
        ? await repoRes.value.json()
        : {};

    const defaultBranch = repoData.default_branch || "main";

    const readmeData =
      readmeRes.status === "fulfilled" && readmeRes.value.ok
        ? await readmeRes.value.json()
        : null;

    const releaseData =
      releasesRes.status === "fulfilled" && releasesRes.value.ok
        ? await releasesRes.value.json()
        : null;

    let changelogText =
      changelogRes.status === "fulfilled" && changelogRes.value.ok
        ? await changelogRes.value.text()
        : null;

    // Fallback changelog if default branch is different (e.g. master)
    if (!changelogText && defaultBranch !== "main") {
      try {
        const fallbackRes = await fetch(
          `https://raw.githubusercontent.com/${repo}/${defaultBranch}/CHANGELOG.md`,
          getNoTokenOptions(repo)
        );
        if (fallbackRes.ok) {
          changelogText = await fallbackRes.text();
        }
      } catch {
        // ignore
      }
    }

    let packageData =
      packageRes.status === "fulfilled" && packageRes.value.ok
        ? await packageRes.value.json()
        : null;

    if (!packageData && defaultBranch !== "main") {
      try {
        const fallbackPkg = await fetch(
          `https://raw.githubusercontent.com/${repo}/${defaultBranch}/package.json`,
          getNoTokenOptions(repo)
        );
        if (fallbackPkg.ok) {
          packageData = await fallbackPkg.json();
        }
      } catch {
        // ignore
      }
    }

    const openVsxData =
      openVsxRes.status === "fulfilled" && openVsxRes.value.ok
        ? await openVsxRes.value.json()
        : null;

    const readme = readmeData?.content
      ? Buffer.from(readmeData.content, "base64").toString("utf-8")
      : null;

    const version =
      releaseData?.tag_name ??
      (packageData?.version ? `v${packageData.version}` : "N/A");

    return {
      product,
      github: {
        stars: repoData.stargazers_count ?? 0,
        forks: repoData.forks_count ?? 0,
        issues: repoData.open_issues_count ?? 0,
        description: repoData.description ?? "",
        version,
        defaultBranch,
        readme,
        changelog: changelogText,
      },
      openVsx: openVsxData
        ? {
            version: openVsxData?.version ?? null,
            downloads: openVsxData.downloadCount ?? 0,
            description: openVsxData.description ?? "",
            url: `https://open-vsx.org/extension/freerave/${product.extensionId || slug}`,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching product GitHub data:", error);
    return {
      product,
      github: defaultGithub,
      openVsx: null,
    };
  }
}
