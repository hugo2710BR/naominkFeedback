import type { PhotoKeys } from "@/types";

const KEY_PREFIX = "photos/";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const PHOTO_KEY_PATTERN = /^photos\/([0-9a-f-]{36})_(thumb|web|original)\.[a-z0-9]+$/i;

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/gif": "gif",
};

export function isValidUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function isValidPhotoKey(key: string): boolean {
  return PHOTO_KEY_PATTERN.test(key);
}

export function extensionFromContentType(contentType: string | null | undefined): string {
  if (!contentType) return "bin";
  return EXTENSION_BY_CONTENT_TYPE[contentType.toLowerCase()] ?? "bin";
}

export function buildPhotoKeys(uuid: string, originalContentType: string | null): PhotoKeys {
  return {
    thumbKey: `${KEY_PREFIX}${uuid}_thumb.jpg`,
    webKey: `${KEY_PREFIX}${uuid}_web.jpg`,
    originalKey: originalContentType
      ? `${KEY_PREFIX}${uuid}_original.${extensionFromContentType(originalContentType)}`
      : null,
  };
}
