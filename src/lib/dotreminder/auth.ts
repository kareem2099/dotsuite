import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { AiHttpError } from "./request";

const PROJECT_ID = "remindme-56f27";
const APP_NAME = "dotreminder-id-token-verifier";

/** Only verifies public-key signatures. No service-account key or user-management operation is used. */
export async function verifyDotReminderUser(authorization: string | null): Promise<string> {
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) throw new AiHttpError(503, "verification_unavailable");
  const match = authorization?.match(/^Bearer ([A-Za-z0-9_.-]+)$/);
  if (!match || match[1].length > 8192) throw new AiHttpError(401, "sign_in_required");
  const app = getApps().find(candidate => candidate.name === APP_NAME)
    ?? initializeApp({ projectId: PROJECT_ID }, APP_NAME);
  try {
    // Explicit project ID validates audience and issuer; the SDK validates RS256, kid, subject and token times.
    // Existing ID tokens can remain valid until their normal expiry after account revocation/deletion.
    const token = await getAuth(app).verifyIdToken(match[1]);
    if (!token.uid || token.firebase?.sign_in_provider === "anonymous") throw new AiHttpError(403, "account_required");
    return token.uid;
  } catch (error) {
    if (error instanceof AiHttpError) throw error;
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "auth/internal-error" || code === "app/network-error") throw new AiHttpError(503, "verification_unavailable");
    throw new AiHttpError(401, "sign_in_required");
  }
}
