import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal } from "@/lib/rust-api";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ prefix: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prefix } = await params;

    if (!prefix || typeof prefix !== "string") {
      return NextResponse.json({ error: "Invalid prefix" }, { status: 400 });
    }

    // Call Rust backend server-to-server
    const res = await rustInternal(`/internal/keys/${prefix}`, {
      method: "DELETE",
    }, session.user.id);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Rust backend error:", res.status, errorText);
      return NextResponse.json(
        { error: "Failed to revoke key." },
        { status: res.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Keys DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
