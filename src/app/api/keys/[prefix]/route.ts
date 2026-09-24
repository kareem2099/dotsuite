import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal, parseRustError } from "@/lib/rust-api";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ prefix: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prefix } = await params;
    const { label } = await req.json();

    if (!prefix || typeof prefix !== "string") {
      return NextResponse.json({ error: "Invalid prefix" }, { status: 400 });
    }

    if (
      typeof label !== "string" ||
      !label.trim() ||
      label.trim().length > 100
    ) {
      return NextResponse.json(
        { error: "Key label must be between 1 and 100 characters" },
        { status: 400 }
      );
    }

    // Call Rust backend server-to-server
    const res = await rustInternal(`/internal/keys/${prefix}`, {
      method: "PATCH",
      body: JSON.stringify({ label: label.trim() }),
    }, session.user.id);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Rust backend error:", res.status, errorText);
      return NextResponse.json(
        { error: parseRustError(errorText, "Failed to update key label.") },
        { status: res.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Keys PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
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
        { error: parseRustError(errorText, "Failed to revoke key.") },
        { status: res.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Keys DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
