import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer } from "../hooks/useFinePointer";

const INTERACTIVE = "a, button, input, textarea, label, [data-cursor]";

/** Pastille jaune qui suit la souris et grossit sur les éléments cliquables. */
export default function Cursor() {
  const enabled = useFinePointer();
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.3 });
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.3 });
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) =>
      setActive(!!(e.target as Element | null)?.closest?.(INTERACTIVE));
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      className={`cursor ${active ? "is-active" : ""}`}
      style={{ x, y, opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}
