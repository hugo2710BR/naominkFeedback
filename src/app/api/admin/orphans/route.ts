import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/services/server/adminAuth";
import { deleteOrphanKeys } from "@/services/server/orphanCleanup";

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const keys: string[] = Array.isArray(body?.keys)
    ? body.keys.filter((k: unknown): k is string => typeof k === "string")
    : [];

  if (keys.length === 0) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const deleted = await deleteOrphanKeys(keys);
  return NextResponse.json({ deleted });
}
