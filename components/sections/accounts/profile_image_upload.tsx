"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ImageType = "avatar" | "cover";

const ACCEPT = "image/jpeg,image/png,image/webp";
const ALLOWED_TYPES = ACCEPT.split(",");
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Picks a file, shows an instant preview, uploads it, and rolls back to the
 * previous image if the upload fails.
 *
 * There are no refs and no <input> to render: `open()` creates a temporary
 * file input inside the click handler. Fall back to the saved image from the
 * user object when `url` is undefined.
 */
export function useProfileImageUpload(
  type: ImageType,
  onError: (message: string) => void,
) {
  const router = useRouter();
  const [url, setUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return onError("Use a JPG, PNG or WebP image.");
    }
    if (file.size > MAX_BYTES) {
      return onError("Image must be 4 MB or smaller.");
    }

    const previous = url;
    const previewUrl = URL.createObjectURL(file);
    setUrl(previewUrl);
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("type", type);

      const res = await fetch("/api/cloudinary", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");

      setUrl(data.url);
      router.refresh(); // re-run server components that read the session
    } catch (err) {
      setUrl(previous);
      onError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploading(false);
    }
  };

  const open = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ACCEPT;
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) void upload(file);
    };
    input.click();
  };

  return { url, open, uploading };
}
