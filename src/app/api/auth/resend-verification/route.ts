import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { getVerifyEmailTemplate } from "@/lib/emailTemplates";
import { checkRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

// Zod Schema for resend verification
const resendVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate email once
    const validation = resendVerificationSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // 2. Rate limit: 3 resend attempts per hour per email
    const rateLimit = await checkRateLimit(email, "resend-verification", 3, 3600);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many verification requests. Please try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes.` },
        { status: 429 }
      );
    }

    // 3. Database connection & User lookup
    await connectDB();
    const user = await User.findOne({ email });

    // Prevent user enumeration - same message as success
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists and is not verified, a verification email has been sent." },
        { status: 200 }
      );
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 200 }
      );
    }

    // 4. Generate new token and save
    const rawToken = user.getVerificationToken();
    await user.save();

    // 5. Send Email
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${rawToken}`;
    const { subject, html, message } = getVerifyEmailTemplate(user.name, verifyUrl);
    await sendEmail({ to: email, subject, html, text: message });

    return NextResponse.json(
      { message: "If an account exists and is not verified, a verification email has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}