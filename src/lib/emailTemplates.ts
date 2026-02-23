// lib/emailTemplates.ts

export interface EmailTranslations {
  welcomeEmailSubject: string;
  welcomeEmailLine1: string;
  welcomeEmailThankYou: string;
  welcomeEmailIntro: string;
  welcomeEmailFeatures: string;
  welcomeEmailFeature1: string;
  welcomeEmailFeature2: string;
  welcomeEmailFeature3: string;
  welcomeEmailFeature4: string;
  welcomeEmailGetStarted: string;
  welcomeEmailSupport: string;
  welcomeEmailRegards: string;
  welcomeEmailTeam: string;
  passwordResetSuccessEmailSubject: string;
  passwordResetSuccessEmailBody: string;
  passwordResetSuccessEmailWarning: string;
  verifyEmailSubject: string;
  verifyEmailBody: string;
  verifyEmailButton: string;
  verifyEmailWarning: string;
}

const defaultTranslations: EmailTranslations = {
  welcomeEmailSubject: "Welcome to dotsuite!",
  welcomeEmailLine1: "Dear {name},",
  welcomeEmailThankYou: "Thank you for joining dotsuite!",
  welcomeEmailIntro: "We're thrilled to have you on board. Our platform offers a comprehensive suite of developer tools designed to boost your productivity and streamline your workflow.",
  welcomeEmailFeatures: "Here's what you can do with dotsuite:",
  welcomeEmailFeature1: "Explore our VS Code extensions",
  welcomeEmailFeature2: "Discover Next.js web application solutions",
  welcomeEmailFeature3: "Access Python automation tools",
  welcomeEmailFeature4: "Connect with our developer community",
  welcomeEmailGetStarted: "Get started by logging into your account",
  welcomeEmailSupport: "If you have any questions or need assistance, feel free to reach out to our support team.",
  welcomeEmailRegards: "Best regards,",
  welcomeEmailTeam: "The dotsuite Team",
  passwordResetSuccessEmailSubject: "Your password has been reset",
  passwordResetSuccessEmailBody: "Your password has been reset successfully!",
  passwordResetSuccessEmailWarning: "If you didn't make this change, please contact us immediately to secure your account.",
  verifyEmailSubject: "Verify your dotsuite email",
  verifyEmailBody: "Please verify your email address to activate your account and get access to all features.",
  verifyEmailButton: "Verify Email Address →",
  verifyEmailWarning: "If you didn't create a dotsuite account, please ignore this email.",
};

// ─── Base HTML Wrapper ────────────────────────────────────────────

const baseStyles = `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .wrapper { background-color: #f4f4f5; padding: 40px 20px; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background-color: #0a0a0a; padding: 32px 40px; text-align: center; }
  .logo { color: #10b981; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
  .header-badge { display: inline-block; margin-top: 12px; padding: 4px 12px; border: 1px solid rgba(16,185,129,0.3); border-radius: 999px; color: #10b981; font-size: 12px; }
  .body { padding: 40px; }
  .greeting { font-size: 24px; font-weight: 700; color: #0a0a0a; margin-bottom: 16px; }
  .text { font-size: 15px; color: #52525b; line-height: 1.7; margin-bottom: 24px; }
  .divider { height: 1px; background-color: #e4e4e7; margin: 32px 0; }
  .features-title { font-size: 13px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
  .feature { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
  .feature-icon { width: 32px; height: 32px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; text-align: center; line-height: 32px; font-size: 16px; flex-shrink: 0; }
  .feature-text { font-size: 14px; color: #3f3f46; line-height: 1.5; padding-top: 6px; }
  .cta-section { text-align: center; margin: 32px 0; }
  .cta-button { display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 10px; }
  .warning-box { background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 10px; padding: 16px 20px; margin: 24px 0; }
  .warning-text { font-size: 13px; color: #92400e; line-height: 1.6; }
  .success-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px 24px; margin: 24px 0; text-align: center; }
  .success-icon { font-size: 36px; margin-bottom: 8px; }
  .success-text { font-size: 18px; font-weight: 700; color: #065f46; }
  .footer { background-color: #fafafa; border-top: 1px solid #e4e4e7; padding: 28px 40px; text-align: center; }
  .footer-logo { color: #10b981; font-size: 18px; font-weight: 800; margin-bottom: 8px; }
  .footer-text { font-size: 12px; color: #a1a1aa; line-height: 1.6; }
  .footer-links { margin-top: 12px; }
  .footer-link { font-size: 12px; color: #10b981; text-decoration: none; margin: 0 8px; }
</style>
`;

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>dotsuite</title>
  ${baseStyles}
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">dotsuite</div>
        <div class="header-badge">Developer Tools Platform</div>
      </div>
      ${content}
      <div class="footer">
        <div class="footer-logo">dotsuite</div>
        <p class="footer-text">
          Developer tools built to make your workflow faster and smarter.<br />
          © ${new Date().getFullYear()} dotsuite. All rights reserved.
        </p>
        <div class="footer-links">
          <a href="${process.env.NEXTAUTH_URL}" class="footer-link">Website</a>
          <a href="${process.env.NEXTAUTH_URL}/product" class="footer-link">Products</a>
          <a href="${process.env.NEXTAUTH_URL}/contact" class="footer-link">Support</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// ─── Welcome Email ────────────────────────────────────────────────

export const getWelcomeEmailTemplate = (
  name: string,
  translations?: Partial<EmailTranslations>
): { subject: string; html: string; message: string } => {
  const t = { ...defaultTranslations, ...translations };

  const features = [
    { icon: "⚡", text: t.welcomeEmailFeature1 },
    { icon: "▲",  text: t.welcomeEmailFeature2 },
    { icon: "🐍", text: t.welcomeEmailFeature3 },
    { icon: "🤝", text: t.welcomeEmailFeature4 },
  ];

  const html = emailWrapper(`
    <div class="body">
      <p class="greeting">${t.welcomeEmailLine1.replace("{name}", name)} 👋</p>
      <p class="text">${t.welcomeEmailThankYou}</p>
      <p class="text">${t.welcomeEmailIntro}</p>
      <div class="divider"></div>
      <p class="features-title">${t.welcomeEmailFeatures}</p>
      ${features.map((f) => `
        <div class="feature">
          <div class="feature-icon">${f.icon}</div>
          <div class="feature-text">${f.text}</div>
        </div>
      `).join("")}
      <div class="divider"></div>
      <p class="text">${t.welcomeEmailGetStarted}</p>
      <div class="cta-section">
        <a href="${process.env.NEXTAUTH_URL}/login" class="cta-button">Get Started →</a>
      </div>
      <p class="text" style="font-size:13px; color:#71717a;">${t.welcomeEmailSupport}</p>
      <p class="text" style="margin-bottom:4px;">${t.welcomeEmailRegards}</p>
      <p class="text" style="font-weight:600; color:#0a0a0a;">${t.welcomeEmailTeam}</p>
    </div>
  `);

  const message = `
${t.welcomeEmailLine1.replace("{name}", name)}

${t.welcomeEmailThankYou}

${t.welcomeEmailIntro}

${t.welcomeEmailFeatures}
${features.map((f) => `• ${f.text}`).join("\n")}

${t.welcomeEmailGetStarted}
${process.env.NEXTAUTH_URL}/login

${t.welcomeEmailSupport}

${t.welcomeEmailRegards}
${t.welcomeEmailTeam}
  `;

  return { subject: t.welcomeEmailSubject, html, message };
};

// ─── Verify Email ─────────────────────────────────────────────────

export const getVerifyEmailTemplate = (
  name: string,
  verifyUrl: string,
  translations?: Partial<EmailTranslations>
): { subject: string; html: string; message: string } => {
  const t = { ...defaultTranslations, ...translations };

  const html = emailWrapper(`
    <div class="body">
      <p class="greeting">Verify your email 📧</p>
      <p class="text">Hey ${name}, welcome to dotsuite!</p>
      <p class="text">${t.verifyEmailBody} This link will expire in <strong>24 hours</strong>.</p>
      <div class="cta-section">
        <a href="${verifyUrl}" class="cta-button">${t.verifyEmailButton}</a>
      </div>
      <p class="text" style="text-align:center; font-size:13px; color:#71717a;">
        Or copy and paste this link into your browser:<br/>
        <a href="${verifyUrl}" style="color:#10b981; word-break:break-all;">${verifyUrl}</a>
      </p>
      <div class="warning-box">
        <p class="warning-text">⚠️ ${t.verifyEmailWarning}</p>
      </div>
      <p class="text" style="margin-bottom:4px;">${t.welcomeEmailRegards}</p>
      <p class="text" style="font-weight:600; color:#0a0a0a;">${t.welcomeEmailTeam}</p>
    </div>
  `);

  const message = `
Hey ${name},

${t.verifyEmailBody}
${verifyUrl}

This link will expire in 24 hours.

${t.verifyEmailWarning}

${t.welcomeEmailRegards}
${t.welcomeEmailTeam}
  `;

  return { subject: t.verifyEmailSubject, html, message };
};

// ─── Password Reset Email ─────────────────────────────────────────

export const getPasswordResetEmailTemplate = (
  resetUrl: string
): { subject: string; html: string; message: string } => {
  const subject = "Password Reset Request";

  const html = emailWrapper(`
    <div class="body">
      <p class="greeting">Reset your password 🔐</p>
      <p class="text">You requested a password reset for your dotsuite account.</p>
      <p class="text">Click the button below to reset your password. This link will expire in <strong>10 minutes</strong>.</p>
      <div class="cta-section">
        <a href="${resetUrl}" class="cta-button">Reset Password →</a>
      </div>
      <p class="text" style="text-align:center; font-size:13px; color:#71717a;">
        Or copy and paste this link:<br/>
        <a href="${resetUrl}" style="color:#10b981; word-break:break-all;">${resetUrl}</a>
      </p>
      <div class="warning-box">
        <p class="warning-text">⚠️ If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
      </div>
      <p class="text" style="margin-bottom:4px;">Best regards,</p>
      <p class="text" style="font-weight:600; color:#0a0a0a;">The dotsuite Team</p>
    </div>
  `);

  const message = `
You requested a password reset for your dotsuite account.

Reset your password here:
${resetUrl}

This link will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
The dotsuite Team
  `;

  return { subject, html, message };
};

// ─── Password Reset Success Email ─────────────────────────────────

export const getPasswordResetSuccessEmailTemplate = (
  translations?: Partial<EmailTranslations>
): { subject: string; html: string; message: string } => {
  const t = { ...defaultTranslations, ...translations };

  const html = emailWrapper(`
    <div class="body">
      <div class="success-box">
        <div class="success-icon">✅</div>
        <p class="success-text">${t.passwordResetSuccessEmailBody}</p>
      </div>
      <p class="text">Your dotsuite account password has been successfully updated. You can now log in with your new password.</p>
      <div class="cta-section">
        <a href="${process.env.NEXTAUTH_URL}/login" class="cta-button">Login to your account →</a>
      </div>
      <div class="warning-box">
        <p class="warning-text">⚠️ ${t.passwordResetSuccessEmailWarning}</p>
      </div>
      <p class="text" style="margin-bottom:4px;">${t.welcomeEmailRegards}</p>
      <p class="text" style="font-weight:600; color:#0a0a0a;">${t.welcomeEmailTeam}</p>
    </div>
  `);

  const message = `
${t.passwordResetSuccessEmailBody}

${t.passwordResetSuccessEmailWarning}

${t.welcomeEmailRegards}
${t.welcomeEmailTeam}
  `;

  return { subject: t.passwordResetSuccessEmailSubject, html, message };
};