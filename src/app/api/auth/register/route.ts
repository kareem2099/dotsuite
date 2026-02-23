import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { getVerifyEmailTemplate } from "@/lib/emailTemplates";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { z } from "zod";

const apiRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character (!@#$%^&*)"),
});

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

    const { name, email, password } = validation.data;

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email }).select("+password");
    if (existingUser) {
      if (!existingUser.password) {
        return NextResponse.json(
          { error: "This email is registered with Google or GitHub. Please sign in with that provider." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // ✅ Create user instance and generate token
    const user = new User({ name, email, password });
    const rawToken = user.getVerificationToken();
    await user.save();

    // ✅ Send verification email only (welcome email will be sent after email is verified)
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${rawToken}`;
    const { subject, html, message } = getVerifyEmailTemplate(user.name, verifyUrl);
    
    // Fire and forget - don't block response for email sending
    // But we await to catch any errors and log them
    sendEmail({ to: email, subject, html, text: message }).catch((err) => {
      console.error("Failed to send verification email:", err);
    });

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email to verify your account.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}