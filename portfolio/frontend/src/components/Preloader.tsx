import { motion } from "motion/react";
import { useEffect } from "react";
import { stopScroll } from "../lib/smoothScroll";
import ScrambleText from "./motion/ScrambleText";
import "./Preloader.css";

/**
 * Écran d'ouverture : le nom se décode, une ligne jaune se remplit,
 * puis le panneau remonte et dévoile la page.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    stopScroll(true);
    return () => stopScroll(false);
  }, []);

  return (
    <motion.div
      className="preloader"
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ delay: 1.5, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onDone}
      aria-hidden="true"
    >
      <div className="preloader-inner">
        <ScrambleText text="AEDAN" className="preloader-name" trigger="manual" duration={1000} />
        <div className="preloader-bar">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
