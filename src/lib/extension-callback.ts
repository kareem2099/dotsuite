/** Keys may only be returned to our installed extension, never an HTTP callback. */
export function extensionCallback(raw: string): URL {
  const url = new URL(raw);
  if (!["vscode:", "vscode-insiders:", "vscodium:", "cursor:"].includes(url.protocol)
    || url.hostname !== "freerave.dotshare" || !["/auth", "/login"].includes(url.pathname)
    || url.username || url.password || url.port || url.hash) {
    throw new Error("Invalid extension callback destination");
  }
  return url;
}
