import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust to wherever your authOptions file lives
import { prisma } from "@/lib/prisma";
import { uploadProfileImage, type ProfileImageType } from "@/lib/cloudinary";

export const runtime = "nodejs"; // the Cloudinary SDK needs Node APIs

const MAX_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request body limit
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const isImageType = (value: unknown): value is ProfileImageType =>
  value === "avatar" || value === "cover";

export async function POST(req: Request) {
  // The user id always comes from the session, never from the client
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "You need to sign in first." },
      { status: 401 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const type = form.get("type");

  if (!isImageType(type)) {
    return NextResponse.json({ error: "Unknown image type." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Use a JPG, PNG or WebP image." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 4 MB or smaller." },
      { status: 413 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadProfileImage(buffer, type, userId);

    await prisma.user.update({
      where: { id: userId },
      data:
        type === "avatar"
          ? { image: result.secure_url }
          : { coverImage: result.secure_url },
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Profile image upload failed", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}
