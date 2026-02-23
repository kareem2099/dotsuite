import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { getWelcomeEmailTemplate } from "@/lib/emailTemplates";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { z } from "zod";
import crypto from "crypto";

// Zod Schema for verify email
const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export async function POST(request: Request) {
  try {
    // 1. 🛡️ IP Rate Limiting (10 attempts per hour per IP)
    const ip = getClientIP(request.headers);
    const rateLimitIdentifier = `${ip}_verify_email`;
    const rateLimit = await checkRateLimit(rateLimitIdentifier, "verify-email", 10, 3600);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const validation = verifyEmailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { token } = validation.data;

    // Hash the token to match the one in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    await connectDB();

    // Find user with matching verification token and valid expiry
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // 2. Clean up tokens and verify
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    //  Send welcome email (fire and forget)
    const { subject, html, message } = getWelcomeEmailTemplate(user.name);
    sendEmail({ to: user.email, subject, html, text: message }).catch((err) => {
      console.error("Failed to send welcome email:", err);
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
