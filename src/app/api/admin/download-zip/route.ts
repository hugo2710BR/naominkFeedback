import { ZipArchive } from "archiver";
import { Readable } from "stream";
import { isAdminAuthed } from "@/services/server/adminAuth";
import { createServiceSupabaseClient } from "@/services/server/supabase";
import { getObjectStream } from "@/services/server/r2";
import { formatDateTime } from "@/helpers/format";
import { SITE } from "@/config/site";

export const runtime = "nodejs";

function sanitizeFilenamePart(value: string): string {
  return value.replace(/[^a-z0-9-_ ]/gi, "").trim().slice(0, 40) || "foto";
}

function buildMessagesTxt(
  photos: { name: string; message: string | null; created_at: string }[]
): string {
  return photos
    .map((p) => `${p.name} (${formatDateTime(p.created_at)})\n${p.message?.trim() || "(sem mensagem)"}\n`)
    .join("\n---\n\n");
}

function jsonError(error: string, status: number) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return jsonError("Não autorizado.", 401);
  }

  const supabase = createServiceSupabaseClient();
  const { data: photos, error } = await supabase
    .from("photos")
    .select("id, name, message, thumb_key, web_key, original_key, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return jsonError(error.message, 500);
  }

  const archive = new ZipArchive({ zlib: { level: 9 } });
  archive.on("warning", (err) => console.warn("Aviso no ZIP:", err));
  archive.on("error", (err) => console.error("Erro no ZIP:", err));

  const usedNames = new Set<string>();

  (async () => {
    for (const photo of photos ?? []) {
      const key = photo.original_key ?? photo.web_key ?? photo.thumb_key;
      if (!key) continue;

      try {
        const stream = await getObjectStream(key);
        if (!stream) continue;

        const ext = key.includes(".") ? key.split(".").pop() : "jpg";
        const base = sanitizeFilenamePart(photo.name);
        let filename = `${base}-${photo.id.slice(0, 8)}.${ext}`;
        while (usedNames.has(filename)) {
          filename = `${base}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
        }
        usedNames.add(filename);

        archive.append(stream, { name: filename });
      } catch (err) {
        console.error(`Falha ao incluir a foto ${photo.id} no ZIP:`, err);
      }
    }

    archive.append(buildMessagesTxt(photos ?? []), { name: "mensagens.txt" });
    archive.finalize();
  })().catch((err) => console.error("Falha ao construir o ZIP:", err));

  return new Response(Readable.toWeb(archive) as ReadableStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${SITE.zipFilename}"`,
    },
  });
}
