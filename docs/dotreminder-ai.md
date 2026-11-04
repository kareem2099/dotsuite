# DotReminder AI gateway

`POST /api/dotreminder/ai` is used by the Android application. It does not accept a Gemini key, model URL or model name from the app.

## Hosting configuration

- `DOTREMINDER_GEMINI_API_KEY`: production-only sensitive environment variable in the existing hosting project. Never prefix it with `NEXT_PUBLIC_`, print it, or commit it.
- `DOTREMINDER_GEMINI_MODEL`: optional server-controlled model name; default `gemini-2.5-flash` preserves the existing app behavior. Review Google model lifecycle notices and change the server setting before a retirement affects it. Google currently announces routing changes for this model from December 1, 2026: https://ai.google.dev/gemini-api/docs/deprecations .
- Existing PostgreSQL configuration supplies account and network rate-limit counters.

Configure the server secret before pushing the code. Publish through the connected GitHub branch; no CLI deployment is needed. A local build does not require a real Gemini key.

## Request and verification

The Android app sends its Firebase ID token in the HTTPS `Authorization: Bearer …` header. Firebase Admin verifies tokens for project `remindme-56f27`; the route rejects anonymous accounts and refuses emulator-mode verification. Only public-key token verification is used: this code performs no user-management operations and is given no service-account key. Ordinary ID-token verification does not check revocation, so existing tokens can remain valid until expiry; account-deletion operations must allow outstanding tokens to expire before the final data purge.

The body has exactly `operation` (`chat` or `extract`), `text` (1–24,000 characters), `nowMillis` and a valid `timeZone`. The request stream is capped at 128 KiB, including when content-length is absent. The endpoint does not store conversation text, log bearer tokens, or pass Firebase credentials to Gemini. The client binds results to the initiating account and refreshes a rejected token at most once.

## Limits

Authenticated requests have atomic PostgreSQL limits of 24 per 10-minute account window, 200 per day per account, and 60 per 10-minute hashed network-address window. A chat turn that also extracts a reminder uses two requests. Limit/storage failures fail closed before model access. Provider calls have a 30-second deadline, restricted model configuration, bounded outputs and generic public errors. Responses use `Cache-Control: no-store`.

The gateway protects the provider key and limits authenticated use; it is not a device-attestation system. Firebase App Check/Play Integrity is not claimed to be enforced by this endpoint.

## Account deletion

Remove records in the existing `ratelimits` document collection whose `identifier` equals `dotreminder-ai:user:UID`, covering actions `ai-window` and `ai-day`, when fulfilling a verified DotReminder deletion request. Use a parameterized database operation. Do not remove unrelated DotSuite records or a shared network-address counter merely because one user deletes an account. The five-language policy includes account-linked AI usage counters and backend processing.

## Verification

```sh
node --test scripts/test-dotreminder-ai.cjs
npm run build
```

These tests use fake requests and model/database adapters; malformed/unsigned tokens also pass through the real token verifier. They never send an actual user's token or call Gemini. Live release review additionally checks that anonymous/invalid requests are rejected and asks the account owner to exercise a real app request without exposing their token to tools or logs.
