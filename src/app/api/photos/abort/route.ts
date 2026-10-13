import { NextResponse } from "next/server";
import { deleteOrphanKeys } from "@/services/server/orphanCleanup";
import { enforceRateLimit } from "@/services/server/rateLimit";

export const runtime = "nodejs";

/**
 * Limpeza best-effort chamada pelo browser quando um envio falha a meio.
 * Seguro sem auth de admin: só apaga chaves que ainda não estão
 * referenciadas por nenhuma linha de `photos`.
 */
export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, "upload-abort");
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const keys: string[] = Array.isArray(body?.keys)
    ? body.keys.filter((k: unknown): k is string => typeof k === "string")
    : [];

  if (keys.length === 0) {
    return NextResponse.json({ deleted: [] });
  }

  try {
    const deleted = await deleteOrphanKeys(keys);
    return NextResponse.json({ deleted });
  } catch (err) {
    console.error("Falha ao limpar upload interrompido:", err);
    return NextResponse.json({ deleted: [] });
  }
}
