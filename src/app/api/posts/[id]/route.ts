import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustProxy } from "@/lib/rust-api";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const res = await rustProxy(`/v1/posts/${id}`, { method: "DELETE" }, session.user.id);

    if (!res.ok) {
      const text = await res.text();
      console.error("Rust posts DELETE error:", res.status, text);
      return NextResponse.json({ error: "Failed to cancel post" }, { status: res.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Posts DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
