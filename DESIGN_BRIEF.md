# Design brief: naominkFeedback

> Brief para criar o design do site. O resultado vai ser implementado em
> código (Next.js + React + Tailwind), por isso as secções "Restrições" e
> "Formato da entrega" são importantes.

---

## 1. O que é o projeto

Site **mobile-first** e de página única. Os visitantes:

1. Veem um **hero** com uma foto de destaque e um título.
2. **Enviam fotos** com o seu nome e uma mensagem curta.
3. Veem o **mural** com as fotos de todos, numa grelha estilo Instagram.
4. Abrem uma foto para ver o nome e a mensagem de quem a enviou e para a transferir.

Há também uma área privada, **`/admin`**, protegida por palavra-passe. Serve
para aprovar ou rejeitar fotos, apagar fotos, limpar ficheiros falhados e
transferir tudo num ZIP.

O site é acedido sobretudo **no telemóvel**, através de um link ou QR code.

---

## 2. O que quero que desenhes

> ✏️ **Preenche esta secção antes de enviar.**

- **Tema / marca / ocasião:** _(ex.: estúdio de tatuagens "Naomink", feedback de clientes…)_
- **Título e textos principais:** _(nome, subtítulo, data, local, frase de introdução, texto do botão)_
- **Ambiente / estilo pretendido:** _(ex.: minimalista, escuro, editorial, divertido…)_
- **Cores e tipografia:** _(se já tens marca, indica aqui; senão, deixa o designer propor)_
- **Imagem do hero:** _(anexar ou descrever)_
- **O que mudar em relação ao design atual:** _(o que manter e o que reinventar)_
- **Ecrãs ou estados novos que queiras:** _(opcional)_
- **Referências visuais:** _(links ou imagens)_

---

## 3. Ecrãs e estados existentes (a desenhar)

### Ecrã público: Home (`/`)

| # | Bloco | Descrição | Estados |
|---|---|---|---|
| 1 | **Splash de entrada** | Ecrã inteiro (~2 s) com o título animado; depois desvanece e revela o hero | Entrada → pausa → saída |
| 2 | **Hero** | Foto de fundo com gradiente por cima; data, linha divisória e título alinhados em baixo | — |
| 3 | **Intro + CTA** | 2–3 linhas de texto de introdução e botão principal "Adicionar as minhas fotos" | hover |
| 4 | **Separador de secção** | Linhas finas com uma label em maiúsculas ("Mural dos convidados") | — |
| 5 | **Mural (grelha)** | 3 colunas, tiles quadrados, gap mínimo. Os tiles sem foto mostram um padrão decorativo | Com fotos · vazio (só placeholders) · animação de entrada dos tiles |
| 6 | **Botão flutuante (FAB)** | Círculo fixo no canto inferior direito com "+" e o mesmo efeito do CTA | hover |
| 7 | **Modal de foto** | Overlay escuro e cartão centrado com a foto, o nome, a mensagem e o link "Transferir" | Normal · a transferir · placeholder (sem foto) |
| 8 | **Bottom sheet de upload** | Sobe do fundo e tem uma pega para arrastar e fechar. Contém a zona de escolha de foto, os campos de nome e de mensagem e os botões Publicar e Cancelar | Vazio · a preparar a foto · com pré-visualização · Publicar desativado · a publicar · erro |
| 9 | **Celebração** | Overlay de agradecimento após publicar ("Obrigado!" + ícone animado); fecha sozinho em ~3 s | Publicada · pendente de aprovação |

### Ecrãs privados

| # | Ecrã | Descrição | Estados |
|---|---|---|---|
| 10 | **Admin: Login** | Formulário simples com título, campo de palavra-passe e botão "Entrar" | Normal · a entrar · palavra-passe errada |
| 11 | **Admin: Moderação** | Cabeçalho com "Transferir todas (ZIP)" e "Sair". Tem 3 secções: **Pendentes** (Aprovar/Rejeitar), **No mural** (Apagar) e **Ficheiros órfãos** (Apagar). Cada linha mostra a miniatura, o nome e a mensagem, ou a data e o tamanho no caso dos órfãos | Listas vazias · ação em curso |

---

## 4. Design atual (ponto de partida)

**Ambiente:** romântico, quente e editorial. Usa creme, capuccino e terracota.

**Cores (OKLCH)**
- Fundo: `oklch(0.97 0.014 75)` (creme)
- Texto: `oklch(0.28 0.02 60)`; títulos: `oklch(0.3 0.03 55)`
- Destaque (botões, FAB, bordas): `oklch(0.58 0.1 55)` (terracota)
- Cartões: `oklch(0.98 0.01 70)`; bordas dos inputs: `oklch(0.85 0.02 70)`
- Overlay do modal: `oklch(0.15 0.02 40 / 0.82)`; overlay do sheet: `/ 0.5`

**Tipografia**
- Serif (títulos, nomes, mensagens): **Cormorant Garamond** 400/600, itálico
- Sans (labels, botões, inputs): **Montserrat** 400–700

**Forma**
- Grelha com gap de 3px e cantos retos
- Cartões e modais com raio de 18–22px; sheet com raio de 28px no topo
- Botões em pill (999px); FAB circular de 56px
- Inputs com raio de 12px

**Movimento**
- Blocos sobem com fade (0.8s) ao carregar
- Tiles do mural aparecem com fade e scale, de forma escalonada
- Sheet desliza do fundo (300ms) e fecha ao arrastar a pega para baixo
- Modal entra com fade (0.25s)

---

## 5. Restrições técnicas (respeitar)

- **Mobile-first.** O conteúdo tem largura máxima de **560px**, centrado. No desktop mostra-se a mesma coluna, centrada.
- **Página única.** O modal, o sheet e a celebração são overlays, não páginas.
- **Fotos:** a grelha usa miniaturas de 400px; o modal usa a versão de 1600px. As fotos de utilizadores podem ter qualquer proporção, por isso devem funcionar em recorte (`cover`).
- **Campos:** nome obrigatório (máx. 60 carateres); mensagem opcional (máx. 280).
- **Publicar** só fica ativo quando há foto e nome.
- **Acessibilidade:** contraste legível, alvos de toque ≥ 44px, foco visível. O modal e o sheet fecham com Escape ou com um clique fora.
- **Implementação:** Tailwind CSS. Imagens decorativas e padrões devem poder ser feitos em CSS sempre que possível. Fontes do Google Fonts.

---

## 6. Formato da entrega (para passar ao programador)

1. **Protótipo HTML de alta fidelidade** com todos os ecrãs e estados da secção 3.
2. **Design tokens:** cores, tipografia (família, peso, tamanho, letter-spacing), espaçamentos, raios, sombras e animações (duração e easing).
3. **Especificação por componente**, com os mesmos nomes do código:
   `SiteIntro`, `Hero`, `IntroCta`, `SectionDivider`, `Gallery`, `Fab`,
   `PhotoModal`, `UploadSheet`, `PublishCelebration`, `AdminLogin`,
   `Admin` (`PhotoRow`, `OrphanRow`).
4. **Todo o texto final (copy)**, incluindo mensagens de erro e de estado.
5. **Assets** (imagem do hero, ícones), ou a indicação de que são feitos em CSS.
6. **Notas sobre o que mudou** em relação ao design atual (secção 4).
