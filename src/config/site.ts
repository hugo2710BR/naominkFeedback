/**
 * Todo o conteúdo editável do site num só sítio — marca, textos e
 * imagem do hero. Muda aqui para adaptar o site sem tocar nos layouts.
 */
export const SITE = {
  brand: "Naomink",
  role: "Tattoo Artist",
  heroImage: "/hero.jpg",
  heroAlt: "Pormenor de tatuagem fine line, três rostos femininos entrelaçados",
  intro:
    "Mostra-nos a tua tatuagem e conta-nos como foi a tua experiência. Cada fotografia passa a fazer parte do mural da Naomink.",
  ctaLabel: "Adicionar a minha foto",
  galleryLabel: "Mural dos Clientes",
  description:
    "Mostra-nos a tua tatuagem e conta-nos como foi a tua experiência com a Naomink.",
  zipFilename: "fotos-naomink.zip",
} as const;

export const SITE_TITLE = `${SITE.brand} · ${SITE.galleryLabel}`;
