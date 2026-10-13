import "server-only";
import { createServiceSupabaseClient } from "@/services/server/supabase";
import { deleteObjects, listObjects } from "@/services/server/r2";
import { isValidPhotoKey, PHOTO_KEY_PATTERN } from "@/helpers/photoKeys";
import type { OrphanGroup } from "@/types";

async function getKnownKeys(): Promise<Set<string>> {
  const supabase = createServiceSupabaseClient();
  const { data } = await supabase.from("photos").select("thumb_key, web_key, original_key");

  const known = new Set<string>();
  for (const row of data ?? []) {
    if (row.thumb_key) known.add(row.thumb_key);
    if (row.web_key) known.add(row.web_key);
    if (row.original_key) known.add(row.original_key);
  }
  return known;
}

/**
 * Objetos no bucket (em photos/) que nenhuma linha de `photos` referencia —
 * restos de envios em que o PUT para o R2 correu bem mas o
 * /api/photos/confirm nunca chegou a correr.
 */
export async function listOrphanGroups(): Promise<OrphanGroup[]> {
  const [objects, known] = await Promise.all([listObjects("photos/"), getKnownKeys()]);
  const groups = new Map<string, OrphanGroup>();

  for (const obj of objects) {
    if (!obj.Key || known.has(obj.Key)) continue;
    const match = obj.Key.match(PHOTO_KEY_PATTERN);
    if (!match) continue;

    const uuid = match[1];
    const lastModified = obj.LastModified?.toISOString() ?? "";
    const group = groups.get(uuid) ?? { uuid, keys: [], totalSize: 0, lastModified };

    group.keys.push(obj.Key);
    group.totalSize += obj.Size ?? 0;
    if (lastModified > group.lastModified) group.lastModified = lastModified;

    groups.set(uuid, group);
  }

  return [...groups.values()].sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1));
}

/**
 * Apaga do R2 apenas as chaves que NÃO estão referenciadas por nenhuma
 * linha de `photos` — os objetos de uma foto publicada nunca são tocados.
 */
export async function deleteOrphanKeys(keys: string[]): Promise<string[]> {
  const known = await getKnownKeys();
  const safeToDelete = keys.filter((key) => isValidPhotoKey(key) && !known.has(key));
  if (safeToDelete.length > 0) {
    await deleteObjects(safeToDelete);
  }
  return safeToDelete;
}
