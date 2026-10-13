import { mix } from "./shapes";

/*
 * Source unique des couleurs du site.
 * Pour changer le fond, il suffit de modifier `bg` : les nuances plus claires
 * et plus sombres, les blobs, les vagues et les variables CSS en découlent.
 */
const BASE = {
  bg: "#0e1a2e",
  yellow: "#ffdb00",
  text: "#f5f5f0",
};

export const PALETTE = {
  ...BASE,
  /** Cartes et surfaces posées sur le fond */
  bg2: mix(BASE.bg, "#ffffff", 0.06),
  /** Sections plus sombres (Compétences) */
  bg3: mix(BASE.bg, "#000000", 0.28),
  /** Blobs discrets, ton sur ton */
  soft: mix(BASE.bg, "#ffffff", 0.09),
};

// Les mêmes valeurs sont exposées au CSS, qui n'a donc rien à dupliquer.
if (typeof document !== "undefined") {
  const root = document.documentElement.style;
  root.setProperty("--bg", PALETTE.bg);
  root.setProperty("--bg-2", PALETTE.bg2);
  root.setProperty("--bg-3", PALETTE.bg3);
  root.setProperty("--yellow", PALETTE.yellow);
  root.setProperty("--text", PALETTE.text);
  // Le texte posé sur le jaune reprend la couleur du fond
  root.setProperty("--on-yellow", PALETTE.bg);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", PALETTE.bg);
}
