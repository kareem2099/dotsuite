import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

// 🛡️ Allowed image types: MIME type → allowed extensions + magic bytes (file signature)
// Magic bytes allow us to verify the actual file content, not just the client-supplied MIME type
const ALLOWED_IMAGE_TYPES: Record<string, { extensions: string[]; magic: number[][] }> = {
  "image/jpeg": {
    extensions: ["jpg", "jpeg"],
    magic: [[0xff, 0xd8, 0xff]], // JPEG signature
  },
  "image/png": {
    extensions: ["png"],
    magic: [[0x89, 0x50, 0x4e, 0x47]], // PNG signature
  },
  "image/webp": {
    extensions: ["webp"],
    magic: [[0x52, 0x49, 0x46, 0x46]], // RIFF (WebP)
  },
  "image/gif": {
    extensions: ["gif"],
    magic: [[0x47, 0x49, 0x46, 0x38]], // GIF8
  },
};

/**
 * Validates a file buffer against known magic bytes for the claimed MIME type.
 * This prevents attackers from renaming a malicious file to bypass type checks.
 */
function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const typeConfig = ALLOWED_IMAGE_TYPES[mimeType];
  if (!typeConfig) return false;

  return typeConfig.magic.some((signature) =>
    signature.every((byte, index) => buffer[index] === byte)
  );
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. 🛡️ Check MIME type against strict allowlist (not just startsWith "image/")
    if (!ALLOWED_IMAGE_TYPES[file.type]) {
      return NextResponse.json(
        { error: "Unsupported file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 2. 🛡️ Validate magic bytes — verify actual file content matches claimed type
    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "File content does not match its type. Upload rejected." },
        { status: 400 }
      );
    }

    // 3. 🛡️ Use only allowed extension from whitelist, never trust file.name
    const allowedExtensions = ALLOWED_IMAGE_TYPES[file.type].extensions;
    const fileExtension = allowedExtensions[0]; // Use the canonical extension for this MIME type
    const fileKey = `dotsuite/avatars/${crypto.randomUUID()}.${fileExtension}`;

    const bucketName = process.env.R2_BUCKET_NAME || "";
    const publicUrl = process.env.R2_PUBLIC_URL || "";

    if (!bucketName || !publicUrl) {
      console.error("Missing R2 Configuration");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    await connectDB();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const oldImageUrl = currentUser.image;

    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    });
    await s3Client.send(putCommand);

    const imageUrl = `${publicUrl.replace(/\/$/, "")}/${fileKey}`;

    await User.findOneAndUpdate(
      { email: session.user.email },
      { image: imageUrl }
    );

    const basePublicUrl = publicUrl.replace(/\/$/, "");
    if (oldImageUrl && oldImageUrl.startsWith(basePublicUrl)) {
      try {
        const oldKey = oldImageUrl.replace(`${basePublicUrl}/`, "");
        
        const deleteCommand = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: oldKey,
        });
        await s3Client.send(deleteCommand);
        console.log(`Successfully deleted old avatar: ${oldKey}`);
      } catch (deleteError) {
        console.error("Failed to delete old avatar from R2:", deleteError);
      }
    }

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
