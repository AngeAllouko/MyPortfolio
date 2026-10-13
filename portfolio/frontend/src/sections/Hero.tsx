import { Download, Mail } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { storageUrl } from "../api/axios";
import { GitHubIcon, LinkedInIcon } from "../components/BrandIcons";
import Float3D from "../components/three-d/Float3D";
import { Braces, CodeCube, Keycap } from "../components/three-d/Objects3D";
import BlobScene from "../components/bg/BlobScene";
import BlockReveal from "../components/motion/BlockReveal";
import Marquee from "../components/motion/Marquee";
import ScrambleText from "../components/motion/ScrambleText";
import { usePortfolio } from "../data/context";
import { useFinePointer } from "../hooks/useFinePointer";
import { useIntroDone } from "../lib/intro";
import { PALETTE } from "../lib/palette";
import { scrollToId } from "../lib/smoothScroll";
import "./Hero.css";

const FALLBACK_TITLE = "Développeur front-end & designer";

/** Répète une liste courte pour que les bandeaux couvrent toute la largeur. */
function fill<T>(list: T[], min = 12): T[] {
  if (list.length === 0) return list;
  const out: T[] = [];
  while (out.length < min) out.push(...list);
  return out;
}

const firstSentence = (text?: string | null) => {
  if (!text) return "";
  const m = text.match(/^.+?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
};

export default function Hero() {
  const { profile, skills, skillGroups, status } = usePortfolio();
  const introDone = useIntroDone();
  const ready = introDone && status !== "loading";
  const interactive = useFinePointer();

  // Le portrait et son contour suivent la souris en sens opposés
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const photoX = useTransform(sx, (v) => v * 14);
  const photoY = useTransform(sy, (v) => v * 14);
  const frameX = useTransform(sx, (v) => v * -22);
  const frameY = useTransform(sy, (v) => v * -22);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, mx, my]);

  const title = profile?.title?.trim() || FALLBACK_TITLE;
  const intro = firstSentence(profile?.bio);
  const initial = (profile?.name || "A").trim().charAt(0).toUpperCase();

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="home" className="hero has-bg">
      <BlobScene
        blobs={[
          { corner: "top-right", radius: 470, color: PALETTE.yellow, fade: PALETTE.bg, seed: 7 },
          { corner: "bottom-left", radius: 380, color: PALETTE.yellow, fade: PALETTE.bg, seed: 21 },
        ]}
      />
      <Float3D className="hero-obj hero-obj-cube" depth={1.2}>
        <CodeCube />
      </Float3D>
      <Float3D className="hero-obj hero-obj-key" depth={0.7}>
        <Keycap label="Ctrl" />
      </Float3D>
      <Float3D className="hero-obj hero-obj-braces" depth={1.5}>
        <Braces />
      </Float3D>
      <div className="container hero-grid">
        <div className="hero-copy">
          <BlockReveal enabled={ready}>
            <p className="hero-hello">
              Bonjour, je suis <strong>{profile?.name || "…"}</strong>
            </p>
          </BlockReveal>

          <ScrambleText
            as="h1"
            text={title}
            className="hero-title"
            trigger="manual"
            enabled={ready}
            delay={250}
            duration={1300}
          />

          <div className="hero-bottom">
            {intro && (
              <motion.p className="hero-intro" {...enter(0.9)}>
                {intro}
              </motion.p>
            )}

            <motion.div className="hero-actions" {...enter(1.05)}>
              {profile?.cv_url ? (
                <a
                  href={storageUrl(profile.cv_url)}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  <Download size={18} aria-hidden="true" />
                  <span className="btn-roll">
                    <span>Télécharger le CV</span>
                    <span aria-hidden="true">Télécharger le CV</span>
                  </span>
                </a>
              ) : (
                <button className="btn btn-primary" onClick={() => scrollToId("contact")}>
                  <Mail size={18} aria-hidden="true" />
                  <span className="btn-roll">
                    <span>Me contacter</span>
                    <span aria-hidden="true">Me contacter</span>
                  </span>
                </button>
              )}

              <div className="hero-socials">
                {profile?.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="icon-link" aria-label="LinkedIn">
                    <LinkedInIcon />
                  </a>
                )}
                {profile?.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noreferrer" className="icon-link" aria-label="GitHub">
                    <GitHubIcon />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="hero-visual">
          <motion.div className="hero-frame" style={{ x: frameX, y: frameY }} aria-hidden="true" />
          <motion.div className="hero-photo-wrap" style={{ x: photoX, y: photoY }}>
            <BlockReveal enabled={ready} delay={0.35} block className="hero-photo-reveal">
              <div className="hero-photo">
                {profile?.photo_url ? (
                  <img src={storageUrl(profile.photo_url)} alt={`Portrait de ${profile.name}`} />
                ) : (
                  <div className="hero-monogram" aria-hidden="true">
                    {initial}
                  </div>
                )}
              </div>
            </BlockReveal>
          </motion.div>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="hero-bands container-free" aria-hidden="true">
          <Marquee className="band band-yellow" baseVelocity={-1.6}>
            {fill(skills).map((s, i) => (
              <span className="band-item" key={i}>
                {s.name}
                <span className="band-sep">✦</span>
              </span>
            ))}
          </Marquee>
          <Marquee className="band band-dark" baseVelocity={1.6}>
            {fill(skillGroups.map(([category]) => category), 8).map((category, i) => (
              <span className="band-item" key={i}>
                {category}
                <span className="band-sep">/</span>
              </span>
            ))}
          </Marquee>
        </div>
      )}
    </section>
  );
}
