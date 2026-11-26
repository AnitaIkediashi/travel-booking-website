import {
  v2 as cloudinary,
  type UploadApiResponse,
  type TransformationOptions,
} from "cloudinary";

cloudinary.config({ secure: true });

export type ProfileImageType = "avatar" | "cover";

// Incoming transformations: Cloudinary stores the resized version only,
// so you don't pay storage for a 10 MB original.
const PRESETS: Record<
  ProfileImageType,
  { folder: string; transformation: TransformationOptions }
> = {
  avatar: {
    folder: "globe/avatars",
    transformation: [
      { width: 512, height: 512, crop: "fill", gravity: "face" },
      { quality: "auto" },
    ],
  },
  cover: {
    folder: "globe/covers",
    transformation: [
      { width: 1920, height: 700, crop: "fill", gravity: "auto" },
      { quality: "auto" },
    ],
  },
};

/**
 * The public_id is the user's id, so re-uploading overwrites the previous
 * image. No orphaned files, and no need to store public ids in the DB.
 */
export function uploadProfileImage(
  buffer: Buffer,
  type: ProfileImageType,
  userId: string,
) {
  const { folder, transformation } = PRESETS[type];

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: userId,
          overwrite: true,
          invalidate: true,
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          transformation,
        },
        (error, result) => {
          if (error || !result)
            return reject(error ?? new Error("Upload failed"));
          resolve(result);
        },
      )
      .end(buffer);
  });
}
