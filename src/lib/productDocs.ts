import { products as staticProducts, IProduct } from "@/config/products";
import { createSlugger } from "@/lib/headingSlug";

// Product docs live in each product's GitHub repo under docs/, described by docs/index.json:
// { "version": "2.2.0", "sections": [{ "title": "...", "pages": [{ "slug", "title", "file" }] }] }
// The first page of the first section is the docs home.

export interface DocsPageEntry {
  slug: string;
  title: string;
  /** Path relative to docs/, e.g. "scripting/overview.md" */
  file: string;
}

export interface DocsSection {
  title: string;
  pages: DocsPageEntry[];
}

export interface DocsIndex {
  version: string | null;
  sections: DocsSection[];
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface DocsSearchEntry {
  slug: string;
  page: string;
  section: string;
  /** Heading text, or null for the page itself */
  heading: string | null;
  id: string | null;
}

export interface DocsPageData {
  product: IProduct;
  index: DocsIndex;
  page: DocsPageEntry;
  section: DocsSection;
  markdown: string;
  description: string;
  toc: TocItem[];
  prev: DocsPageEntry | null;
  next: DocsPageEntry | null;
  search: DocsSearchEntry[];
  sourceUrl: string;
}

const fetchOptions = (repo: string): RequestInit => ({
  headers: { "User-Agent": "dotsuite-app/1.0" },
  next: { tags: [`github-${repo}`], revalidate: 3600 },
});

const rawUrl = (repo: string, branch: string, path: string) =>
  `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;

const SLUG_RE = /^[a-z0-9-]+$/;
const FILE_RE = /^(?!.*\.\.)[\w./-]+\.md$/;

function parseIndex(raw: unknown): DocsIndex | null {
  if (!raw || typeof raw !== "object") return null;
  const { version, sections } = raw as { version?: unknown; sections?: unknown };
  if (!Array.isArray(sections)) return null;

  const parsed: DocsSection[] = [];
  for (const s of sections) {
    if (!s || typeof s.title !== "string" || !Array.isArray(s.pages)) continue;
    const pages = (s.pages as unknown[]).filter(
      (p): p is DocsPageEntry =>
        !!p &&
        typeof (p as DocsPageEntry).slug === "string" && SLUG_RE.test((p as DocsPageEntry).slug) &&
        typeof (p as DocsPageEntry).title === "string" &&
        typeof (p as DocsPageEntry).file === "string" && FILE_RE.test((p as DocsPageEntry).file)
    );
    if (pages.length) parsed.push({ title: s.title, pages });
  }
  if (!parsed.length) return null;
  return { version: typeof version === "string" ? version : null, sections: parsed };
}

export async function getDocsIndex(repo: string, branch: string): Promise<DocsIndex | null> {
  try {
    const res = await fetch(rawUrl(repo, branch, "docs/index.json"), fetchOptions(repo));
    if (!res.ok) return null;
    return parseIndex(await res.json());
  } catch {
    return null;
  }
}

async function getMarkdown(repo: string, branch: string, file: string): Promise<string | null> {
  try {
    const res = await fetch(rawUrl(repo, branch, `docs/${file}`), fetchOptions(repo));
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

// ─── Markdown helpers ────────────────────────────────────────────────────────

/** Split into prose and fenced-code chunks so code is never rewritten or scanned. */
function splitFences(markdown: string): { code: boolean; text: string }[] {
  const chunks: { code: boolean; text: string }[] = [];
  let buffer: string[] = [];
  let fence: string | null = null;
  for (const line of markdown.split("\n")) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (!fence && marker) {
      chunks.push({ code: false, text: buffer.join("\n") });
      buffer = [line];
      fence = marker;
    } else if (fence && marker && marker[0] === fence[0] && marker.length >= fence.length) {
      buffer.push(line);
      chunks.push({ code: true, text: buffer.join("\n") });
      buffer = [];
      fence = null;
    } else {
      buffer.push(line);
    }
  }
  chunks.push({ code: fence !== null, text: buffer.join("\n") });
  return chunks;
}

function posixJoin(dir: string, rel: string): string {
  const parts = (dir ? dir.split("/") : []).concat(rel.split("/"));
  const out: string[] = [];
  for (const p of parts) {
    if (!p || p === ".") continue;
    if (p === "..") out.pop();
    else out.push(p);
  }
  return out.join("/");
}

/**
 * Point relative links at dotsuite doc routes when they target another doc page,
 * and at GitHub (blob for links, raw for images) for any other repo file.
 */
function rewriteLinks(
  markdown: string,
  repo: string,
  branch: string,
  file: string,
  fileToHref: Map<string, string>
): string {
  const dir = `docs/${file}`.split("/").slice(0, -1).join("/");
  // Link text may itself contain `code`, so links are matched across inline code spans
  const rewrite = (prose: string) =>
    prose.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (match, bang: string, label: string, target: string) => {
      if (/^(https?:|mailto:|#)/i.test(target)) return match;
      const [path, hash] = target.split("#");
      const resolved = posixJoin(dir, path);
      const fragment = hash ? `#${hash}` : "";
      const docHref = resolved.startsWith("docs/") ? fileToHref.get(resolved.slice(5)) : undefined;
      const href = bang
        ? rawUrl(repo, branch, resolved)
        : docHref
          ? `${docHref}${fragment}`
          : `https://github.com/${repo}/blob/${branch}/${resolved}${fragment}`;
      return `${bang}[${label}](${href})`;
    });

  return splitFences(markdown)
    .map((c) => (c.code ? c.text : rewrite(c.text)))
    .join("\n");
}

function plainHeading(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/`/g, "")
    .replace(/(\*\*|\*|~~)/g, "")
    .trim();
}

/** Every heading in document order with the same ids rehypeHeadingIds assigns. */
function extractHeadings(markdown: string): { level: number; text: string; id: string }[] {
  const slug = createSlugger();
  const headings: { level: number; text: string; id: string }[] = [];
  for (const chunk of splitFences(markdown)) {
    if (chunk.code) continue;
    for (const line of chunk.text.split("\n")) {
      const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
      if (!m) continue;
      const text = plainHeading(m[2]);
      headings.push({ level: m[1].length, text, id: slug(text) });
    }
  }
  return headings;
}

function firstParagraph(markdown: string): string {
  for (const chunk of splitFences(markdown)) {
    if (chunk.code) continue;
    for (const block of chunk.text.split(/\n\s*\n/)) {
      const t = block.trim();
      if (!t || /^(#|\||>|-|\*|\d+\.|<|!\[)/.test(t)) continue;
      return plainHeading(t.replace(/\n/g, " ")).slice(0, 200);
    }
  }
  return "";
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function docsHref(locale: string, productSlug: string, index: DocsIndex, pageSlug: string): string {
  const home = index.sections[0].pages[0].slug;
  const base = `/${locale}/product/${productSlug}/docs`;
  return pageSlug === home ? base : `${base}/${pageSlug}`;
}

export async function getDocsPage(
  productSlug: string,
  pageSlug: string | undefined,
  locale: string
): Promise<DocsPageData | null> {
  const product = staticProducts.find((p) => p.slug === productSlug);
  if (!product?.githubRepo || !product.docsBranch) return null;
  const { githubRepo: repo, docsBranch: branch } = product;

  const index = await getDocsIndex(repo, branch);
  if (!index) return null;

  const flat = index.sections.flatMap((section) => section.pages.map((page) => ({ section, page })));
  const position = pageSlug ? flat.findIndex((e) => e.page.slug === pageSlug) : 0;
  if (position === -1) return null;
  const { section, page } = flat[position];

  // All pages are fetched (and cached) so search can cover every page's headings
  const sources = await Promise.all(flat.map((e) => getMarkdown(repo, branch, e.page.file)));
  const source = sources[position];
  if (source === null) return null;

  const fileToHref = new Map(flat.map((e) => [e.page.file, docsHref(locale, productSlug, index, e.page.slug)]));

  const search: DocsSearchEntry[] = flat.flatMap((e, i) => [
    { slug: e.page.slug, page: e.page.title, section: e.section.title, heading: null, id: null },
    ...extractHeadings(sources[i] ?? "")
      .filter((h) => h.level === 2 || h.level === 3)
      .map((h) => ({ slug: e.page.slug, page: e.page.title, section: e.section.title, heading: h.text, id: h.id })),
  ]);

  return {
    product,
    index,
    page,
    section,
    markdown: rewriteLinks(source, repo, branch, page.file, fileToHref),
    description: firstParagraph(source),
    toc: extractHeadings(source)
      .filter((h): h is { level: 2 | 3; text: string; id: string } => h.level === 2 || h.level === 3)
      .map(({ level, text, id }) => ({ level, text, id })),
    prev: position > 0 ? flat[position - 1].page : null,
    next: position < flat.length - 1 ? flat[position + 1].page : null,
    search,
    sourceUrl: `https://github.com/${repo}/blob/${branch}/docs/${page.file}`,
  };
}
