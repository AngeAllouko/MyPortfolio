import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";
import { scrollToId, stopScroll } from "../lib/smoothScroll";
import ScrambleText from "./motion/ScrambleText";
import "./Header.css";

interface HeaderProps {
  activeSection: string;
}

const navLinks = [
  { id: "home", label: "Accueil" },
  { id: "services", label: "Services" },
  { id: "about", label: "À propos" },
  { id: "skills", label: "Compétences" },
  { id: "projects", label: "Projets" },
];

const COLUMNS = 4;

function NavLink({
  id,
  label,
  active,
  onGo,
}: {
  id: string;
  label: string;
  active: boolean;
  onGo: (id: string) => void;
}) {
  const [play, setPlay] = useState(0);
  return (
    <button
      className={`nav-link ${active ? "is-active" : ""}`}
      aria-current={active ? "location" : undefined}
      onClick={() => onGo(id)}
      onPointerEnter={() => setPlay((p) => p + 1)}
      onFocus={() => setPlay((p) => p + 1)}
    >
      <ScrambleText text={label} trigger="manual" play={play} enabled={play > 0} duration={450} />
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="nav-underline"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
    </button>
  );
}

export default function Header({ activeSection }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  // L'en-tête se cache quand on descend et revient dès qu'on remonte
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 320 && !menuOpen);
  });

  useEffect(() => {
    stopScroll(menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (id: string) => {
    const wasOpen = menuOpen;
    setMenuOpen(false);
    // Laisse le menu se refermer avant de défiler
    window.setTimeout(() => scrollToId(id), wasOpen ? 650 : 0);
  };

  return (
    <>
      <motion.header
        className={`header ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="header-inner container">
          <button className="logo" onClick={() => go("home")} aria-label="Retour en haut de page">
            <span className="logo-mark" aria-hidden="true">
              AEDAN
            </span>
          </button>

          <nav className="nav" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                id={link.id}
                label={link.label}
                active={activeSection === link.id}
                onGo={go}
              />
            ))}
          </nav>

          <button className="btn btn-primary btn-small header-cta" onClick={() => go("contact")}>
            <span className="btn-roll">
              <span>Me contacter</span>
              <span aria-hidden="true">Me contacter</span>
            </span>
          </button>

          <button
            className={`burger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span />
            <span />
          </button>
        </div>
        <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <div id="mobile-menu" className="mobile-menu">
            {/* Le fond arrive en colonnes décalées */}
            <div className="mobile-columns" aria-hidden="true">
              {Array.from({ length: COLUMNS }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0, transition: { duration: 0.45, delay: (COLUMNS - i) * 0.05, ease: [0.76, 0, 0.24, 1] } }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.76, 0, 0.24, 1] }}
                  style={{ transformOrigin: "50% 0%" }}
                />
              ))}
            </div>
            <motion.nav
              aria-label="Menu mobile"
              className="mobile-nav container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.35 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {[...navLinks, { id: "contact", label: "Contact" }].map((link, i) => (
                <button
                  key={link.id}
                  className={`mobile-link ${activeSection === link.id ? "is-active" : ""}`}
                  aria-current={activeSection === link.id ? "location" : undefined}
                  onClick={() => go(link.id)}
                >
                  <ScrambleText text={link.label} trigger="manual" delay={350 + i * 60} duration={500} />
                </button>
              ))}
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
