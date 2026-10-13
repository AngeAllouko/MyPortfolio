import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { blobPath, mix } from "../../lib/shapes";

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface CornerBlob {
  corner: Corner;
  /** Rayon en unités du viewBox (1000 × 1000) */
  radius: number;
  /** Couleur du blob le plus petit, au premier plan */
  color: string;
  /** Couleur vers laquelle tendent les couches extérieures */
  fade: string;
  steps?: number;
  seed: number;
}

const ORIGIN: Record<Corner, [number, number]> = {
  "top-left": [0, 0],
  "top-right": [1000, 0],
  "bottom-left": [0, 1000],
  "bottom-right": [1000, 1000],
};

/**
 * Formes organiques en couches posées dans les coins (le « Blob Scene »
 * de Haikei). Chaque couche ondule lentement entre deux formes.
 */
export default function BlobScene({
  blobs,
  className,
}: {
  blobs: CornerBlob[];
  className?: string;
}) {
  const reduce = useReducedMotion();

  const layers = useMemo(
    () =>
      blobs.flatMap((b, bi) => {
        const steps = b.steps ?? 3;
        const [cx, cy] = ORIGIN[b.corner];
        return Array.from({ length: steps }, (_, k) => {
          // k = 0 : couche extérieure, la plus grande et la plus estompée
          const t = steps === 1 ? 0 : 1 - k / (steps - 1);
          const r = b.radius * (1 - k * 0.2);
          return {
            key: `${bi}-${k}`,
            fill: mix(b.color, b.fade, t * 0.65),
            a: blobPath(cx, cy, r, b.seed + k * 11),
            b: blobPath(cx, cy, r, b.seed + k * 11 + 500),
            duration: 14 + k * 3 + bi * 2,
          };
        });
      }),
    [blobs],
  );

  return (
    <svg
      className={`blob-scene ${className ?? ""}`}
      viewBox="0 0 1000 1000"
      /* "none" : les coins du dessin collent aux coins de la section */
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {layers.map((l) =>
        reduce ? (
          <path key={l.key} d={l.a} fill={l.fill} />
        ) : (
          <motion.path
            key={l.key}
            d={l.a}
            fill={l.fill}
            animate={{ d: [l.a, l.b, l.a] }}
            transition={{ duration: l.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ),
      )}
    </svg>
  );
}
