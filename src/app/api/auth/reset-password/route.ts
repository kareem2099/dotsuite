import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { getPasswordResetSuccessEmailTemplate } from "@/lib/emailTemplates";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { z } from "zod";
import crypto from "crypto";

// Zod Schema for password reset
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character (!@#$%^&*)"),
});

export async function POST(request: Request) {
  try {
    // 1. 🛡️ IP Rate Limiting (10 attempts per hour per IP)
    const ip = getClientIP(request.headers);
    const rateLimitIdentifier = `${ip}_reset_password`;
    const rateLimit = await checkRateLimit(rateLimitIdentifier, "reset-password", 10, 3600);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { message: "Too many password reset attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      const errorMessage = firstError?.message || "Validation failed";
      return NextResponse.json(
        { message: errorMessage },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    // Hash the token from the URL to match the one in database
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    await connectDB();

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Set the new password (it will be hashed by the pre-save hook)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // 2. 🚀 Send confirmation email (fire and forget)
    const { subject, html, message } = getPasswordResetSuccessEmailTemplate();
    sendEmail({ to: user.email, subject, html, text: message }).catch((err) => {
      console.error("Failed to send password reset success email:", err);
    });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
