/**
 * Editors DotShare can be installed in, by their `vscode.env.uriScheme`. Tokens and
 * keys are only ever returned to `<scheme>://freerave.dotshare/...` for one of these.
 */
export const EDITOR_SCHEMES = [
  "vscode", "vscode-insiders", "vscodium", "code-oss", "cursor", "windsurf", "kiro", "trae", "positron",
] as const;
export type EditorScheme = (typeof EDITOR_SCHEMES)[number];

/** Unknown or attacker-supplied values fall back to VS Code. */
export function editorScheme(value: string | null | undefined): EditorScheme {
  return EDITOR_SCHEMES.find(scheme => scheme === value) ?? "vscode";
}

/** Keys may only be returned to our installed extension, never an HTTP callback. */
export function extensionCallback(raw: string): URL {
  const url = new URL(raw);
  if (!EDITOR_SCHEMES.some(scheme => url.protocol === `${scheme}:`)
    || url.hostname !== "freerave.dotshare" || !["/auth", "/login"].includes(url.pathname)
    || url.username || url.password || url.port || url.hash) {
    throw new Error("Invalid extension callback destination");
  }
  return url;
}
