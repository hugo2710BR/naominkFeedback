import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH } from "@/config/uploadLimits";
import type { ValidatedFields, ValidationResult } from "@/types";

const CONTROL_CHARS_PATTERN = new RegExp("[\\u0000-\\u001F\\u007F]", "g");

/** Remove tags HTML e carateres de controlo, colapsa espaços. */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(CONTROL_CHARS_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateFields(
  rawName: unknown,
  rawMessage: unknown
): ValidationResult<ValidatedFields> {
  const name = typeof rawName === "string" ? sanitizeText(rawName).slice(0, MAX_NAME_LENGTH) : "";
  if (name.length === 0) {
    return { ok: false, error: "O nome é obrigatório." };
  }

  let message: string | null = null;
  if (typeof rawMessage === "string" && sanitizeText(rawMessage).length > 0) {
    message = sanitizeText(rawMessage).slice(0, MAX_MESSAGE_LENGTH);
  }

  return { ok: true, data: { name, message } };
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || /\.hei[cf]$/i.test(file.name);
}
