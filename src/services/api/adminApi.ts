import { postJson } from "@/helpers/http";
import type { ModerationAction } from "@/types";

/** Devolve null em caso de sucesso, ou a mensagem de erro a mostrar. */
export async function login(password: string): Promise<string | null> {
  const { ok, data } = await postJson<{ error?: string }>("/api/admin/login", { password });
  if (ok) return null;
  return data?.error ?? "Palavra-passe incorreta. Tenta novamente.";
}

export async function logout(): Promise<void> {
  await fetch("/api/admin/login", { method: "DELETE" });
}

export async function moderatePhoto(id: string, action: ModerationAction): Promise<boolean> {
  const { ok } = await postJson("/api/admin/photos", { id, action });
  return ok;
}

export async function deleteOrphans(keys: string[]): Promise<boolean> {
  const { ok } = await postJson("/api/admin/orphans", { keys });
  return ok;
}

export const DOWNLOAD_ZIP_URL = "/api/admin/download-zip";
