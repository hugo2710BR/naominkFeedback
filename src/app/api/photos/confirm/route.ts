import { NextResponse } from "next/server";
import { deleteObjects, headObject } from "@/services/server/r2";
import { createServiceSupabaseClient } from "@/services/server/supabase";
import { isAutoApproved } from "@/services/server/moderation";
import { PHOTO_COLUMNS } from "@/services/server/photos";
import { isValidPhotoKey, isValidUuid } from "@/helpers/photoKeys";
import { validateFields } from "@/helpers/validation";
import { MAX_ORIGINAL_BYTES, MAX_THUMB_BYTES, MAX_WEB_BYTES } from "@/config/uploadLimits";
import type { PublishResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const uuid = typeof body.uuid === "string" ? body.uuid : "";
  const thumbKey = typeof body.thumbKey === "string" ? body.thumbKey : "";
  const webKey = typeof body.webKey === "string" ? body.webKey : "";
  const originalKey = typeof body.originalKey === "string" ? body.originalKey : null;

  if (
    !isValidUuid(uuid) ||
    !isValidPhotoKey(thumbKey) ||
    !isValidPhotoKey(webKey) ||
    !thumbKey.includes(uuid) ||
    !webKey.includes(uuid) ||
    (originalKey && (!isValidPhotoKey(originalKey) || !originalKey.includes(uuid)))
  ) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const fields = validateFields(body.name, body.message);
  if (!fields.ok) {
    return NextResponse.json({ error: fields.error }, { status: 400 });
  }
  const { name, message } = fields.data;

  const uploadedKeys = [thumbKey, webKey, ...(originalKey ? [originalKey] : [])];

  async function cleanupAndReject(error: string) {
    await deleteObjects(uploadedKeys).catch(() => {});
    return NextResponse.json({ error }, { status: 400 });
  }

  // Confirma que os uploads presignados aconteceram mesmo e com tamanhos
  // dentro do acordado — a assinatura autoriza a escrita, isto só confirma
  // que foi usada corretamente antes de confiar nos metadados do browser.
  const [thumbInfo, webInfo, originalInfo] = await Promise.all([
    headObject(thumbKey),
    headObject(webKey),
    originalKey ? headObject(originalKey) : Promise.resolve(null),
  ]);

  if (!thumbInfo || thumbInfo.contentLength > MAX_THUMB_BYTES) {
    return cleanupAndReject("O envio da miniatura falhou. Tenta novamente.");
  }
  if (!webInfo || webInfo.contentLength > MAX_WEB_BYTES) {
    return cleanupAndReject("O envio da imagem falhou. Tenta novamente.");
  }
  if (originalKey && (!originalInfo || originalInfo.contentLength > MAX_ORIGINAL_BYTES)) {
    return cleanupAndReject("O envio da foto original falhou. Tenta novamente.");
  }

  const approved = isAutoApproved();

  try {
    const supabase = createServiceSupabaseClient();
    const { data: inserted, error: insertError } = await supabase
      .from("photos")
      .insert({
        name,
        message,
        thumb_key: thumbKey,
        web_key: webKey,
        original_key: originalKey,
        approved,
      })
      .select(PHOTO_COLUMNS)
      .single();

    if (insertError) {
      console.error("Erro ao registar foto:", insertError.message);
      await deleteObjects(uploadedKeys).catch(() => {});
      return NextResponse.json(
        { error: "Não foi possível publicar a foto. Tenta novamente." },
        { status: 502 }
      );
    }

    const response: PublishResponse = approved
      ? { photo: inserted, pending: false }
      : { photo: null, pending: true };
    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("Erro inesperado ao confirmar foto:", err);
    await deleteObjects(uploadedKeys).catch(() => {});
    return NextResponse.json(
      { error: "Ocorreu um erro inesperado. Tenta novamente." },
      { status: 500 }
    );
  }
}
