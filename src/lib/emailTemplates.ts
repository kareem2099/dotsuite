// lib/emailTemplates.ts
//
// Every email the app sends is rendered here. User-facing text lives in the "Emails"
// namespace of messages/<locale>.json; only the support-inbox notification stays English.
// Call renderEmail() (or sendTemplateEmail() in lib/email.ts) instead of building HTML in routes.

import { createTranslator } from "next-intl";
import { routing } from "@/i18n/routing";

export type EmailLocale = (typeof routing.locales)[number];

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/** What each email needs from its caller. Links to the site are built here. */
export interface EmailData {
  verify: { name: string; verifyUrl: string; expiresHours: number };
  welcome: { name: string };
  passwordReset: { resetUrl: string; expiresMinutes: number };
  passwordChanged: Record<string, never>;
  accountExists: Record<string, never>;
  socialAccountReset: Record<string, never>;
  accountLocked: { lockoutMinutes: number };
  contactNotification: { name: string; email: string; subject: string; message: string };
}

export type EmailKind = keyof EmailData;

const RTL_LOCALES: ReadonlySet<EmailLocale> = new Set(["ar"]);

/** First supported locale among the candidates (stored user locale, request locale, ...). */
export const resolveEmailLocale = (...candidates: (string | null | undefined)[]): EmailLocale => {
  for (const candidate of candidates) {
    if (candidate && (routing.locales as readonly string[]).includes(candidate)) {
      return candidate as EmailLocale;
    }
  }
  return routing.defaultLocale;
};

// ─── Escaping ─────────────────────────────────────────────────────

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape a value before it goes into email HTML (text or attribute). */
export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

/** Header values (subjects) must stay on one line. */
const singleLine = (value: string): string => value.replace(/[\r\n]+/g, " ").trim();

// ─── Translation ──────────────────────────────────────────────────

type Values = Record<string, string | number>;
type Translate = (key: string, values?: Values) => string;

interface Ctx {
  locale: EmailLocale;
  /** Plain text, for subjects and the text/plain part */
  t: Translate;
  /** HTML-escaped text: the translation and every interpolated value are escaped */
  h: Translate;
  /** Site URL with the locale prefix, e.g. https://dotsuite.dev/ar */
  site: string;
}

async function createContext(locale: EmailLocale): Promise<Ctx> {
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const translator = createTranslator({ locale, messages, namespace: "Emails" }) as unknown as Translate;
  const t: Translate = (key, values) => translator(key, values);
  return {
    locale,
    t,
    h: (key, values) => escapeHtml(t(key, values)),
    site: `${process.env.NEXTAUTH_URL}/${locale}`,
  };
}

// ─── HTML building blocks ─────────────────────────────────────────
// Inline styles and table layout only: Outlook and the Gmail app drop <style> blocks,
// flexbox and most CSS in <head>. Arguments are HTML: pass ctx.h(...) or escapeHtml(...)
// output, never raw input.

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const COLORS = {
  page: "#f4f4f5",
  card: "#ffffff",
  ink: "#0a0a0a",
  text: "#52525b",
  muted: "#71717a",
  faint: "#a1a1aa",
  line: "#e4e4e7",
  brand: "#10b981",
  footer: "#fafafa",
};

const isRtl = (ctx: Ctx) => RTL_LOCALES.has(ctx.locale);
const startAlign = (ctx: Ctx) => (isRtl(ctx) ? "right" : "left");

/** Layout table with the attributes every client needs */
const table = (inner: string, attrs = "", style = "") =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0"${attrs ? ` ${attrs}` : ""}${style ? ` style="${style}"` : ""}>${inner}</table>`;

const greeting = (html: string) =>
  `<p style="margin:0 0 16px; font-family:${FONT}; font-size:24px; line-height:1.3; font-weight:700; color:${COLORS.ink};">${html}</p>`;

const paragraph = (html: string, style = "") =>
  `<p style="margin:0 0 24px; font-family:${FONT}; font-size:15px; line-height:1.7; color:${COLORS.text};${style ? ` ${style}` : ""}">${html}</p>`;

const button = (ctx: Ctx, url: string, label: string) =>
  table(
    `<tr><td align="center" bgcolor="${COLORS.brand}" style="border-radius:10px;">
          <a href="${escapeHtml(url)}" target="_blank" style="display:inline-block; padding:14px 32px; font-family:${FONT}; font-size:15px; font-weight:600; line-height:1.2; color:#ffffff; text-decoration:none; border-radius:10px;">${label} ${isRtl(ctx) ? "←" : "→"}</a>
        </td></tr>`,
    'align="center"',
    "margin:8px auto 32px;"
  );

const notice = (html: string, tone: "warning" | "success") => {
  const c = tone === "warning"
    ? { bg: "#fef3c7", border: "#fde68a", text: "#92400e" }
    : { bg: "#f0fdf4", border: "#bbf7d0", text: "#065f46" };
  return table(
    `<tr><td style="padding:16px 20px; background-color:${c.bg}; border:1px solid ${c.border}; border-radius:10px; font-family:${FONT}; font-size:13px; line-height:1.6; color:${c.text};">${html}</td></tr>`,
    'width="100%"',
    "margin:0 0 24px;"
  );
};
const warning = (html: string) => notice(`⚠️ ${html}`, "warning");

const successBanner = (html: string) =>
  table(
    `<tr><td align="center" style="padding:20px 24px; background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; font-family:${FONT};">
          <div style="font-size:36px; line-height:1; margin-bottom:8px;">✅</div>
          <div style="font-size:18px; font-weight:700; color:#065f46;">${html}</div>
        </td></tr>`,
    'width="100%"',
    "margin:0 0 24px;"
  );

const divider = table(
  `<tr><td style="height:1px; line-height:1px; font-size:1px; background-color:${COLORS.line};">&nbsp;</td></tr>`,
  'width="100%"',
  "margin:32px 0;"
);

const sectionTitle = (html: string) =>
  `<p style="margin:0 0 16px; font-family:${FONT}; font-size:13px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:${COLORS.muted};">${html}</p>`;

const featureList = (items: { icon: string; html: string }[]) =>
  table(
    items
      .map(
        (f) => `<tr>
          <td width="32" valign="top" style="padding:0 0 14px;">
            ${table(`<tr><td align="center" width="32" height="32" style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; font-size:16px; line-height:32px;">${f.icon}</td></tr>`)}
          </td>
          <td valign="top" style="padding:6px 12px 14px; font-family:${FONT}; font-size:14px; line-height:1.5; color:#3f3f46;">${f.html}</td>
        </tr>`
      )
      .join(""),
    'width="100%"'
  );

const link = (url: string, label: string) =>
  `<a href="${escapeHtml(url)}" target="_blank" style="color:${COLORS.brand}; text-decoration:underline;">${label}</a>`;

const copyableLink = (ctx: Ctx, url: string) =>
  paragraph(
    `${ctx.h("copyLink")}<br/><a href="${escapeHtml(url)}" target="_blank" dir="ltr" style="color:${COLORS.brand}; word-break:break-all;">${escapeHtml(url)}</a>`,
    `text-align:center; font-size:13px; color:${COLORS.muted};`
  );

const signature = (ctx: Ctx) =>
  paragraph(ctx.h("regards"), "margin-bottom:4px;") +
  paragraph(ctx.h("team"), `font-weight:600; color:${COLORS.ink};`);

const textSignature = (ctx: Ctx) => `${ctx.t("regards")}\n${ctx.t("team")}`;

const emailWrapper = (ctx: Ctx, content: string, preheader: string) => {
  const dir = isRtl(ctx) ? "rtl" : "ltr";
  const footerLink = (url: string, label: string) =>
    `<a href="${escapeHtml(url)}" target="_blank" style="margin:0 8px; font-size:12px; color:${COLORS.brand}; text-decoration:none;">${label}</a>`;
  return `<!DOCTYPE html>
<html lang="${ctx.locale}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>dotsuite</title>
</head>
<body style="margin:0; padding:0; background-color:${COLORS.page};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${preheader}</div>
  ${table(
    `<tr><td align="center" style="padding:40px 16px;">
      ${table(
        `<tr><td align="center" style="padding:32px 40px; background-color:${COLORS.ink};">
            <div style="font-family:${FONT}; font-size:28px; font-weight:800; letter-spacing:-0.5px; color:${COLORS.brand};">dotsuite</div>
            <div style="display:inline-block; margin-top:12px; padding:4px 12px; border:1px solid #1f5f4a; border-radius:999px; font-family:${FONT}; font-size:12px; color:${COLORS.brand};">${ctx.h("brandTagline")}</div>
          </td></tr>
          <tr><td dir="${dir}" align="${startAlign(ctx)}" style="padding:40px; text-align:${startAlign(ctx)};">
            ${content}
          </td></tr>
          <tr><td align="center" style="padding:28px 40px; background-color:${COLORS.footer}; border-top:1px solid ${COLORS.line}; font-family:${FONT};">
            <div style="margin-bottom:8px; font-size:18px; font-weight:800; color:${COLORS.brand};">dotsuite</div>
            <p style="margin:0; font-size:12px; line-height:1.6; color:${COLORS.faint};">
              ${ctx.h("footerText")}<br />
              ${ctx.h("footerRights", { year: new Date().getFullYear() })}
            </p>
            <div style="margin-top:12px;">
              ${footerLink(ctx.site, ctx.h("footerWebsite"))}
              ${footerLink(`${ctx.site}/product`, ctx.h("footerProducts"))}
              ${footerLink(`${ctx.site}/contact`, ctx.h("footerSupport"))}
            </div>
          </td></tr>`,
        'width="600"',
        `width:100%; max-width:600px; background-color:${COLORS.card}; border-radius:16px; overflow:hidden;`
      )}
    </td></tr>`,
    `width="100%" dir="${dir}"`,
    `background-color:${COLORS.page};`
  )}
</body>
</html>
`;
};

// ─── Templates ────────────────────────────────────────────────────

interface Rendered {
  subject: string;
  /** Inbox preview line shown after the subject (escaped HTML) */
  preheader: string;
  body: string;
  text: string;
}

type Template<K extends EmailKind> = (ctx: Ctx, data: EmailData[K]) => Rendered;

const templates: { [K in EmailKind]: Template<K> } = {
  verify: (ctx, { name, verifyUrl, expiresHours }) => {
    const duration = ctx.t("hours", { count: expiresHours });
    return {
      subject: ctx.t("verifySubject"),
      preheader: ctx.h("verifyBody"),
      body: [
        greeting(ctx.h("verifyHeading")),
        paragraph(ctx.h("verifyGreeting", { name })),
        paragraph(`${ctx.h("verifyBody")} <strong>${ctx.h("expiresIn", { duration })}</strong>`),
        button(ctx, verifyUrl, ctx.h("verifyButton")),
        copyableLink(ctx, verifyUrl),
        warning(ctx.h("verifyIgnore")),
        signature(ctx),
      ].join("\n"),
      text: [
        ctx.t("verifyGreeting", { name }),
        `${ctx.t("verifyBody")}\n${verifyUrl}`,
        ctx.t("expiresIn", { duration }),
        ctx.t("verifyIgnore"),
        textSignature(ctx),
      ].join("\n\n"),
    };
  },

  welcome: (ctx, { name }) => {
    const features = [
      { icon: "⚡", key: "welcomeFeature1" },
      { icon: "▲", key: "welcomeFeature2" },
      { icon: "🐍", key: "welcomeFeature3" },
      { icon: "🤝", key: "welcomeFeature4" },
    ];
    const loginUrl = `${ctx.site}/login`;
    return {
      subject: ctx.t("welcomeSubject"),
      preheader: ctx.h("welcomeThankYou"),
      body: [
        greeting(ctx.h("welcomeGreeting", { name })),
        paragraph(ctx.h("welcomeThankYou")),
        paragraph(ctx.h("welcomeIntro")),
        divider,
        sectionTitle(ctx.h("welcomeFeaturesTitle")),
        featureList(features.map((f) => ({ icon: f.icon, html: ctx.h(f.key) }))),
        divider,
        paragraph(ctx.h("welcomeGetStarted")),
        button(ctx, loginUrl, ctx.h("welcomeButton")),
        paragraph(ctx.h("welcomeSupport"), "font-size:13px; color:#71717a;"),
        signature(ctx),
      ].join("\n"),
      text: [
        ctx.t("welcomeGreeting", { name }),
        ctx.t("welcomeThankYou"),
        ctx.t("welcomeIntro"),
        `${ctx.t("welcomeFeaturesTitle")}\n${features.map((f) => `• ${ctx.t(f.key)}`).join("\n")}`,
        `${ctx.t("welcomeGetStarted")}\n${loginUrl}`,
        ctx.t("welcomeSupport"),
        textSignature(ctx),
      ].join("\n\n"),
    };
  },

  passwordReset: (ctx, { resetUrl, expiresMinutes }) => {
    const duration = ctx.t("minutes", { count: expiresMinutes });
    return {
      subject: ctx.t("resetSubject"),
      preheader: ctx.h("resetIntro"),
      body: [
        greeting(ctx.h("resetHeading")),
        paragraph(ctx.h("resetIntro")),
        paragraph(`${ctx.h("resetBody")} <strong>${ctx.h("expiresIn", { duration })}</strong>`),
        button(ctx, resetUrl, ctx.h("resetButton")),
        copyableLink(ctx, resetUrl),
        warning(ctx.h("resetIgnore")),
        signature(ctx),
      ].join("\n"),
      text: [
        ctx.t("resetIntro"),
        `${ctx.t("resetBody")}\n${resetUrl}`,
        ctx.t("expiresIn", { duration }),
        ctx.t("resetIgnore"),
        textSignature(ctx),
      ].join("\n\n"),
    };
  },

  passwordChanged: (ctx) => {
    const loginUrl = `${ctx.site}/login`;
    const forgotUrl = `${ctx.site}/forgot-password`;
    return {
      subject: ctx.t("passwordChangedSubject"),
      preheader: ctx.h("passwordChangedBody"),
      body: [
        successBanner(ctx.h("passwordChangedHeading")),
        paragraph(ctx.h("passwordChangedBody")),
        button(ctx, loginUrl, ctx.h("signInButton")),
        warning(ctx.h("passwordChangedWarning")),
        signature(ctx),
      ].join("\n"),
      text: [
        ctx.t("passwordChangedHeading"),
        ctx.t("passwordChangedBody"),
        `${ctx.t("signInButton")}: ${loginUrl}`,
        `${ctx.t("passwordChangedWarning")}\n${forgotUrl}`,
        textSignature(ctx),
      ].join("\n\n"),
    };
  },

  accountExists: (ctx) => {
    const loginUrl = `${ctx.site}/login`;
    const forgotUrl = `${ctx.site}/forgot-password`;
    return {
      subject: ctx.t("accountExistsSubject"),
      preheader: ctx.h("accountExistsBody"),
      body: [
        greeting(ctx.h("accountExistsHeading")),
        paragraph(ctx.h("accountExistsBody")),
        button(ctx, loginUrl, ctx.h("signInButton")),
        paragraph(
          `${ctx.h("accountExistsForgot")} ${link(forgotUrl, ctx.h("resetButton"))}`,
          `text-align:center; font-size:13px; color:${COLORS.muted};`
        ),
        warning(ctx.h("ignoreUnchanged")),
        signature(ctx),
      ].join("\n"),
      text: [
        ctx.t("accountExistsBody"),
        `${ctx.t("signInButton")}: ${loginUrl}`,
        `${ctx.t("accountExistsForgot")}\n${forgotUrl}`,
        ctx.t("ignoreUnchanged"),
        textSignature(ctx),
      ].join("\n\n"),
    };
  },

  socialAccountReset: (ctx) => {
    const loginUrl = `${ctx.site}/login`;
    return {
      subject: ctx.t("socialResetSubject"),
      preheader: ctx.h("socialResetBody"),
      body: [
        greeting(ctx.h("socialResetHeading")),
        paragraph(ctx.h("socialResetBody")),
        button(ctx, loginUrl, ctx.h("signInButton")),
        warning(ctx.h("ignoreUnchanged")),
        signature(ctx),
      ].join("\n"),
      text: [
        ctx.t("socialResetBody"),
        `${ctx.t("signInButton")}: ${loginUrl}`,
        ctx.t("ignoreUnchanged"),
        textSignature(ctx),
      ].join("\n\n"),
    };
  },

  accountLocked: (ctx, { lockoutMinutes }) => {
    const duration = ctx.t("minutes", { count: lockoutMinutes });
    const forgotUrl = `${ctx.site}/forgot-password`;
    return {
      subject: ctx.t("lockedSubject"),
      preheader: ctx.h("lockedHeading"),
      body: [
        greeting(ctx.h("lockedHeading")),
        paragraph(ctx.h("lockedBody", { duration })),
        warning(ctx.h("lockedWarning")),
        button(ctx, forgotUrl, ctx.h("resetButton")),
        signature(ctx),
      ].join("\n"),
      text: [
        ctx.t("lockedBody", { duration }),
        `${ctx.t("lockedWarning")}\n${forgotUrl}`,
        textSignature(ctx),
      ].join("\n\n"),
    };
  },

  // Internal: goes to the support inbox, so it stays English
  contactNotification: (ctx, { name, email, subject, message }) => {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${singleLine(subject)}`)}`;
    const row = (label: string, value: string, style = "color:#0a0a0a;") =>
      `<tr>
          <td width="80" style="padding:8px 0; font-family:${FONT}; font-size:13px; color:${COLORS.muted};">${label}</td>
          <td style="padding:8px 0; font-family:${FONT}; font-size:15px; ${style}">${value}</td>
        </tr>`;
    return {
      subject: `📬 New Contact: ${singleLine(subject)}`,
      preheader: escapeHtml(`From ${name} <${email}>`),
      body: [
        greeting("New Contact Message 📬"),
        paragraph("You received a new message from the dotsuite contact form."),
        divider,
        table(
          row("Name", safeName, "color:#0a0a0a; font-weight:600;") +
            row("Email", `<a href="mailto:${safeEmail}" style="color:${COLORS.brand};">${safeEmail}</a>`, "") +
            row("Subject", escapeHtml(subject)),
          'width="100%"'
        ),
        divider,
        sectionTitle("Message"),
        table(
          `<tr><td style="padding:20px; background-color:${COLORS.page}; border:1px solid ${COLORS.line}; border-radius:10px;">${paragraph(escapeHtml(message), "margin:0; white-space:pre-wrap;")}</td></tr>`,
          'width="100%"',
          "margin:0 0 32px;"
        ),
        button(ctx, replyHref, `Reply to ${safeName}`),
      ].join("\n"),
      text: `New Contact Form Message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    };
  },
};

/** Render one email in the given locale (falls back to the default locale). */
export async function renderEmail<K extends EmailKind>(
  kind: K,
  locale: string | null | undefined,
  data: EmailData[K]
): Promise<RenderedEmail> {
  const ctx = await createContext(kind === "contactNotification" ? routing.defaultLocale : resolveEmailLocale(locale));
  const { subject, preheader, body, text } = templates[kind](ctx, data);
  return { subject: singleLine(subject), html: emailWrapper(ctx, body, preheader), text: text.trim() + "\n" };
}
