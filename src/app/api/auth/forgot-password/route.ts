import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { getPasswordResetEmailTemplate } from "@/lib/emailTemplates";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { z } from "zod";

// Zod Schema for email + locale validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  locale: z.string().min(2).max(5).optional().default("en"),
});

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

    if (!user) {
      // 🏆 Prevent User Enumeration
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent to your email" },
        { status: 200 }
      );
    }

    // 2. 🛡️ OAuth Users Protection
    if (!user.password) {
      return NextResponse.json(
        { message: "This email is registered with a social provider (Google/GitHub). Password reset is not available." },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Build locale-aware reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/${locale}/reset-password?token=${resetToken}`;

    // Use email template
    const { subject, html, message } = getPasswordResetEmailTemplate(resetUrl);

    const emailSent = await sendEmail({ to: user.email, subject, html, text: message });

    if (!emailSent) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return NextResponse.json(
        { message: "Email could not be sent. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "If an account exists, a reset link has been sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
