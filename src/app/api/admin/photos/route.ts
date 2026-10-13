import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/services/server/adminAuth";
import { createServiceSupabaseClient } from "@/services/server/supabase";
import { deleteObjects } from "@/services/server/r2";

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
  const action = body?.action === "approve" || body?.action === "reject" ? body.action : null;

  if (!id || !action) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();

  if (action === "approve") {
    const { error } = await supabase.from("photos").update({ approved: true }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select("thumb_key, web_key, original_key")
    .eq("id", id)
    .single();

  if (fetchError || !photo) {
    return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });
  }

  await deleteObjects(
    [photo.thumb_key, photo.web_key, photo.original_key].filter((key): key is string => !!key)
  );

  const { error: deleteError } = await supabase.from("photos").delete().eq("id", id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
