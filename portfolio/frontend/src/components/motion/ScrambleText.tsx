import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ElementType } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/{}";

const escape = (c: string) =>
  c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c;

interface ScrambleTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** "view" : joue à l'apparition ; "manual" : joue quand `play` change */
  trigger?: "view" | "manual";
  /** Incrémenter pour rejouer (survol d'un lien, par exemple) */
  play?: number;
  /** Bloque le départ (ex. tant que le préchargeur est affiché) */
  enabled?: boolean;
  delay?: number;
  duration?: number;
}

/**
 * Texte qui se « décode » : chaque lettre passe par des signes aléatoires
 * puis se fixe, de gauche à droite. Le vrai texte reste lisible par les
 * lecteurs d'écran.
 */
export default function ScrambleText({
  text,
  as: Tag = "span",
  className,
  trigger = "view",
  play = 0,
  enabled = true,
  delay = 0,
  duration = 900,
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);
  const out = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const shouldRun = enabled && (trigger === "manual" || inView);

  useEffect(() => {
    const el = out.current;
    if (!el) return;
    if (reduce) {
      el.textContent = text;
      return;
    }
    if (!shouldRun) return;

    const chars = [...text];
    let raf = 0;
    let start = 0;
    const timer = window.setTimeout(() => {
      const frame = (t: number) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / duration);
        const resolved = Math.floor(p * chars.length);
        let html = "";
        chars.forEach((c, i) => {
          if (i < resolved || c === " ") html += escape(c);
          else
            html += `<span class="scramble-glyph">${escape(
              GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )}</span>`;
        });
        el.innerHTML = html;
        if (p < 1) raf = requestAnimationFrame(frame);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(frame);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text, shouldRun, play, delay, duration, reduce]);

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" ref={out}>
        {text}
      </span>
    </Tag>
  );
}
