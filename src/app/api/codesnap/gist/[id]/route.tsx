/**
 * GET /api/codesnap/gist/{gistId}
 *
 * A live CodeSnap image of a GitHub gist, for READMEs and articles:
 * `![CodeSnap](https://dotsuite.dev/api/codesnap/gist/<id>)`. The image follows
 * the gist, refreshing within ten minutes of an edit. The gist is read from
 * GitHub's public API each time the cache expires; nothing is stored here.
 */

import { ImageResponse } from "next/og";
import type { ReactNode } from "react";

export const runtime = "edge";

type Context = { params: Promise<{ id: string }> };

const GIST_ID = /^[0-9a-f]{20,40}$/i;
const MAX_LINES = 40;
const MAX_COLUMNS = 100;
const WIDTH = 1200;
const LINE_HEIGHT = 30;
const CACHE = "public, max-age=600, s-maxage=600, stale-while-revalidate=86400";

const C = {
  page: "#0b1120", window: "#1e1e2e", bar: "#181825", border: "rgba(255,255,255,0.08)",
  text: "#cdd6f4", lineNo: "#585b70", keyword: "#cba6f7", string: "#a6e3a1",
  number: "#fab387", comment: "#6c7086", title: "#bac2de", brand: "#10b981",
};

const KEYWORDS = new Set([
  "abstract", "as", "async", "await", "break", "case", "catch", "class", "const", "continue", "def", "default",
  "defer", "do", "elif", "else", "enum", "export", "extends", "false", "fn", "for", "from", "func", "function",
  "go", "if", "impl", "implements", "import", "in", "interface", "is", "lambda", "let", "loop", "match", "mod",
  "mut", "new", "nil", "None", "null", "package", "private", "protected", "pub", "public", "raise", "return",
  "self", "static", "struct", "super", "switch", "this", "throw", "trait", "True", "true", "False", "try", "type",
  "undefined", "use", "val", "var", "void", "where", "while", "with", "yield",
]);

/** A small, language-agnostic highlighter: comments, strings, numbers and common keywords. */
const TOKEN = /(\/\/.*$|#(?![[{!]).*$|--\s.*$)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|`(?:[^`\\]|\\.)*`?)|(\b\d[\d_.xXa-fA-F]*\b)|([A-Za-z_$][\w$]*)/g;
const BLOCK_COMMENT = /^\s*(\/\*|\*\/|\*(\s|$)|""")/;
function highlight(line: string): ReactNode[] {
  // Lines of /* ... */ and docstring blocks are drawn as comments as a whole.
  if (BLOCK_COMMENT.test(line)) return [<span key="c" style={{ color: C.comment }}>{line}</span>];
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const [text, comment, string, number, word] = match;
    const color = comment ? C.comment : string ? C.string : number ? C.number : word && KEYWORDS.has(word) ? C.keyword : null;
    if (!color) continue;
    if (match.index! > last) parts.push(line.slice(last, match.index));
    parts.push(<span key={match.index} style={{ color }}>{text}</span>);
    last = match.index! + text.length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

/** JetBrains Mono for exactly the characters drawn; the default font if Google Fonts is unreachable. */
async function monoFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=JetBrains+Mono&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const font = await fetch(url);
    return font.ok ? font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

function message(title: string, detail: string, status: number) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.page, color: C.text, fontSize: 36 }}>
        <div style={{ display: "flex", fontWeight: 700 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 24, color: C.comment, marginTop: 12 }}>{detail}</div>
      </div>
    ),
    { width: WIDTH, height: 300, status, headers: { "Cache-Control": status === 404 ? "public, max-age=300" : "no-store" } },
  );
}

export async function GET(_req: Request, { params }: Context) {
  const { id } = await params;
  if (!GIST_ID.test(id)) return message("Invalid gist ID", "Use the ID from the gist's URL.", 400);

  let gist: { files?: Record<string, { filename?: string; content?: string; truncated?: boolean }> };
  try {
    const res = await fetch(`https://api.github.com/gists/${id}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "dotsuite-codesnap",
        ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
      },
      next: { revalidate: 600 },
    });
    if (res.status === 404) return message("Gist not found", "It may have been deleted.", 404);
    if (!res.ok) return message("CodeSnap is busy", "GitHub didn't return the gist. Try again shortly.", 503);
    gist = await res.json();
  } catch {
    return message("CodeSnap is busy", "GitHub couldn't be reached. Try again shortly.", 503);
  }

  const file = Object.values(gist.files ?? {})[0];
  if (!file?.content) return message("Empty gist", "This gist has no text to draw.", 404);

  const all = file.content.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").replace(/\n+$/, "").split("\n");
  const lines = all.slice(0, MAX_LINES).map(line => (line.length > MAX_COLUMNS ? `${line.slice(0, MAX_COLUMNS - 1)}…` : line));
  const more = all.length - lines.length;
  const filename = (file.filename ?? "gist").slice(0, 80);
  const gutter = String(lines.length).length;

  const font = await monoFont([...new Set([...lines.join(""), ...filename, ..."0123456789… more lines"])].join(""));
  const height = Math.min(1600, 150 + (lines.length + (more > 0 ? 1 : 0)) * LINE_HEIGHT);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", padding: 40, background: `linear-gradient(135deg, ${C.page}, #111827)` }}>
        <div style={{ display: "flex", flexDirection: "column", width: "100%", borderRadius: 14, overflow: "hidden", background: C.window, border: `1px solid ${C.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", height: 44, padding: "0 18px", background: C.bar, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", width: 13, height: 13, borderRadius: 7, background: "#f38ba8", marginRight: 8 }} />
            <div style={{ display: "flex", width: 13, height: 13, borderRadius: 7, background: "#f9e2af", marginRight: 8 }} />
            <div style={{ display: "flex", width: 13, height: 13, borderRadius: 7, background: "#a6e3a1" }} />
            <div style={{ display: "flex", flex: 1, justifyContent: "center", color: C.title, fontSize: 18 }}>{filename}</div>
            <div style={{ display: "flex", color: C.brand, fontSize: 15 }}>CodeSnap</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "18px 0", fontSize: 20, fontFamily: font ? "JetBrains Mono" : "monospace", color: C.text }}>
            {lines.map((line, i) => (
              <div key={i} style={{ display: "flex", height: LINE_HEIGHT, alignItems: "center", whiteSpace: "pre" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", color: C.lineNo, width: 24 + gutter * 13, paddingRight: 22, flexShrink: 0 }}>{String(i + 1)}</div>
                <span style={{ display: "flex" }}>{highlight(line)}</span>
              </div>
            ))}
            {more > 0 && (
              <div style={{ display: "flex", height: LINE_HEIGHT, alignItems: "center", paddingLeft: 24 + gutter * 13 + 22, color: C.comment }}>
                {`… ${more} more lines`}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height,
      ...(font && { fonts: [{ name: "JetBrains Mono", data: font, style: "normal" as const, weight: 400 as const }] }),
      headers: { "Cache-Control": CACHE },
    },
  );
}
