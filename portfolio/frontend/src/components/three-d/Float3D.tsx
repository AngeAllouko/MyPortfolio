import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { useFinePointer } from "../../hooks/useFinePointer";

/**
 * Scène 3D décorative : l'objet flotte doucement et pivote vers la souris.
 * `depth` règle l'amplitude (les objets « proches » bougent plus).
 */
export default function Float3D({
  children,
  className,
  depth = 1,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
}) {
  const interactive = useFinePointer();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 14 });
  const sy = useSpring(my, { stiffness: 50, damping: 14 });
  const rotateY = useTransform(sx, (v) => v * 30 * depth);
  const rotateX = useTransform(sy, (v) => v * -24 * depth);
  const x = useTransform(sx, (v) => v * 24 * depth);
  const y = useTransform(sy, (v) => v * 24 * depth);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, mx, my]);

  return (
    <div className={`float3d ${className ?? ""}`} aria-hidden="true">
      <motion.div className="float3d-tilt" style={{ rotateX, rotateY, x, y }}>
        <div className="float3d-bob">{children}</div>
      </motion.div>
    </div>
  );
}
