import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useFinePointer } from "../../hooks/useFinePointer";

/**
 * Carte qui s'incline vers le curseur, avec un reflet jaune qui le suit.
 */
export default function Tilt({
  children,
  className,
  max = 10,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useFinePointer();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt ${className ?? ""}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={
        enabled
          ? ({ rotateX, rotateY, transformPerspective: 900, "--gx": glareX, "--gy": glareY } as never)
          : undefined
      }
    >
      {children}
      {enabled && <span className="tilt-glare" aria-hidden="true" />}
    </motion.div>
  );
}
