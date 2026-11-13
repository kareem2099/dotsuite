import nodemailer, { type Transporter } from "nodemailer";
import { renderEmail, resolveEmailLocale, type EmailData, type EmailKind } from "@/lib/emailTemplates";
import EmailLog from "@/models/EmailLog";
import { SUPPORT_EMAIL } from "@/lib/support";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface DeliveryResult {
  ok: boolean;
  transport: EmailLog["transport"];
  messageId?: string;
  error?: string;
}

// One SMTP transporter per server instance instead of one per email
let transporter: Transporter | undefined;

const getTransporter = (): Transporter | null => {
  if (!process.env.EMAIL_HOST) return null;
  transporter ??= nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter;
};

/** SMTP errors often quote the recipient; keep addresses out of the log */
const redactAddresses = (message: string) =>
  message.replace(/[^\s<>"'@]+@[^\s<>"'@]+/g, "[address]").slice(0, 500);

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 10_000;

/** Resend HTTP API: used whenever RESEND_API_KEY is set (a Sending-access key is enough) */
async function deliverViaResend(apiKey: string, { to, subject, html, text, replyTo }: SendEmailOptions): Promise<DeliveryResult> {
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [to],
        subject,
        html,
        text: text || undefined,
        reply_to: replyTo,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    const body = (await response.json().catch(() => ({}))) as { id?: string; name?: string; message?: string };

    if (!response.ok) {
      const error = `Resend ${response.status} ${body.name ?? ""}: ${body.message ?? "request failed"}`.trim();
      console.error("Email error:", error);
      return { ok: false, transport: "resend", error: redactAddresses(error) };
    }
    return { ok: true, transport: "resend", messageId: body.id };
  } catch (error) {
    console.error("Email error:", error);
    return { ok: false, transport: "resend", error: redactAddresses(String((error as Error)?.message ?? error)) };
  }
}

async function deliver(options: SendEmailOptions): Promise<DeliveryResult> {
  const { to, subject, html, text, replyTo } = options;

  if (process.env.RESEND_API_KEY) return deliverViaResend(process.env.RESEND_API_KEY, options);

  const smtp = getTransporter();

  if (!smtp) {
    // Local development without SMTP: print the email instead of failing
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email:dev] To: ${to}\nSubject: ${subject}${replyTo ? `\nReply-To: ${replyTo}` : ""}\n\n${text ?? ""}`);
      return { ok: true, transport: "console" };
    }
    console.error("Email error: EMAIL_HOST is not configured");
    return { ok: false, transport: "none", error: "EMAIL_HOST is not configured" };
  }

  try {
    const info = await smtp.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || "",
      replyTo,
    });
    return { ok: true, transport: "smtp", messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { ok: false, transport: "smtp", error: redactAddresses(String((error as Error)?.message ?? error)) };
  }
}

/** Low-level send without a log row. Prefer sendTemplateEmail(). */
export const sendEmail = async (options: SendEmailOptions): Promise<boolean> => (await deliver(options)).ok;

interface EmailLogEntry {
  to: string;
  kind: string;
  locale: string;
  status: EmailLog["status"];
  transport: EmailLog["transport"];
  messageId?: string;
  error?: string;
  durationMs: number;
}

async function logEmail(row: EmailLogEntry) {
  try {
    const { to, ...rest } = row;
    await EmailLog.create({
      ...rest,
      recipientHash: EmailLog.hashRecipient(to),
      recipientDomain: to.split("@").pop()?.toLowerCase() ?? "",
    });
  } catch (error) {
    console.error("Failed to write email log:", error);
  }
}

interface SendTemplateEmailOptions<K extends EmailKind> {
  to: string;
  kind: K;
  /** Recipient's language; unsupported or missing values fall back to the default locale */
  locale?: string | null;
  data: EmailData[K];
  /** Defaults to the support inbox, so replies to automated emails reach a person */
  replyTo?: string;
}

/** Render a translated template, send it and log the outcome. Never throws; returns whether it was sent. */
export async function sendTemplateEmail<K extends EmailKind>({
  to,
  kind,
  locale,
  data,
  replyTo,
}: SendTemplateEmailOptions<K>): Promise<boolean> {
  const started = Date.now();
  const resolvedLocale = resolveEmailLocale(locale);
  let result: DeliveryResult;

  try {
    const { subject, html, text } = await renderEmail(kind, resolvedLocale, data);
    result = await deliver({ to, subject, html, text, replyTo: replyTo ?? SUPPORT_EMAIL });
  } catch (error) {
    console.error(`Email error (${kind}):`, error);
    result = { ok: false, transport: "none", error: redactAddresses(`Render failed: ${String((error as Error)?.message ?? error)}`) };
  }

  await logEmail({
    to,
    kind,
    locale: resolvedLocale,
    status: result.ok ? "SENT" : "FAILED",
    transport: result.transport,
    messageId: result.messageId,
    error: result.error,
    durationMs: Date.now() - started,
  });

  return result.ok;
}
