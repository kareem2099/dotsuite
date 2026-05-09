import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal } from "@/lib/rust-api";

export async function GET(req: Request) {
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
      return NextResponse.json({ error: "Failed to fetch keys" }, { status: res.status });
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

    const { label } = await req.json();

    if (!label || typeof label !== "string") {
      return NextResponse.json({ error: "Invalid label" }, { status: 400 });
    }

    // Call Rust backend server-to-server
    const res = await rustInternal("/internal/keys/generate", {
      method: "POST",
      body: JSON.stringify({
        label,
      }),
    }, session.user.id);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Rust backend error:", res.status, errorText);
      return NextResponse.json(
        { error: "Failed to generate key. You might have reached the maximum limit." },
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
