-- Schema e políticas RLS da tabela de fotos.
-- Corre este ficheiro uma vez no Supabase SQL editor (Project > SQL Editor > New query).
-- As imagens vivem no Cloudflare R2; aqui guardam-se só os metadados.

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text,
  thumb_key text not null,
  web_key text not null,
  original_key text,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists photos_approved_created_at_idx
  on public.photos (approved, created_at desc);

create index if not exists photos_thumb_key_idx on public.photos (thumb_key);

alter table public.photos enable row level security;

-- O público (anon) só pode ler fotos aprovadas. Todas as escritas passam
-- pelas API routes do Next.js com a service role key, que ignora o RLS —
-- não há políticas de insert/update/delete de propósito.
drop policy if exists "Public can read approved photos" on public.photos;
create policy "Public can read approved photos"
  on public.photos
  for select
  to anon, authenticated
  using (approved = true);

-- Rate limiting ---------------------------------------------------------
-- Contadores por janela fixa, partilhados por todas as instâncias da
-- Vercel (um limitador em memória seria por instância e fácil de contornar).
-- A chave é `<âmbito>:<hash do IP>` — nunca se guarda o IP em claro.

create table if not exists public.rate_limits (
  key text primary key,
  count integer not null,
  window_start timestamptz not null
);

-- Sem políticas: só a service role (API routes) lê/escreve.
alter table public.rate_limits enable row level security;

-- Regista um pedido e devolve true se ainda estiver dentro do limite.
-- O upsert é atómico, por isso pedidos em paralelo não escapam à contagem.
create or replace function public.hit_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_window interval := make_interval(secs => p_window_seconds);
begin
  insert into public.rate_limits as r (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update set
    count = case when r.window_start < now() - v_window then 1 else r.count + 1 end,
    window_start = case when r.window_start < now() - v_window then now() else r.window_start end
  returning count into v_count;

  -- Limpeza ocasional de janelas antigas para a tabela não crescer.
  if random() < 0.01 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_count <= p_limit;
end;
$$;

revoke execute on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, integer, integer) to service_role;
