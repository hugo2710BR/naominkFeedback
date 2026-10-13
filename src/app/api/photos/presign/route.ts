import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getPresignedPutUrl } from "@/services/server/r2";
import { keepOriginals } from "@/services/server/moderation";
import { enforceRateLimit } from "@/services/server/rateLimit";
import { buildPhotoKeys } from "@/helpers/photoKeys";
import { MAX_ORIGINAL_BYTES, MAX_THUMB_BYTES, MAX_WEB_BYTES } from "@/config/uploadLimits";
import type { PresignResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, "upload");
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const originalContentType =
    typeof body.originalContentType === "string" ? body.originalContentType : null;
  const thumbSize = Number(body.thumbSize);
  const webSize = Number(body.webSize);
  const originalSize = Number(body.originalSize);

  if (body.thumbContentType !== "image/jpeg" || body.webContentType !== "image/jpeg") {
    return NextResponse.json({ error: "Tipo de imagem inválido." }, { status: 400 });
  }
  if (!(thumbSize > 0) || thumbSize > MAX_THUMB_BYTES) {
    return NextResponse.json({ error: "Miniatura da foto inválida." }, { status: 400 });
  }
  if (!(webSize > 0) || webSize > MAX_WEB_BYTES) {
    return NextResponse.json({ error: "Imagem demasiado grande." }, { status: 400 });
  }
  if (originalSize && originalSize > MAX_ORIGINAL_BYTES) {
    return NextResponse.json({ error: "A foto original é demasiado grande." }, { status: 400 });
  }

  try {
    const uuid = randomUUID();
    const useOriginal = keepOriginals() && !!originalContentType && originalSize > 0;
    const keys = buildPhotoKeys(uuid, useOriginal ? originalContentType : null);

    const [thumbUrl, webUrl, originalUrl] = await Promise.all([
      getPresignedPutUrl(keys.thumbKey, "image/jpeg"),
      getPresignedPutUrl(keys.webKey, "image/jpeg"),
      keys.originalKey && originalContentType
        ? getPresignedPutUrl(keys.originalKey, originalContentType)
        : Promise.resolve(null),
    ]);

    const response: PresignResponse = {
      uuid,
      thumb: { url: thumbUrl, key: keys.thumbKey },
      web: { url: webUrl, key: keys.webKey },
      original: keys.originalKey && originalUrl ? { url: originalUrl, key: keys.originalKey } : null,
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("Erro ao gerar URLs assinados:", err);
    return NextResponse.json(
      { error: "Não foi possível iniciar o envio. Tenta novamente." },
      { status: 500 }
    );
  }
}
