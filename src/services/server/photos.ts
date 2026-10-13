import "server-only";
import { createAnonSupabaseClient, createServiceSupabaseClient } from "@/services/server/supabase";
import { listOrphanGroups } from "@/services/server/orphanCleanup";
import type { AdminData, Photo } from "@/types";

export const PHOTO_COLUMNS =
  "id, name, message, thumb_key, web_key, original_key, approved, created_at";

export async function getApprovedPhotos(): Promise<Photo[]> {
  const supabase = createAnonSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("photos")
    .select(PHOTO_COLUMNS)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Falha ao carregar fotos:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAdminData(): Promise<AdminData> {
  try {
    const supabase = createServiceSupabaseClient();
    const byApproval = (approved: boolean) =>
      supabase
        .from("photos")
        .select(PHOTO_COLUMNS)
        .eq("approved", approved)
        .order("created_at", { ascending: false });

    const [{ data: pending }, { data: approved }, orphanGroups] = await Promise.all([
      byApproval(false),
      byApproval(true),
      listOrphanGroups(),
    ]);

    return {
      pendingPhotos: pending ?? [],
      approvedPhotos: approved ?? [],
      orphanGroups,
    };
  } catch (err) {
    console.error("Falha ao carregar dados do admin:", err);
    return { pendingPhotos: [], approvedPhotos: [], orphanGroups: [] };
  }
}
