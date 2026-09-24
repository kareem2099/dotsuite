import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal, parseRustError } from "@/lib/rust-api";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call Rust backend server-to-server
    const res = await rustInternal("/internal/keys", {
      method: "GET",
    }, session.user.id);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Rust backend error:", res.status, errorText);
      return NextResponse.json(
        { error: parseRustError(errorText, "Failed to fetch keys") },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Keys GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { label, scopes, expires_in_days } = await req.json();

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
    const res = await rustInternal("/internal/keys/generate", {
      method: "POST",
      body: JSON.stringify({
        label: label.trim(),
        scopes: Array.isArray(scopes) ? scopes : undefined,
        expires_in_days: typeof expires_in_days === "number" ? expires_in_days : undefined,
      }),
    }, session.user.id);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Rust backend error:", res.status, errorText);
      
      const errorMessage = parseRustError(errorText, "Failed to generate key.");

      return NextResponse.json(
        { error: errorMessage },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Keys POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
