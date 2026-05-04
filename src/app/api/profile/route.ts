import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit"; 

// Zod Schema for profile update
const profileUpdateSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
});

// Zod Schema for account deletion (requires password confirmation)
const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required to confirm account deletion"),
});

// 🛡️ Explicit allowlist of fields returned to the client — never expose sensitive fields by accident
const PROFILE_SELECT_FIELDS = "name email image bio location website twitter github isEmailVerified createdAt";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  
  // Use an explicit allowlist instead of a blocklist to prevent accidental data leaks
  const user = await User.findOne({ email: session.user.email })
    .select(PROFILE_SELECT_FIELDS);
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // protection against abuse: 20 profile updates per hour
    const rateLimit = await checkRateLimit(session.user.email, "update-profile", 20, 3600);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many profile updates. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    
    // Zod validation
    const validation = profileUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      const errorMessage = firstError?.message || "Validation failed";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { displayName, ...otherFields } = validation.data;
    
    // Build update object
    const updateData: Record<string, unknown> = { ...otherFields };
    
    if (displayName !== undefined) {
      updateData.name = displayName;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    await connectDB();
    
    // use findOneAndUpdate to update and return the new document in one step
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).select(PROFILE_SELECT_FIELDS);

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Rate limit: 3 delete attempts per hour
    const rateLimit = await checkRateLimit(session.user.email, "delete-account", 3, 3600);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await req.json();

    // 🛡️ Require password confirmation before deletion to prevent:
    // 1. Accidental deletion via CSRF or misconfigured clients
    // 2. Deletion from a stolen/hijacked session
    const validation = deleteAccountSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Password confirmation is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // OAuth-only accounts have no password — skip password check
    if (user.password) {
      const isValid = await user.comparePassword(validation.data.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Incorrect password. Please try again." },
          { status: 403 }
        );
      }
    }

    await User.findOneAndDelete({ email: session.user.email });

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Profile delete error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}