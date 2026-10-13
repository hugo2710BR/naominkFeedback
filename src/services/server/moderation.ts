import "server-only";
import type { ModerationMode } from "@/types";

export function moderationMode(): ModerationMode {
  return process.env.MODERATION_MODE === "manual" ? "manual" : "auto";
}

export function isAutoApproved(): boolean {
  return moderationMode() === "auto";
}

export function keepOriginals(): boolean {
  return process.env.KEEP_ORIGINALS !== "false";
}
