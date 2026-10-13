import { CACHE_CONTROL_IMMUTABLE } from "@/config/uploadLimits";
import { postJson } from "@/helpers/http";
import type {
  ConfirmRequest,
  PresignRequest,
  PresignResponse,
  PresignedSlot,
  PublishResponse,
} from "@/types";

type ApiError = { error?: string };

export function requestPresign(body: PresignRequest) {
  return postJson<PresignResponse & ApiError>("/api/photos/presign", body);
}

export function confirmUpload(body: ConfirmRequest) {
  return postJson<PublishResponse & ApiError>("/api/photos/confirm", body);
}

export async function putToR2(slot: PresignedSlot, file: Blob, contentType: string): Promise<void> {
  const res = await fetch(slot.url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Cache-Control": CACHE_CONTROL_IMMUTABLE,
    },
    body: file,
  });
  if (!res.ok) {
    throw new Error("Falha no envio da foto para o armazenamento.");
  }
}

/**
 * Limpeza best-effort quando um envio falha a meio (ex.: thumb sobe para
 * o R2, web falha). Sem isto, os uploads que correram bem ficariam órfãos
 * no bucket, sem nenhuma linha na BD a referenciá-los.
 */
export async function abortUpload(presign: PresignResponse): Promise<void> {
  const keys = [presign.thumb.key, presign.web.key, presign.original?.key].filter(
    (key): key is string => !!key
  );
  try {
    await postJson("/api/photos/abort", { keys });
  } catch {
    // Best effort — não há mais nada a fazer no browser.
  }
}
