import imageCompression from "browser-image-compression";
import type { ImageVariants } from "@/types";

const HEIC_TYPES = ["image/heic", "image/heif"];

function isHeic(file: File): boolean {
  return HEIC_TYPES.includes(file.type) || /\.hei[cf]$/i.test(file.name);
}

async function toViewableSource(file: File): Promise<File | Blob> {
  if (!isHeic(file)) return file;

  try {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    return Array.isArray(converted) ? converted[0] : converted;
  } catch {
    throw new Error(
      "Não foi possível converter esta foto HEIC. Tenta exportá-la como JPG ou PNG e envia novamente."
    );
  }
}

/**
 * Produz as variantes a enviar para o R2 a partir do ficheiro escolhido:
 * - thumb: 400px, alvo ~60KB — usada na grelha
 * - web: 1600px, alvo ~500KB — usada no modal / botão "Transferir"
 * - original: bytes intactos (mesmo HEIC) — só é enviada se a resposta do
 *   presign oferecer um slot "original" (o servidor controla isto via
 *   KEEP_ORIGINALS; nunca é mostrada, só entra no ZIP do admin).
 */
export async function prepareImageVariants(file: File): Promise<ImageVariants> {
  const viewableSource = await toViewableSource(file);

  try {
    const [thumbBlob, webBlob] = await Promise.all([
      imageCompression(viewableSource as File, {
        maxSizeMB: 0.06,
        maxWidthOrHeight: 400,
        useWebWorker: true,
        fileType: "image/jpeg",
        initialQuality: 0.7,
      }),
      imageCompression(viewableSource as File, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        fileType: "image/jpeg",
        initialQuality: 0.8,
      }),
    ]);

    return {
      thumb: new File([thumbBlob], "thumb.jpg", { type: "image/jpeg" }),
      web: new File([webBlob], "web.jpg", { type: "image/jpeg" }),
      original: new File([file], file.name || "original", {
        type: file.type || "application/octet-stream",
      }),
    };
  } catch {
    throw new Error("Não foi possível preparar esta imagem. Tenta outra foto.");
  }
}
