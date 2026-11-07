// GitHub-compatible heading anchors, so `#section` links written for GitHub also work on dotsuite.

/** Lower-case, drop punctuation and symbols (emoji included), spaces → "-". Mirrors github-slugger. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    // Emoji variation selectors and joiners are marks, but GitHub drops them with the emoji
    .replace(/[︎️‍]/g, "")
    .replace(/[^\p{L}\p{N}\p{M}\p{Pc}\s-]/gu, "")
    .replace(/\s/g, "-");
}

/** Repeated headings get "-1", "-2", … appended, in document order. */
export function createSlugger() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = slugifyHeading(text);
    let slug = base;
    let count = seen.get(base) ?? 0;
    while (seen.has(slug)) {
      count += 1;
      slug = `${base}-${count}`;
    }
    seen.set(base, count);
    seen.set(slug, 0);
    return slug;
  };
}

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

/** rehype plugin: give every h1–h6 a GitHub-style `id`. */
export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    const slug = createSlugger();
    const walk = (node: HastNode) => {
      if (node.type === "element" && /^h[1-6]$/.test(node.tagName ?? "")) {
        node.properties = { ...node.properties, id: slug(textOf(node)) };
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
