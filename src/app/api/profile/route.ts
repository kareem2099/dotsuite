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

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  
  // Return user profile data, excluding sensitive fields
  const user = await User.findOne({ email: session.user.email })
    .select("-__v -resetPasswordToken -resetPasswordExpire -verificationToken -verificationTokenExpire");
  
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
    const updateData: Record<string, any> = { ...otherFields };
    
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
      { new: true, runValidators: true } // new بترجع الداتا بعد التحديث، runValidators بتتأكد من شروط الموديل
    ).select("-__v -resetPasswordToken -resetPasswordExpire -verificationToken -verificationTokenExpire");

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
    // prtection against abuse: 3 delete attempts per hour
    const rateLimit = await checkRateLimit(session.user.email, "delete-account", 3, 3600);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    await connectDB();
    await User.findOneAndDelete({ email: session.user.email });

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Profile delete error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}