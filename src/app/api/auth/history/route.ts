import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized - You must be logged in" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    // Fetch last 50 audit log entries for the user, newest first
    const logs = await AuditLog.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-__v")
      .lean();

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Fetch audit history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit history" },
      { status: 500 }
    );
  }
}
