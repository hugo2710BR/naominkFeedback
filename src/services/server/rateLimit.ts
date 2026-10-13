import "server-only";
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { RATE_LIMIT_MESSAGES, RATE_LIMITS } from "@/config/rateLimits";
import { createServiceSupabaseClient } from "@/services/server/supabase";
import type { RateLimitScope } from "@/types";

/** IP do cliente. Na Vercel, o primeiro valor de x-forwarded-for é definido pela plataforma. */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Hash com segredo do servidor: o IP nunca é guardado em claro (RGPD). */
function hashIp(ip: string): string {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createHmac("sha256", salt).update(ip).digest("hex").slice(0, 32);
}

/**
 * Regista um pedido e devolve true se estiver dentro do limite.
 * Falha em modo aberto (deixa passar) se a BD não responder — um problema
 * no limitador nunca deve impedir clientes reais de enviar fotos.
 */
async function isWithinRateLimit(request: Request, scope: RateLimitScope): Promise<boolean> {
  const rule = RATE_LIMITS[scope];
  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase.rpc("hit_rate_limit", {
      p_key: `${scope}:${hashIp(getClientIp(request))}`,
      p_limit: rule.limit,
      p_window_seconds: rule.windowSeconds,
    });
    if (error) throw error;
    return data !== false;
  } catch (err) {
    console.error(`Rate limit indisponível (${scope}) — pedido deixado passar:`, err);
    return true;
  }
}

/** Devolve uma resposta 429 pronta a enviar se o limite foi excedido, ou null se pode continuar. */
export async function enforceRateLimit(
  request: Request,
  scope: RateLimitScope
): Promise<NextResponse | null> {
  if (await isWithinRateLimit(request, scope)) return null;

  return NextResponse.json(
    { error: RATE_LIMIT_MESSAGES[scope] },
    {
      status: 429,
      headers: { "Retry-After": String(RATE_LIMITS[scope].windowSeconds) },
    }
  );
}
