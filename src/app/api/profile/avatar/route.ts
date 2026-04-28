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

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const fileExtension = file.name.split('.').pop() || 'png';
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

