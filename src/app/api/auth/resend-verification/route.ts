import { NextResponse, after } from "next/server";
import { connectDB } from "@/lib/postgres";
import User from "@/models/User";
import { sendTemplateEmail } from "@/lib/email";
import { routing } from "@/i18n/routing";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { z } from "zod";

// Zod Schema for resend verification
const resendVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  locale: z.enum(routing.locales).catch(routing.defaultLocale),
});

// One answer for every case (no account, already verified, email sent) so the
// endpoint can't be used to find out who has an account.
const GENERIC_RESPONSE = {
  message: "If an account exists and is not verified, a verification email has been sent.",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate email + locale
    const validation = resendVerificationSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { email, locale } = validation.data;

    // 2. Rate limit by IP (3 attempts per hour)
    const ip = getClientIP(req.headers);
    const ipRateLimit = await checkRateLimit(`${ip}_resend_verification`, "resend-verification-ip", 3, 3600);

    if (!ipRateLimit.success) {
      return NextResponse.json(
        { error: `Too many verification requests. Please try again in ${Math.ceil(ipRateLimit.resetIn / 60)} minutes.` },
        { status: 429 }
      );
    }

    // 3. Rate limit by email (3 attempts per hour)
    const emailRateLimit = await checkRateLimit(email, "resend-verification", 3, 3600);

    if (!emailRateLimit.success) {
      return NextResponse.json(
        { error: `Too many verification requests. Please try again in ${Math.ceil(emailRateLimit.resetIn / 60)} minutes.` },
        { status: 429 }
      );
    }

    // 4. Database connection & User lookup
    await connectDB();
    const user = await User.findOne({ email });

    // Prevent user enumeration - same message as success, whether missing or already verified
    if (!user || user.isEmailVerified) {
      return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
    }

    // 5. Generate new token and save
    const rawToken = user.getVerificationToken();
    await user.save();

    // 6. Send Email with locale-aware URL
    const verifyUrl = `${process.env.NEXTAUTH_URL}/${locale}/verify-email?token=${rawToken}`;
    // Sent after the response so an existing account doesn't answer slower than a missing one
    after(() =>
      sendTemplateEmail({
        to: email,
        kind: "verify",
        locale,
        data: { name: user.name, verifyUrl, expiresHours: User.VERIFY_TOKEN_HOURS },
      })
    );

    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}