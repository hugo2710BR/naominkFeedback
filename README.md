# naominkFeedback

Mural de feedback da **Naomink** (estúdio de tatuagens — Fineline · Realism
· Microrealism). Os clientes enviam a fotografia da tatuagem com nome +
mensagem e veem o mural com as fotos de todos. Inclui painel `/admin` para
moderação, limpeza de ficheiros órfãos e download em ZIP. Arquitetura
baseada no **WeddingDayWeb**.

## Design

O design vem de `Desktop/naominkFeedback-design` (protótipos HTML, tokens,
`COMPONENT_SPECS.md`). Direção escura e editorial, Fraunces (display,
itálico) + Jost (UI).

- Tokens: [src/styles/tokens.css](src/styles/tokens.css) (cópia de
  `naominkFeedback-design/tokens/tokens.css`), mapeados para classes
  Tailwind `nmk-*` em [tailwind.config.ts](tailwind.config.ts)
  (`bg-nmk-bg`, `text-nmk-text-muted`, `rounded-modal`, `font-display`…).
- Para mudar cores/raios, edita `tokens.css` — tudo o resto segue.
- Componentes partilhados de UI: `Spinner`, `Skeleton`, `SectionDivider`
  em `src/components/`.

Stack: **Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS**,
**Cloudflare R2** para as imagens e **Supabase Postgres** para os metadados.

> Porquê Next.js e não React "puro" (Vite)? Continua a ser React, mas o
> upload precisa de um servidor para gerar URLs assinados do R2 e para o
> admin (as credenciais nunca podem ir para o browser). O Next dá-nos isso
> com as API routes, no mesmo projeto e com deploy direto na Vercel.

## Arquitetura

```
src/
├── app/                      # Só routing do Next (fino): busca dados e renderiza o screen
│   ├── page.tsx              # → screens/Home
│   ├── admin/page.tsx        # → screens/Admin ou screens/AdminLogin
│   └── api/                  # API routes (presign, confirm, abort, admin/*)
├── screens/                  # Um screen por pasta
│   ├── Home/
│   │   ├── Home.tsx          # layout apenas
│   │   ├── useHome.ts        # lógica do layout
│   │   ├── Home.constants.ts
│   │   └── components/       # componentes só deste screen, cada um na sua pasta
│   │       ├── UploadSheet/{UploadSheet.tsx, useUploadSheet.ts}
│   │       ├── PhotoModal/{PhotoModal.tsx, usePhotoModal.ts}
│   │       └── ...
│   ├── Admin/{Admin.tsx, useAdmin.ts, components/}
│   └── AdminLogin/{AdminLogin.tsx, useAdminLogin.ts}
├── components/               # Componentes partilhados entre screens
├── hooks/                    # Hooks genéricos reutilizáveis (Escape, focus trap, scroll lock)
├── helpers/                  # Funções puras (validação, URLs, chaves, imagem, formatação)
├── services/
│   ├── api/                  # Chamadas do browser às nossas API routes
│   └── server/               # Só servidor ("server-only"): R2, Supabase, auth, queries
├── config/                   # Conteúdo do site (site.ts) e limites de upload
└── types/index.ts            # Types partilhados transversalmente
```

### Regras

1. **`.tsx` = layout apenas.** Nada de `useState`, `useEffect`, fetches ou
   handlers com lógica dentro do `.tsx` — só JSX, a ligar o que o hook devolve.
2. **`useX.ts` = lógica do layout.** Cada `.tsx` com lógica tem o seu hook
   ao lado, na mesma pasta (`UploadSheet.tsx` ↔ `useUploadSheet.ts`).
   Componentes sem lógica (ex. `Hero`, `Fab`) não precisam de hook.
3. **Screens** vivem em `src/screens/<NomeDoScreen>/`. Os componentes que só
   esse screen usa ficam em `src/screens/<Screen>/components/<Componente>/`.
4. **Helpers** em `src/helpers/` — funções puras, sem React.
5. **Types** usados em mais de um sítio vão para `src/types/index.ts`.
6. **Conteúdo** (marca, textos, imagem do hero) muda-se em `src/config/site.ts`.

## Fluxo de upload

```
Browser (comprime thumb 400px + web 1600px, guarda o original em memória)
  → POST /api/photos/presign   (gera 2–3 URLs assinados, 10 min)
  → PUT direto do browser para o R2
  → POST /api/photos/confirm   (HeadObject a cada chave, insere metadados no Postgres)
  ↳ em caso de falha a meio: POST /api/photos/abort (apaga só chaves órfãs)
```

## Segurança

- **Sessão do admin**: cookie `httpOnly` com token assinado (HMAC com a
  `ADMIN_PASSWORD`), validade de 8h verificada no servidor. Mudar a
  palavra-passe termina todas as sessões abertas.
- **Limite de pedidos por IP** ([src/config/rateLimits.ts](src/config/rateLimits.ts)),
  guardado no Postgres (tabela `rate_limits` + função `hit_rate_limit` em
  `setup.sql`), partilhado por todas as instâncias da Vercel:
  - envio de fotos: 15 por hora;
  - login do admin: 5 tentativas por 15 minutos.
  Os IPs são guardados só como hash. Se a BD não responder, o limitador
  deixa passar (nunca bloqueia clientes reais por avaria).

## Configuração

1. **Cloudflare R2**: cria um bucket, ativa acesso público com domínio
   personalizado (`R2_PUBLIC_URL`) e cria um API Token com leitura+escrita
   só nesse bucket. Configura CORS no bucket a permitir `PUT` a partir do
   domínio do site (e `http://localhost:3000` em dev).
2. **Supabase**: cria um projeto e corre [`supabase/setup.sql`](supabase/setup.sql)
   no SQL Editor.
3. **Variáveis**: `cp .env.example .env.local` e preenche (ver comentários
   no ficheiro).

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

## Deploy (Vercel)

Importa o repositório na Vercel, adiciona todas as variáveis de
`.env.example` (Production + Preview) e faz deploy.
