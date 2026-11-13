import { NextResponse, after } from "next/server";
import { connectDB } from "@/lib/postgres";
import User from "@/models/User";
import { sendTemplateEmail } from "@/lib/email";
import { routing } from "@/i18n/routing";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { z } from "zod";

// Zod Schema for email + locale validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  locale: z.enum(routing.locales).catch(routing.defaultLocale),
});

// One answer for every case (no account, social-login account, email sent) so the
// endpoint can't be used to find out who has an account or how they sign in.
const GENERIC_RESPONSE = { message: "If an account exists, a reset link has been sent to your email" };

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Zod validation
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, locale } = validation.data;

    // 1. 🛡️ Advanced Rate Limiting (IP + Action)
    // Rate limit: 3 password reset attempts per hour
    const ip = getClientIP(request.headers);
    const rateLimitIdentifier = `${ip}_forgot_password`;
    const rateLimit = await checkRateLimit(rateLimitIdentifier, "forgot-password", 3, 3600);

    if (!rateLimit.success) {
      return NextResponse.json(
        { message: `Too many password reset requests. Please try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes.` },
        { status: 429 }
      );
    }

    await connectDB();

    // Check if user exists with that email and has a password (not OAuth-only)
    const user = await User.findOne({ email }).select("+password");

    // 🏆 Prevent User Enumeration
    if (!user) {
      return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
    }

    // 2. 🛡️ OAuth users have no password to reset: tell them by email how they sign in
    if (!user.password) {
      after(() =>
        sendTemplateEmail({ to: user.email, kind: "socialAccountReset", locale: user.locale ?? locale, data: {} })
      );
      return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Build locale-aware reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/${locale}/reset-password?token=${resetToken}`;

    // Sent after the response so an existing account doesn't answer slower than a
    // missing one. A token whose email never went out is cleared again.
    after(async () => {
      const emailSent = await sendTemplateEmail({
        to: user.email,
        kind: "passwordReset",
        locale,
        data: { resetUrl, expiresMinutes: User.RESET_TOKEN_MINUTES },
      });
      if (!emailSent) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
      }
    });

    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
