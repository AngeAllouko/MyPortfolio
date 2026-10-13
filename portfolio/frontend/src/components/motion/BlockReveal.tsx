import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Un volet de couleur traverse l'élément de gauche à droite et le dévoile
 * au passage. S'utilise pour les titres et les images.
 */
export default function BlockReveal({
  children,
  delay = 0,
  color = "var(--yellow)",
  enabled = true,
  className,
  block = false,
}: {
  children: ReactNode;
  delay?: number;
  color?: string;
  /** Bloque le départ (ex. tant que le préchargeur est affiché) */
  enabled?: boolean;
  className?: string;
  /** Prend toute la largeur au lieu de s'ajuster au contenu */
  block?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const go = inView && enabled;

  if (reduce) return <div className={className}>{children}</div>;

  const style: CSSProperties = block ? { display: "block" } : {};

  return (
    <div ref={ref} className={`block-reveal ${className ?? ""}`} style={style}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={go ? { opacity: 1 } : undefined}
        transition={{ delay: delay + 0.45, duration: 0.01 }}
      >
        {children}
      </motion.div>
      <motion.span
        className="block-reveal-block"
        aria-hidden="true"
        style={{ background: color }}
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={
          go
            ? { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0 0 100%)"] }
            : undefined
        }
        transition={{ delay, duration: 0.95, times: [0, 0.47, 1], ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}
