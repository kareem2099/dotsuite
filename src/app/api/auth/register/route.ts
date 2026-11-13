import { NextResponse, after } from "next/server";
import { connectDB } from "@/lib/postgres";
import User from "@/models/User";
import { sendTemplateEmail } from "@/lib/email";
import { nameSchema } from "@/lib/validation";
import { routing } from "@/i18n/routing";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const apiRegisterSchema = z.object({
  name: nameSchema,
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character (!@#$%^&*)"),
  locale: z.enum(routing.locales).catch(routing.defaultLocale),
});

// Same response whether or not the email is already registered, so the endpoint
// can't be used to find out who has an account.
const REGISTER_ACCEPTED = {
  message: "User created successfully. Please check your email to verify your account.",
};

export async function POST(req: Request) {
  try {
    // Rate limit: 5 registrations per hour per IP
    const ip = getClientIP(req.headers);
    const rateLimit = await checkRateLimit(ip, "register", 5, 3600);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes.` },
        { status: 429 }
      );
    }

    const body = await req.json();

    const validation = apiRegisterSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, password, locale } = validation.data;

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // 🛡️ Anti-Enumeration: answer exactly like a new sign-up and tell the real owner
      // by email instead. The throwaway hash keeps the response time close to the
      // new-user path, which hashes the password on save.
      await bcrypt.hash(password, 10);

      // Cap these notices per address so the form can't be used to flood an inbox
      const noticeLimit = await checkRateLimit(email, "register-exists-notice", 2, 3600);
      if (noticeLimit.success) {
        after(() =>
          sendTemplateEmail({
            to: existingUser.email,
            kind: "accountExists",
            locale: existingUser.locale ?? locale,
            data: {},
          })
        );
      }

      return NextResponse.json(REGISTER_ACCEPTED, { status: 201 });
    }

    // ✅ Create user instance and generate token
    const user = new User({ 
      name, 
      email, 
      password,
      locale,
      referral_code: crypto.randomBytes(4).toString("hex")
    });
    const rawToken = user.getVerificationToken();
    await user.save();

    // 📝 Log successful registration
    await logAudit({
      userId: user._id.toString(),
      email: user.email,
      action: "REGISTER",
      status: "SUCCESS",
      ip,
      userAgent: req.headers.get("user-agent") || "Unknown Device",
      details: "New account created via email registration",
    });

    // ✅ Send verification email with locale-aware URL
    const verifyUrl = `${process.env.NEXTAUTH_URL}/${locale}/verify-email?token=${rawToken}`;

    // after() keeps the serverless function alive until the email is sent; a bare
    // promise is cut off once the response goes out (sendTemplateEmail logs its own errors)
    after(() =>
      sendTemplateEmail({
        to: email,
        kind: "verify",
        locale,
        data: { name: user.name, verifyUrl, expiresHours: User.VERIFY_TOKEN_HOURS },
      })
    );

    return NextResponse.json(REGISTER_ACCEPTED, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}