import { forwardKeyRequest } from "@/lib/key-api";

/** The computers DotScramble Max is activated on for this account. */
export async function GET(request: Request) {
  return forwardKeyRequest(request, "/internal/dotscramble/devices", "GET");
}
