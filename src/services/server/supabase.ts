import "server-only";
import { createClient } from "@supabase/supabase-js";
import { noStoreFetch } from "@/helpers/http";

/**
 * Cliente service-role. Nunca importar em client components — o guard
 * "server-only" rebenta o build se isso acontecer.
 */
export function createServiceSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não estão definidas.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: noStoreFetch },
  });
}

/** Cliente anon (só lê fotos aprovadas, por RLS). Null se faltar configuração. */
export function createAnonSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;

  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { fetch: noStoreFetch },
  });
}
