import type { PrivacyLanguage } from "./privacy-language";
import { de, fr, ru } from "./dotshare-privacy-translations";

/**
 * DotShare privacy policy. Every statement here describes current code in the
 * DotShare extension and CLI, /api/connect on this site, and dotsuite-core.
 * Update it, and `updated`, whenever any of those data flows change.
 * Text inside `backticks` is shown as code.
 */

export type DotShareBlock =
  | { p: string }
  | { list: string[] }
  | { table: { head: string[]; rows: string[][] } };

export interface DotShareSection { id: string; title: string; blocks: DotShareBlock[] }

export interface DotSharePrivacyCopy {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  intro: string[];
  glanceTitle: string;
  glance: { head: string[]; rows: string[][] };
  promisesTitle: string;
  promises: string[];
  tocTitle: string;
  sections: DotShareSection[];
  related: { title: string; general: string; terms: string; github: string };
}

const en: DotSharePrivacyCopy = {
  eyebrow: "DotSuite · DotShare",
  title: "DotShare Privacy Policy",
  description: "What the DotShare VS Code extension, the dotshare-cli MCP server and DotShare sign-in on dotsuite.dev store, where it goes, and how to remove it.",
  updated: "Last updated: November 12, 2026 (DotShare 3.7.0, dotshare-cli 3.1.0)",
  intro: [
    "DotShare is an open-source developer tool from DotSuite. It turns your commits, release notes and code into posts and publishes them to the social accounts you connect. This policy covers the DotShare VS Code extension, the `dotshare-cli` package (its CLI and local MCP server for AI agents), DotShare sign-in on dotsuite.dev, and DotSuite cloud scheduling when you use it with DotShare.",
    "DotShare is local-first. Your credentials, drafts and history stay on your device, and posts go from your device straight to each platform, unless you choose to schedule them in DotSuite's cloud. Your DotSuite account, billing and the dotsuite.dev website itself are covered by the general DotSuite privacy policy.",
  ],
  glanceTitle: "At a glance",
  glance: {
    head: ["Data", "Where it is kept", "Who receives it"],
    rows: [
      ["Platform credentials (tokens, app passwords, bot tokens, webhooks, API keys)", "On your device: VS Code SecretStorage (extension) or your OS keyring (CLI)", "Only the platform it belongs to, when you publish or check it. DotSuite gets a copy only if you schedule in the cloud and agree first."],
      ["AI provider API keys", "VS Code SecretStorage on your device", "Only the AI provider you choose"],
      ["Drafts, post history and receipts", "On your device. CLI and MCP records are encrypted (AES-256-GCM).", "No one, until you publish"],
      ["Repository context for AI drafts", "Not stored by DotShare", "The AI provider you choose, with your own key, when you ask for a draft"],
      ["Sign-in tokens from LinkedIn and X", "Passed to your editor or CLI. dotsuite.dev keeps them only when you connect an account for cloud scheduling.", "Your editor or CLI, and DotSuite for cloud scheduling"],
      ["Scheduled posts and their images", "DotSuite servers (only if you schedule in the cloud)", "DotSuite's scheduler, which publishes them to the platforms you chose"],
    ],
  },
  promisesTitle: "What we never do",
  promises: [
    "Sell, rent or share your data for advertising. DotShare shows no ads and contains no ad trackers.",
    "Collect telemetry or analytics from the extension, the CLI or the MCP server. DotShare's own code sends none.",
    "Send anything from your repository anywhere, except what you choose to include in an AI draft (to your AI provider) or a Gist (to GitHub).",
    "Post on its own. Every post goes out because you, or an AI agent following your instructions, asked DotShare to publish or schedule it. The skill and tool guidance that ships with DotShare tell agents to show you a preview and wait for your approval.",
    "Use content or data from LinkedIn, X or any other platform to profile you, or for any purpose other than publishing your posts and showing their results.",
    "Train AI models on your content. When you use an AI provider, its own terms decide what happens to what you send.",
  ],
  tocTitle: "Contents",
  sections: [
    {
      id: "on-your-device",
      title: "1. What stays on your device",
      blocks: [
        { p: "**VS Code extension.** Credentials are kept in VS Code SecretStorage, which uses your operating system's credential store. That covers LinkedIn and X tokens (including the X refresh token and expiry), the Telegram bot token and chat ID, the Discord webhook URL, the Bluesky handle and app password, the Mastodon instance and access token, the Dev.to API key, your AI provider API keys and your DotSuite key. VS Code's extension storage on your device holds your settings and history: recent posts, the last post, drafts for GitHub Gists, your chosen AI model and language, your call-to-action links, and your consent choices." },
        { p: "**CLI and MCP server (`dotshare-cli`).** Everything lives in `~/.dotshare`, or the folder set in `DOTSHARE_HOME`, with private file permissions. `accounts.json` lists only each account's ID, name and platform. Credentials are kept in your OS keyring. Drafts, custom templates and the publishing journal are encrypted with AES-256-GCM, using a master key kept in your OS keyring. The journal stores request fingerprints, status and receipts (post IDs and links), not credentials or full post text. The MCP server reads images only from the folders you allow during setup (`DOTSHARE_MEDIA_ROOTS`)." },
        { p: "Neither the extension nor the CLI keeps a plaintext copy of your credentials. Error messages are scrubbed of known secrets before they are shown or logged." },
      ],
    },
    {
      id: "platforms",
      title: "2. Publishing to social platforms",
      blocks: [
        { p: "When you publish, preview or check an account, DotShare sends the post text, images or videos, and the matching credential directly from your device to that platform's API. DotSuite servers are not in that path. Each platform's own privacy policy then applies to what you post." },
        { table: {
          head: ["Platform", "Sent from your device to"],
          rows: [
            ["LinkedIn", "`api.linkedin.com` (posts, media uploads, first comments, your basic profile to post as you)"],
            ["X", "`api.x.com` (posts, media uploads, your username for account checks)"],
            ["Bluesky", "`bsky.social` (sign-in with your app password, posts, images, handle lookups for @mentions)"],
            ["Mastodon", "Your own instance (posts, media, the instance's character and media limits)"],
            ["Telegram", "`api.telegram.org` with your bot token"],
            ["Discord", "Your webhook URL on `discord.com`"],
            ["Dev.to", "`dev.to` with your API key"],
          ],
        } },
        { p: "**Post statistics.** If you, or an agent you use, ask for a post's statistics, DotShare reads public engagement counts (likes, reposts, replies, quotes, impressions or views) for posts it published, from the same platforms. For Bluesky it uses Bluesky's public API without signing in. Nothing is stored except what is shown to you." },
      ],
    },
    {
      id: "ai",
      title: "3. AI drafting (optional)",
      blocks: [
        { p: "When you ask DotShare to write a draft, it sends a prompt directly from your device to the AI provider you selected (Google Gemini, OpenAI, Anthropic Claude, DeepSeek or xAI Grok), using your own API key. Depending on what you choose, the prompt can include commit messages, changelog and README excerpts, project metadata, parts of code changes from the repository you picked, and your own instructions. It does not pass through DotSuite. That provider's terms decide how your prompt is processed and retained, so leave out anything you don't want shared with it." },
        { p: "AI agents connected to the MCP server (such as Codex, Claude Code or Cursor) are separate products. What you tell them, and what they read through DotShare's tools, is governed by their providers' policies. DotShare never gives an agent your credentials. Agents work with account IDs and names instead." },
      ],
    },
    {
      id: "github",
      title: "4. GitHub Gists and CodeSnap",
      blocks: [
        { p: "Creating a Gist uses your GitHub sign-in in VS Code (the `gist` permission) and sends the selected code to GitHub as a public or secret gist, as you choose. A secret gist is still viewable by anyone who has its link. CodeSnap screenshots are drawn inside VS Code and saved on your device. They leave it only if you attach one to a post. If you embed a live CodeSnap image of a gist (a `dotsuite.dev/api/codesnap/gist/…` link), dotsuite.dev reads that gist from GitHub's public API whenever the image is requested, at most once every 10 minutes, and draws it. Nothing is stored except the cached image." },
      ],
    },
    {
      id: "sign-in",
      title: "5. Signing in to LinkedIn and X through dotsuite.dev",
      blocks: [
        { p: "LinkedIn and X sign-in needs a server that holds DotShare's app credentials. DotShare uses `dotsuite.dev/api/connect` for this. DotShare 3.6 and earlier use `dotshare-auth-server.vercel.app`, which also passes tokens straight to your editor without storing them. During a sign-in on dotsuite.dev:" },
        { list: [
          "Your browser stores a signed, HttpOnly cookie for up to 10 minutes. It holds the sign-in's random security values (state and PKCE verifier), the platform, which editor or CLI to return to and, for dashboard sign-ins, your DotSuite user ID. It is deleted when the sign-in finishes, whether or not it succeeds.",
          "LinkedIn or X sends a one-time code back to dotsuite.dev, and the server exchanges it for tokens. DotShare's app secret never reaches your browser.",
          "**Editor sign-in:** the tokens are put in the result page, which opens your editor (`vscode://`, `cursor://` and other known editors only), and the extension stores them in SecretStorage. The server doesn't keep them.",
          "**CLI sign-in** (`dotshare-agent accounts connect`): the tokens are encrypted to a one-time key that exists only in the waiting CLI process and are sent to it on `127.0.0.1`. They never appear readable in a URL, and the server doesn't keep them.",
          "**Dashboard sign-in** (Connect in your DotSuite dashboard): the tokens are stored for cloud scheduling as described in section 6, but only if the same signed-in DotSuite user started and finished the sign-in.",
          "**X token refresh:** X access tokens last about two hours. To renew one, the extension or CLI sends its refresh token to `dotsuite.dev/api/connect/refresh/x` and receives a new pair. Neither is stored.",
          "Your IP address is used to rate-limit sign-in and refresh attempts. Errors are logged without tokens.",
          "Sign-in pages load no analytics or third-party scripts.",
        ] },
        { table: {
          head: ["Permission requested", "Why"],
          rows: [
            ["LinkedIn `openid`, `profile`", "Identify your member ID so posts are published as you"],
            ["LinkedIn `w_member_social`", "Create posts, upload media and add the first comment you write"],
            ["X `tweet.read`, `users.read`", "Read your username for account checks, and your own posts' metrics when you ask"],
            ["X `tweet.write`, `media.write`", "Publish posts and threads, and upload images and videos"],
            ["X `offline.access`", "Get a refresh token, so you don't need to sign in again every two hours"],
          ],
        } },
        { p: "The extension also asks `dotsuite.dev` which sign-ins are currently available, so it can disable unavailable buttons. That request contains no personal data." },
      ],
    },
    {
      id: "cloud",
      title: "6. DotSuite cloud scheduling (optional)",
      blocks: [
        { p: "Cloud scheduling publishes posts at a set time, even while your computer is off. It needs a DotSuite account, and it's the only part of DotShare that stores your content and credentials on DotSuite servers. If you never schedule in the cloud or connect accounts in the dashboard, none of this applies to you." },
        { list: [
          "**Credentials.** You add them in one of two ways. Connect LinkedIn or X in the dashboard (section 5). Or, from the extension, agree to the consent prompt shown before your first cloud schedule; Mastodon asks separately. The extension then sends the stored credentials of the platforms you schedule to (Telegram, LinkedIn, X, Bluesky, Mastodon or Dev.to). The server encrypts them with AES-256-GCM before storing them and uses them only to publish the posts you schedule.",
          "**Scheduled posts.** The post text, chosen platforms, image URLs, time and status, plus retry count and the last error if publishing fails. Posts stay in your history after they publish.",
          "**Images.** Images you schedule are uploaded to DotSuite storage on Cloudflare R2 and served from a public, unguessable URL so the platforms can fetch them. Anyone with that URL can view the image. Images stay after publishing and are deleted with the post when you delete your DotSuite account.",
          "**Device identifier.** Requests from the extension and CLI include a one-way SHA-256 hash of a device identifier (VS Code's machine ID, or your computer's hostname and OS username for the CLI). It's used for device limits and abuse prevention and can't be reversed into the original value.",
          "**Activity records.** Posting activity is used for rate limits and abuse prevention and deleted after 7 days. Security audit logs are deleted after 90 days.",
          "**Infrastructure.** The DotSuite API runs at `core.dotsuite.dev` on Railway with a PostgreSQL database. Images are stored on Cloudflare R2. Payments for paid plans are handled by Lemon Squeezy, and DotSuite never receives your card details.",
        ] },
      ],
    },
    {
      id: "choices",
      title: "7. Your choices, and how to delete your data",
      blocks: [
        { list: [
          "**Remove credentials from the extension.** Use **Clear all credentials** at the bottom of DotShare's Settings, or run **DotShare: Clear All Credentials** from the Command Palette (DotShare 3.7.0 and later). Either way, you confirm first. It deletes every platform token and key, your AI provider keys, the GitHub token, your DotSuite key and your cloud-sync consent from this device. You can also disconnect LinkedIn, X or GitHub one at a time in Settings, or sign out of DotSuite with **DotShare: Logout / Clear Token**.",
          "**Remove CLI accounts:** `dotshare-agent accounts remove <id>` deletes the account and its keyring entry. Your local library stays in `~/.dotshare` until you delete that folder.",
          "**Revoke access at the platform.** Removing a credential locally doesn't revoke it. Revoke it where it was issued: LinkedIn (Settings → Data privacy → Permitted services), X (Settings → Security and account access → Apps and sessions), Mastodon (Preferences → Account → Authorized apps), Bluesky (Settings → App passwords), Telegram (@BotFather → revoke token), Discord (delete the webhook) and Dev.to (Settings → Extensions → API keys).",
          "**Cancel scheduled posts** from the extension, or with `cancel_scheduled_post` / `dotshare-agent cloud cancel`.",
          "**Disconnect a platform from DotSuite.** In your DotSuite dashboard, under DotShare → Connected Accounts, select **Disconnect** on any connected platform. Its stored credential is deleted immediately.",
          "**Delete everything.** Deleting your DotSuite account (Dashboard → Settings → Delete account) first deletes all your connected platform credentials, scheduled posts and their images, API keys and licence data, then the account itself. If any of that fails, the account is kept so you can try again. Billing, refund and security-audit records are kept for their legal and security retention periods. Images you uploaded but never attached to a scheduled post aren't linked to your account, so ask support@dotsuite.dev if you need one removed.",
          "**Access or correction.** Ask at the same address what DotSuite stores about your DotShare use, or ask us to correct it.",
        ] },
      ],
    },
    {
      id: "security",
      title: "8. Security",
      blocks: [
        { list: [
          "Every connection to platforms, AI providers and DotSuite uses HTTPS. Credential requests are refused if TLS verification has been disabled.",
          "Credentials are encrypted at rest: by your OS on your device, and with AES-256-GCM on DotSuite servers.",
          "Sign-in only returns tokens to known editor schemes or to the encrypted CLI hand-off, and every sign-in is protected by a one-time state value and PKCE (X).",
          "The CLI's encrypted library refuses to open with a missing or wrong key, so a copied folder alone doesn't expose your drafts.",
          "DotShare is open source. You can review exactly what it sends at github.com/kareem2099/DotShare. Report security issues as described in its SECURITY.md.",
        ] },
      ],
    },
    {
      id: "changes",
      title: "9. Changes and contact",
      blocks: [
        { p: "When DotShare's data handling changes, we update this page and the date at the top, and note the change in DotShare's CHANGELOG. For questions, requests or concerns, email support@dotsuite.dev." },
      ],
    },
  ],
  related: { title: "Related", general: "DotSuite privacy policy (account, billing, website)", terms: "DotSuite terms of service", github: "DotShare source code" },
};

const ar: DotSharePrivacyCopy = {
  eyebrow: "DotSuite · DotShare",
  title: "سياسة الخصوصية لـ DotShare",
  description: "ما الذي تحفظه إضافة DotShare لـ VS Code وخادم MCP في dotshare-cli وتسجيل الدخول عبر dotsuite.dev، وإلى أين يذهب، وكيف تحذفه.",
  updated: "آخر تحديث: ١٢ نوفمبر ٢٠٢٦ (DotShare 3.7.0 و dotshare-cli 3.1.0)",
  intro: [
    "DotShare أداة مفتوحة المصدر للمطورين من DotSuite. تحوّل الـ commits وملاحظات الإصدار والكود إلى منشورات، وتنشرها على الحسابات التي تربطها. تغطي هذه السياسة إضافة DotShare لـ VS Code، وحزمة `dotshare-cli` (سطر الأوامر وخادم MCP المحلي لوكلاء الذكاء الاصطناعي)، وتسجيل الدخول إلى DotShare عبر dotsuite.dev، والجدولة السحابية في DotSuite عند استخدامها مع DotShare.",
    "يعمل DotShare محليًا أولًا. تبقى بيانات الدخول والمسودات والسجل على جهازك، وتذهب المنشورات من جهازك مباشرةً إلى كل منصة، إلا إذا اخترت جدولتها في سحابة DotSuite. أما حسابك في DotSuite والفوترة وموقع dotsuite.dev نفسه فتغطيها سياسة الخصوصية العامة لـ DotSuite.",
  ],
  glanceTitle: "نظرة سريعة",
  glance: {
    head: ["البيانات", "أين تُحفظ", "من يستلمها"],
    rows: [
      ["بيانات دخول المنصات (التوكنات، كلمات مرور التطبيقات، توكنات البوت، الـ webhooks، مفاتيح API)", "على جهازك: SecretStorage في VS Code (الإضافة) أو مخزن بيانات الاعتماد في نظامك (سطر الأوامر)", "المنصة صاحبة البيانات فقط، عند النشر أو الفحص. لا تحصل DotSuite على نسخة إلا إذا جدولت في السحابة ووافقت أولًا."],
      ["مفاتيح API لمزوّدي الذكاء الاصطناعي", "SecretStorage في VS Code على جهازك", "مزوّد الذكاء الاصطناعي الذي تختاره فقط"],
      ["المسودات وسجل المنشورات والإيصالات", "على جهازك، وسجلات سطر الأوامر و MCP مشفّرة (AES-256-GCM)", "لا أحد، حتى تنشر"],
      ["سياق المستودع لمسودات الذكاء الاصطناعي", "لا يحفظه DotShare", "مزوّد الذكاء الاصطناعي الذي تختاره، بمفتاحك أنت، عند طلب مسودة"],
      ["توكنات تسجيل الدخول من LinkedIn و X", "تُمرَّر إلى محررك أو سطر الأوامر. لا يحفظها dotsuite.dev إلا عند ربط حساب للجدولة السحابية.", "محررك أو سطر الأوامر، و DotSuite للجدولة السحابية"],
      ["المنشورات المجدولة وصورها", "خوادم DotSuite (فقط إذا جدولت في السحابة)", "مجدول DotSuite الذي ينشرها على المنصات التي اخترتها"],
    ],
  },
  promisesTitle: "ما لا نفعله أبدًا",
  promises: [
    "بيع بياناتك أو تأجيرها أو مشاركتها لأغراض إعلانية. لا يعرض DotShare إعلانات ولا يحتوي على أدوات تتبع إعلانية.",
    "جمع بيانات استخدام أو تحليلات من الإضافة أو سطر الأوامر أو خادم MCP. كود DotShare نفسه لا يرسل أيًّا منها.",
    "إرسال أي شيء من مستودعك إلى أي جهة، إلا ما تختار تضمينه في مسودة ذكاء اصطناعي (إلى مزوّد الذكاء الاصطناعي) أو في Gist (إلى GitHub).",
    "النشر من تلقاء نفسه. كل منشور يخرج لأنك أنت، أو وكيل ذكاء اصطناعي يتبع تعليماتك، طلبت من DotShare نشره أو جدولته. وتوجّه إرشادات المهارة والأدوات المرفقة مع DotShare الوكلاءَ إلى عرض معاينة عليك وانتظار موافقتك.",
    "استخدام محتوى أو بيانات من LinkedIn أو X أو أي منصة أخرى لبناء ملف عنك، أو لأي غرض غير نشر منشوراتك وعرض نتائجها.",
    "تدريب نماذج ذكاء اصطناعي على محتواك. عند استخدامك مزوّد ذكاء اصطناعي، تحدد شروطه هو ما يحدث لما ترسله.",
  ],
  tocTitle: "المحتويات",
  sections: [
    {
      id: "on-your-device",
      title: "١. ما يبقى على جهازك",
      blocks: [
        { p: "**إضافة VS Code.** تُحفظ بيانات الدخول في SecretStorage في VS Code، الذي يستخدم مخزن بيانات الاعتماد في نظام التشغيل. يشمل ذلك توكنات LinkedIn و X (ومعها توكن التجديد في X وموعد انتهائه)، وتوكن بوت Telegram ومعرّف المحادثة، ورابط webhook في Discord، ومعرّف Bluesky وكلمة مرور التطبيق، وخادم Mastodon وتوكن الوصول، ومفتاح API في Dev.to، ومفاتيح مزوّدي الذكاء الاصطناعي، ومفتاح DotSuite. ويحفظ تخزين الإضافات في VS Code على جهازك إعداداتك وسجلك: المنشورات الأخيرة، وآخر منشور، ومسودات GitHub Gists، ونموذج الذكاء الاصطناعي واللغة اللذين اخترتهما، وروابط الدعوة إلى الإجراء، واختياراتك في الموافقة." },
        { p: "**سطر الأوامر وخادم MCP (`dotshare-cli`).** يُحفظ كل شيء في `~/.dotshare`، أو في المجلد المحدد في `DOTSHARE_HOME`، بصلاحيات ملفات خاصة. يحتوي `accounts.json` على معرّف كل حساب واسمه ومنصته فقط. تُحفظ بيانات الدخول في مخزن بيانات الاعتماد في نظامك. وتُشفَّر المسودات والقوالب المخصصة وسجل النشر بـ AES-256-GCM، بمفتاح رئيسي محفوظ في مخزن بيانات الاعتماد في نظامك. يحفظ سجل النشر بصمات الطلبات وحالتها والإيصالات (معرّفات المنشورات وروابطها)، لا بيانات الدخول ولا النص الكامل للمنشورات. ولا يقرأ خادم MCP الصور إلا من المجلدات التي تسمح بها أثناء الإعداد (`DOTSHARE_MEDIA_ROOTS`)." },
        { p: "لا تحتفظ الإضافة ولا سطر الأوامر بنسخة نصية مكشوفة من بيانات دخولك. وتُزال الأسرار المعروفة من رسائل الخطأ قبل عرضها أو تسجيلها." },
      ],
    },
    {
      id: "platforms",
      title: "٢. النشر على المنصات الاجتماعية",
      blocks: [
        { p: "عندما تنشر أو تعاين أو تفحص حسابًا، يرسل DotShare نص المنشور والصور أو الفيديوهات وبيانات الدخول المناسبة مباشرةً من جهازك إلى واجهة برمجة المنصة. لا تمر خوادم DotSuite في هذا المسار. وبعدها تنطبق سياسة خصوصية كل منصة على ما تنشره." },
        { table: {
          head: ["المنصة", "يُرسل من جهازك إلى"],
          rows: [
            ["LinkedIn", "`api.linkedin.com` (المنشورات، ورفع الوسائط، والتعليق الأول، وملفك الأساسي للنشر باسمك)"],
            ["X", "`api.x.com` (المنشورات، ورفع الوسائط، واسم المستخدم لفحص الحساب)"],
            ["Bluesky", "`bsky.social` (تسجيل الدخول بكلمة مرور التطبيق، والمنشورات، والصور، والبحث عن المعرّفات لإشارات @)"],
            ["Mastodon", "خادمك أنت (المنشورات، والوسائط، وحدود الأحرف والوسائط في الخادم)"],
            ["Telegram", "`api.telegram.org` بتوكن البوت الخاص بك"],
            ["Discord", "رابط الـ webhook الخاص بك على `discord.com`"],
            ["Dev.to", "`dev.to` بمفتاح API الخاص بك"],
          ],
        } },
        { p: "**إحصاءات المنشورات.** إذا طلبت، أنت أو وكيل تستخدمه، إحصاءات منشور، يقرأ DotShare أعداد التفاعل العامة (الإعجابات وإعادة النشر والردود والاقتباسات ومرات الظهور أو المشاهدات) للمنشورات التي نشرها، من المنصات نفسها. ويستخدم مع Bluesky واجهته العامة دون تسجيل دخول. لا يُحفظ شيء سوى ما يُعرض عليك." },
      ],
    },
    {
      id: "ai",
      title: "٣. الكتابة بالذكاء الاصطناعي (اختياري)",
      blocks: [
        { p: "عندما تطلب من DotShare كتابة مسودة، يرسل طلبًا مباشرةً من جهازك إلى مزوّد الذكاء الاصطناعي الذي اخترته (Google Gemini أو OpenAI أو Anthropic Claude أو DeepSeek أو xAI Grok)، بمفتاح API الخاص بك. وحسب اختيارك، قد يتضمن الطلب رسائل الـ commits، ومقتطفات من سجل التغييرات و README، وبيانات المشروع، وأجزاء من تغييرات الكود في المستودع الذي اخترته، وتعليماتك أنت. لا يمر الطلب عبر DotSuite. وتحدد شروط ذلك المزوّد كيفية معالجة طلبك والاحتفاظ به، فلا تضمّن ما لا تريد مشاركته معه." },
        { p: "وكلاء الذكاء الاصطناعي المتصلون بخادم MCP (مثل Codex و Claude Code و Cursor) منتجات منفصلة. ما تقوله لهم، وما يقرؤونه عبر أدوات DotShare، تحكمه سياسات مزوّديهم. لا يعطي DotShare أي وكيل بيانات دخولك أبدًا؛ يتعامل الوكلاء مع معرّفات الحسابات وأسمائها بدلًا منها." },
      ],
    },
    {
      id: "github",
      title: "٤. GitHub Gists و CodeSnap",
      blocks: [
        { p: "يستخدم إنشاء Gist تسجيل دخولك إلى GitHub في VS Code (صلاحية `gist`)، ويرسل الكود المحدد إلى GitHub كـ gist عام أو سري حسب اختيارك. يستطيع أي شخص لديه رابط الـ gist السري أن يراه. أما لقطات CodeSnap فتُرسم داخل VS Code وتُحفظ على جهازك، ولا تغادره إلا إذا أرفقتها بمنشور. وإذا أدرجت صورة CodeSnap حيّة لـ gist (رابط `dotsuite.dev/api/codesnap/gist/…`)، يقرأ dotsuite.dev ذلك الـ gist من واجهة GitHub العامة عند طلب الصورة، مرة كل ١٠ دقائق على الأكثر، ويرسمها. لا يُحفظ شيء سوى الصورة المخزنة مؤقتًا." },
      ],
    },
    {
      id: "sign-in",
      title: "٥. تسجيل الدخول إلى LinkedIn و X عبر dotsuite.dev",
      blocks: [
        { p: "يحتاج تسجيل الدخول إلى LinkedIn و X خادمًا يحمل بيانات اعتماد تطبيق DotShare، ويستخدم DotShare لذلك `dotsuite.dev/api/connect`. أما DotShare 3.6 وما قبله فيستخدم `dotshare-auth-server.vercel.app`، الذي يمرّر التوكنات أيضًا إلى محررك مباشرةً دون حفظها. أثناء تسجيل الدخول عبر dotsuite.dev:" },
        { list: [
          "يحفظ متصفحك ملف تعريف ارتباط موقّعًا من نوع HttpOnly لمدة أقصاها ١٠ دقائق. يحتوي على القيم الأمنية العشوائية لتسجيل الدخول (state ومُتحقق PKCE)، والمنصة، والمحرر أو سطر الأوامر الذي ستعود إليه، ومعرّف مستخدم DotSuite في حالة الدخول من لوحة التحكم. ويُحذف عند انتهاء تسجيل الدخول، نجح أم لم ينجح.",
          "يرسل LinkedIn أو X رمزًا يُستخدم مرة واحدة إلى dotsuite.dev، فيستبدله الخادم بالتوكنات. لا يصل السر الخاص بتطبيق DotShare إلى متصفحك أبدًا.",
          "**الدخول من المحرر:** توضع التوكنات في صفحة النتيجة التي تفتح محررك (`vscode://` و `cursor://` والمحررات المعروفة الأخرى فقط)، وتحفظها الإضافة في SecretStorage. لا يحتفظ الخادم بها.",
          "**الدخول من سطر الأوامر** (`dotshare-agent accounts connect`): تُشفَّر التوكنات بمفتاح يُستخدم مرة واحدة ولا يوجد إلا داخل عملية سطر الأوامر المنتظرة، وتُرسل إليها على `127.0.0.1`. لا تظهر مقروءة في أي رابط أبدًا، ولا يحتفظ الخادم بها.",
          "**الدخول من لوحة التحكم** (زر Connect في لوحة DotSuite): تُحفظ التوكنات للجدولة السحابية كما في القسم ٦، بشرط أن يكون مستخدم DotSuite نفسه المسجّل هو من بدأ تسجيل الدخول وأنهاه.",
          "**تجديد توكن X:** يدوم توكن الوصول في X نحو ساعتين. لتجديده، ترسل الإضافة أو سطر الأوامر توكن التجديد إلى `dotsuite.dev/api/connect/refresh/x` وتستلم زوجًا جديدًا، ولا يُحفظ أيٌّ منهما.",
          "يُستخدم عنوان IP الخاص بك لتحديد عدد محاولات تسجيل الدخول والتجديد. وتُسجَّل الأخطاء دون أي توكنات.",
          "لا تحمّل صفحات تسجيل الدخول أي أدوات تحليلات أو سكربتات من أطراف أخرى.",
        ] },
        { table: {
          head: ["الصلاحية المطلوبة", "السبب"],
          rows: [
            ["LinkedIn `openid` و `profile`", "معرفة معرّف عضويتك لنشر المنشورات باسمك"],
            ["LinkedIn `w_member_social`", "إنشاء المنشورات ورفع الوسائط وإضافة التعليق الأول الذي تكتبه"],
            ["X `tweet.read` و `users.read`", "قراءة اسم المستخدم لفحص الحساب، وإحصاءات منشوراتك عند طلبها"],
            ["X `tweet.write` و `media.write`", "نشر المنشورات والسلاسل، ورفع الصور والفيديوهات"],
            ["X `offline.access`", "الحصول على توكن تجديد حتى لا تحتاج إلى تسجيل الدخول كل ساعتين"],
          ],
        } },
        { p: "تسأل الإضافة أيضًا `dotsuite.dev` عن خيارات تسجيل الدخول المتاحة حاليًا لتعطيل الأزرار غير المتاحة، ولا يحتوي هذا الطلب على أي بيانات شخصية." },
      ],
    },
    {
      id: "cloud",
      title: "٦. الجدولة السحابية في DotSuite (اختيارية)",
      blocks: [
        { p: "تنشر الجدولة السحابية المنشورات في وقت محدد حتى وجهازك مغلق. تتطلب حسابًا في DotSuite، وهي الجزء الوحيد من DotShare الذي يحفظ محتواك وبيانات دخولك على خوادم DotSuite. إذا لم تجدول في السحابة أبدًا ولم تربط حسابات في لوحة التحكم، فلا ينطبق عليك شيء من هذا القسم." },
        { list: [
          "**بيانات الدخول.** تُضاف بإحدى طريقتين: ربط LinkedIn أو X من لوحة التحكم (القسم ٥)، أو الموافقة من الإضافة على طلب الموافقة الذي يظهر قبل أول جدولة سحابية، ويُطلب لـ Mastodon موافقة منفصلة. بعدها ترسل الإضافة بيانات الدخول المحفوظة للمنصات التي تجدول عليها (Telegram أو LinkedIn أو X أو Bluesky أو Mastodon أو Dev.to). يشفّرها الخادم بـ AES-256-GCM قبل حفظها، ولا يستخدمها إلا لنشر المنشورات التي تجدولها.",
          "**المنشورات المجدولة.** نص المنشور، والمنصات المختارة، وروابط الصور، والموعد، والحالة، إضافة إلى عدد المحاولات وآخر خطأ إذا فشل النشر. تبقى المنشورات في سجلك بعد نشرها.",
          "**الصور.** تُرفع الصور التي تجدولها إلى تخزين DotSuite على Cloudflare R2، وتُقدَّم من رابط عام يصعب تخمينه حتى تستطيع المنصات جلبها. يستطيع أي شخص لديه الرابط رؤية الصورة. تبقى الصور بعد النشر، وتُحذف مع المنشور عند حذف حسابك في DotSuite.",
          "**معرّف الجهاز.** تتضمن الطلبات من الإضافة وسطر الأوامر بصمة SHA-256 أحادية الاتجاه لمعرّف الجهاز (معرّف الجهاز في VS Code، أو اسم الجهاز واسم مستخدم النظام في سطر الأوامر). تُستخدم لحدود الأجهزة ومنع إساءة الاستخدام، ولا يمكن استرجاع القيمة الأصلية منها.",
          "**سجلات النشاط.** يُستخدم نشاط النشر لحدود المعدل ومنع إساءة الاستخدام ويُحذف بعد ٧ أيام. وتُحذف سجلات التدقيق الأمني بعد ٩٠ يومًا.",
          "**البنية التحتية.** تعمل واجهة DotSuite البرمجية على `core.dotsuite.dev` في Railway مع قاعدة بيانات PostgreSQL. وتُخزَّن الصور على Cloudflare R2. وتتولى Lemon Squeezy مدفوعات الخطط المدفوعة، ولا تستلم DotSuite بيانات بطاقتك أبدًا.",
        ] },
      ],
    },
    {
      id: "choices",
      title: "٧. اختياراتك وطريقة حذف بياناتك",
      blocks: [
        { list: [
          "**إزالة بيانات الدخول من الإضافة.** استخدم زر **Clear all credentials** في أسفل إعدادات DotShare، أو نفّذ أمر **DotShare: Clear All Credentials** من لوحة الأوامر (DotShare 3.7.0 وما بعده). في الحالتين تؤكد أولًا. يحذف كل توكنات المنصات ومفاتيحها، ومفاتيح مزوّدي الذكاء الاصطناعي، وتوكن GitHub، ومفتاح DotSuite، وموافقتك على المزامنة السحابية من هذا الجهاز. ويمكنك أيضًا فصل LinkedIn أو X أو GitHub كلٌّ على حدة من الإعدادات، أو تسجيل الخروج من DotSuite بأمر **DotShare: Logout / Clear Token**.",
          "**إزالة حسابات سطر الأوامر:** يحذف `dotshare-agent accounts remove <id>` الحساب وبيانات دخوله من مخزن النظام. تبقى مكتبتك المحلية في `~/.dotshare` حتى تحذف ذلك المجلد.",
          "**إلغاء الوصول من المنصة.** حذف بيانات الدخول محليًا لا يلغيها. ألغِها من حيث أُصدرت: LinkedIn (الإعدادات ← خصوصية البيانات ← الخدمات المسموح بها)، و X (الإعدادات ← الأمان والوصول إلى الحساب ← التطبيقات والجلسات)، و Mastodon (التفضيلات ← الحساب ← التطبيقات المصرّح لها)، و Bluesky (الإعدادات ← كلمات مرور التطبيقات)، و Telegram (@BotFather ← إلغاء التوكن)، و Discord (حذف الـ webhook)، و Dev.to (الإعدادات ← Extensions ← مفاتيح API).",
          "**إلغاء المنشورات المجدولة** من الإضافة، أو عبر `cancel_scheduled_post` أو `dotshare-agent cloud cancel`.",
          "**فصل منصة عن DotSuite.** من لوحة تحكم DotSuite، في DotShare ← Connected Accounts، اختر **Disconnect** على أي منصة متصلة، فتُحذف بيانات دخولها المحفوظة فورًا.",
          "**حذف كل شيء.** حذف حسابك في DotSuite (لوحة التحكم ← الإعدادات ← حذف الحساب) يحذف أولًا كل بيانات دخول المنصات المتصلة، والمنشورات المجدولة وصورها، ومفاتيح API، وبيانات التراخيص، ثم الحساب نفسه. إذا فشل أي جزء من ذلك، يبقى الحساب حتى تحاول مرة أخرى. وتُحفظ سجلات الفوترة والاسترداد والتدقيق الأمني طوال مدد الاحتفاظ القانونية والأمنية الخاصة بها. أما الصور التي رفعتها ولم ترفقها بمنشور مجدول فليست مرتبطة بحسابك، فراسل support@dotsuite.dev إذا أردت حذف إحداها.",
          "**الاطلاع والتصحيح.** يمكنك أن تسأل على العنوان نفسه عمّا تحفظه DotSuite عن استخدامك لـ DotShare، أو أن تطلب تصحيحه.",
        ] },
      ],
    },
    {
      id: "security",
      title: "٨. الأمان",
      blocks: [
        { list: [
          "كل اتصال بالمنصات ومزوّدي الذكاء الاصطناعي و DotSuite يتم عبر HTTPS، وتُرفض طلبات بيانات الدخول إذا عُطّل التحقق من TLS.",
          "بيانات الدخول مشفّرة أثناء التخزين: بواسطة نظامك على جهازك، وبـ AES-256-GCM على خوادم DotSuite.",
          "لا يعيد تسجيل الدخول التوكنات إلا إلى مخططات محررات معروفة أو إلى التسليم المشفّر لسطر الأوامر، وكل تسجيل دخول محمي بقيمة state تُستخدم مرة واحدة و PKCE (في X).",
          "ترفض مكتبة سطر الأوامر المشفّرة الفتح بمفتاح مفقود أو خاطئ، فنسخ المجلد وحده لا يكشف مسوداتك.",
          "DotShare مفتوح المصدر، ويمكنك مراجعة ما يرسله بالضبط على github.com/kareem2099/DotShare. أبلغ عن المشكلات الأمنية كما يوضح ملف SECURITY.md فيه.",
        ] },
      ],
    },
    {
      id: "changes",
      title: "٩. التغييرات والتواصل",
      blocks: [
        { p: "عندما تتغير طريقة تعامل DotShare مع البيانات، نحدّث هذه الصفحة والتاريخ في أعلاها، ونذكر التغيير في سجل تغييرات DotShare (CHANGELOG). للأسئلة أو الطلبات أو المخاوف، راسل support@dotsuite.dev." },
      ],
    },
  ],
  related: { title: "روابط ذات صلة", general: "سياسة خصوصية DotSuite (الحساب والفوترة والموقع)", terms: "شروط خدمة DotSuite", github: "الكود المصدري لـ DotShare" },
};

export const dotSharePrivacyCopy: Record<PrivacyLanguage, DotSharePrivacyCopy> = { en, ar, de, fr, ru };
