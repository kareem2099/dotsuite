import { AiHttpError, aiPrompt, validateAiReply, type AiRequest } from "./request";

export type GenerateOptions = { key: string; model: string; signal: AbortSignal; fetcher?: typeof fetch };

export async function generateReminderReply(input: AiRequest, options: GenerateOptions): Promise<string> {
  if (!options.key) throw new AiHttpError(503, "ai_unavailable");
  if (!/^gemini-[a-z0-9.-]+$/.test(options.model)) throw new AiHttpError(503, "ai_unavailable");
  let response: Response;
  try {
    response = await (options.fetcher ?? fetch)(
      `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent`,
      {
        method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": options.key },
        cache: "no-store", signal: options.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: aiPrompt(input) }] },
          contents: [{ role: "user", parts: [{ text: input.text }] }],
          generationConfig: {
            maxOutputTokens: 2048,
            ...(options.model.startsWith("gemini-2.5-") ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
            ...(input.operation === "extract" ? { responseMimeType: "application/json", temperature: 0 } : {}),
          },
        }),
      }
    );
  } catch {
    if (options.signal.aborted) throw new AiHttpError(504, "ai_timeout");
    throw new AiHttpError(502, "ai_unavailable");
  }
  if (!response.ok) {
    await response.body?.cancel();
    if (response.status === 429) throw new AiHttpError(429, "ai_limit_reached", 60);
    throw new AiHttpError(502, "ai_unavailable");
  }
  try {
    const result = await response.json();
    const parts = result?.candidates?.[0]?.content?.parts;
    const reply = Array.isArray(parts) ? parts.filter(part => !part.thought && typeof part.text === "string").map(part => part.text).join("") : "";
    return validateAiReply(reply, input.operation);
  } catch (error) {
    if (error instanceof AiHttpError) throw error;
    throw new AiHttpError(502, "invalid_ai_response");
  }
}
