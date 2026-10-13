import { AnimatePresence, MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import LayeredWaves from "./components/bg/LayeredWaves";
import Cursor from "./components/Cursor";
import Header from "./components/Header";
import Preloader from "./components/Preloader";
import SectionBoundary from "./components/SectionBoundary";
import { useActiveSection } from "./hooks/useActiveSection";
import { IntroContext } from "./lib/intro";
import { PALETTE } from "./lib/palette";
import { initSmoothScroll } from "./lib/smoothScroll";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import Services from "./sections/Services";
import Skills from "./sections/Skills";

const SECTIONS = ["home", "services", "about", "skills", "projects", "contact"];
const SEEN_KEY = "portfolio-intro-seen";

/** Le préchargeur ne s'affiche qu'une fois par visite, et jamais si les animations sont réduites. */
function shouldShowIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

export default function App() {
  const activeSection = useActiveSection(SECTIONS);
  const [showIntro, setShowIntro] = useState(shouldShowIntro);

  useEffect(() => initSmoothScroll(), []);

  const finishIntro = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* stockage indisponible : on rejouera l'intro, sans conséquence */
    }
    setShowIntro(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={!showIntro}>
        <a className="skip-link" href="#main">
          Aller au contenu
        </a>
        <AnimatePresence>{showIntro && <Preloader onDone={finishIntro} />}</AnimatePresence>
        <Cursor />
        <Header activeSection={activeSection} />
        <main id="main">
          <SectionBoundary name="Accueil">
            <Hero />
          </SectionBoundary>
          <SectionBoundary name="Services">
            <Services />
          </SectionBoundary>
          <SectionBoundary name="À propos">
            <About />
          </SectionBoundary>
          <LayeredWaves from={PALETTE.bg} to={PALETTE.bg3} seed={4} />
          <SectionBoundary name="Compétences">
            <Skills />
          </SectionBoundary>
          <LayeredWaves from={PALETTE.bg} to={PALETTE.bg3} seed={9} flip />
          <SectionBoundary name="Projets">
            <Projects />
          </SectionBoundary>
          <LayeredWaves from={PALETTE.bg} to={PALETTE.yellow} seed={17} layers={5} />
          <SectionBoundary name="Contact">
            <Contact />
          </SectionBoundary>
        </main>
      </IntroContext.Provider>
    </MotionConfig>
  );
}
