import { Pool } from "pg";
import { randomBytes } from "node:crypto";
import { checkServerIdentity } from "node:tls";

export type Data = Record<string, unknown>;
const state = globalThis as typeof globalThis & { dotSuitePg?: Pool };
export function getPool(): Pool {
  if (!state.dotSuitePg) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is required");
    const ca = process.env.PG_SSL_ROOT_CERT;
    const serverName = process.env.PG_SSL_SERVER_NAME;
    if (process.env.NODE_ENV === "production" && !ca) throw new Error("PG_SSL_ROOT_CERT is required in production");
    state.dotSuitePg = new Pool({ connectionString, max: 5, idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 10_000,
      ...(ca ? { ssl: { ca, rejectUnauthorized: true,
        // Railway's database certificate identifies localhost behind the TCP
        // proxy. The unique database CA and this expected name are both checked.
        ...(serverName ? { checkServerIdentity: (_host: string, cert: import("node:tls").PeerCertificate) => checkServerIdentity(serverName, cert) } : {}),
      } } : {}),
    });
    state.dotSuitePg.on("error", () => console.error("PostgreSQL pool connection failed"));
  }
  return state.dotSuitePg;
}
export async function connectDB() { await getPool().query("SELECT 1"); }
export const newId = () => randomBytes(12).toString("hex");
export const validId = (s: string) => /^[0-9a-f]{24}$/i.test(s);

/** Canonical EJSON is shared with Core. References retain their existing IDs. */
export function encode(value: unknown, references: readonly string[] = [], field = ""): unknown {
  if (value instanceof Date) return { $date: { $numberLong: String(value.getTime()) } };
  if (typeof value === "string" && (field === "_id" || references.includes(field))) {
    if (!validId(value)) throw new Error("Invalid record ID");
    return { $oid: value.toLowerCase() };
  }
  if (Array.isArray(value)) return value.map(v => encode(v, references, field));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)
    .map(([k, v]) => [k, encode(v, references, k.startsWith("$") ? field : k)]));
  return value;
}
export function decode(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(decode);
  if (value && typeof value === "object") {
    const o = value as Data;
    if (typeof o.$oid === "string") return o.$oid;
    if (o.$date) {
      const date = o.$date as Data | string;
      return new Date(typeof date === "string" ? date : Number(date.$numberLong));
    }
    if (o.$numberInt !== undefined || o.$numberLong !== undefined || o.$numberDouble !== undefined)
      return Number(o.$numberInt ?? o.$numberLong ?? o.$numberDouble);
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, decode(v)]));
  }
  return value;
}
export function databaseError(error: unknown): never {
  const code = (error as { code?: string }).code;
  if (code === "23505") throw Object.assign(new Error("Record already exists"), { code: "23505" });
  // Do not send PostgreSQL detail fields (which may contain account data) to logs.
  throw new Error(`Database operation failed${code ? ` (${code})` : ""}`);
}
