/**
 * O Next.js altera o fetch() global para cachear pedidos durante o render
 * de Server Components — incluindo os feitos internamente por bibliotecas
 * como o supabase-js. Sem isto, uma resposta cacheada (ex.: lista vazia
 * antes de alguém enviar fotos) pode ficar presa em `.next/cache`. Passar
 * isto como `global.fetch` do cliente força todos os pedidos a ignorar a cache.
 */
export function noStoreFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, { ...init, cache: "no-store" });
}

export async function postJson<T>(url: string, body: unknown): Promise<{ ok: boolean; data: T | null }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as T | null;
  return { ok: res.ok, data };
}
