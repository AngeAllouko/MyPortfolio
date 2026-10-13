import Lenis from "lenis";

let lenis: Lenis | null = null;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Active le défilement fluide (désactivé si l'utilisateur réduit les animations). */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};
  lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: false });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // Le décalage sous l'en-tête vient du scroll-margin-top des sections (CSS)
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  // Le focus suit la navigation pour les lecteurs d'écran et le clavier
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function stopScroll(stop: boolean) {
  if (!lenis) {
    document.documentElement.style.overflow = stop ? "hidden" : "";
    return;
  }
  if (stop) lenis.stop();
  else lenis.start();
}
