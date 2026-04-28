import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { getPasswordResetSuccessEmailTemplate } from "@/lib/emailTemplates";
import { checkRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

// Zod Schema for change password
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character (!@#$%^&*)"),
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized - You must be logged in" },
      { status: 401 }
    );
  }

  try {
    // 1. 🛡️ Rate Limiting (5 attempts per hour per email)
    const rateLimit = await checkRateLimit(session.user.email, "change-password", 5, 3600);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many password change attempts. Please try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes.` },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Validate with Zod
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      const errorMessage = firstError?.message || "Validation failed";
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validation.data;

    await connectDB();

    // Fetch user with password and password history fields
    const user = await User.findOne({ email: session.user.email }).select("+password +passwordHistory");

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "User not found or password not set" },
        { status: 404 }
      );
    }

    // Extract request metadata for audit logs
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "Unknown Device";

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);

    if (!isValid) {
      // 📝 Log failed password change attempt
      await logAudit({
        userId: user._id.toString(),
        email: user.email,
        action: "PASSWORD_CHANGE",
        status: "FAILED",
        ip,
        userAgent,
        details: "Current password incorrect",
      });
      
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // 🛡️ Check password history (prevent reuse of last 5 passwords)
    const isInHistory = await user.isPasswordInHistory(newPassword);
    if (isInHistory) {
      // 📝 Log failed password change attempt (password reuse)
      await logAudit({
        userId: user._id.toString(),
        email: user.email,
        action: "PASSWORD_CHANGE",
        status: "FAILED",
        ip,
        userAgent,
        details: "Attempted to reuse a previous password",
      });
      
      return NextResponse.json(
        { error: "You cannot reuse a recent password. Please choose a different password." },
        { status: 400 }
      );
    }

    // Update to new password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    // 📝 Log successful password change
    await logAudit({
      userId: user._id.toString(),
      email: user.email,
      action: "PASSWORD_CHANGE",
      status: "SUCCESS",
      ip,
      userAgent,
      details: "Password changed successfully",
    });

    // 2. 🚀 Send confirmation email (fire and forget)
    const { subject, html, message } = getPasswordResetSuccessEmailTemplate();
    sendEmail({ to: user.email, subject, html, text: message }).catch((err) => {
      console.error("Failed to send password change confirmation email:", err);
    });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
