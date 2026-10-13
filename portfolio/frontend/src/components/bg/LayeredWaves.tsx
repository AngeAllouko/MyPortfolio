import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { mix, wavePath } from "../../lib/shapes";

/**
 * Vagues superposées (« Layered Waves » de Haikei) qui font la transition
 * entre la couleur de la section précédente (`from`) et celle-ci (`to`).
 * Se place en haut d'une section ; `flip` la retourne pour le bas.
 */
export default function LayeredWaves({
  from,
  to,
  layers = 4,
  seed = 3,
  flip = false,
  className,
}: {
  from: string;
  to: string;
  layers?: number;
  seed?: number;
  flip?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const W = 1200;
  const H = 200;

  const paths = useMemo(
    () =>
      Array.from({ length: layers }, (_, i) => {
        const y = 40 + (i * (H - 70)) / layers;
        return {
          fill: mix(from, to, (i + 1) / layers),
          a: wavePath(W, H, y, 26, seed + i * 7),
          b: wavePath(W, H, y, 26, seed + i * 7 + 300),
          duration: 10 + i * 2,
        };
      }),
    [from, to, layers, seed],
  );

  return (
    <svg
      className={`layered-waves ${flip ? "is-flipped" : ""} ${className ?? ""}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ background: from }}
    >
      {paths.map((p, i) =>
        reduce ? (
          <path key={i} d={p.a} fill={p.fill} />
        ) : (
          <motion.path
            key={i}
            d={p.a}
            fill={p.fill}
            animate={{ d: [p.a, p.b, p.a] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ),
      )}
    </svg>
  );
}
