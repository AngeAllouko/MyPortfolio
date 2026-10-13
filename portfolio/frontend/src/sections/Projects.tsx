import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { storageUrl } from "../api/axios";
import BlobScene from "../components/bg/BlobScene";
import SectionTitle from "../components/SectionTitle";
import { GitHubIcon } from "../components/BrandIcons";
import BlockReveal from "../components/motion/BlockReveal";
import { usePortfolio } from "../data/context";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { PALETTE } from "../lib/palette";
import type { Project } from "../types";
import "./Projects.css";

function ProjectCard({ project }: { project: Project }) {
  const tech = project.technologies ?? [];
  const initials = (project.title || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <article className="project-card">
      <BlockReveal block className="project-visual-reveal">
        <div className="project-visual">
          {project.image_url ? (
            <img src={storageUrl(project.image_url)} alt={`Aperçu de ${project.title}`} loading="lazy" />
          ) : (
            <div className="project-placeholder" aria-hidden="true">
              {initials}
            </div>
          )}
          {project.featured && <span className="project-badge">Projet phare</span>}
        </div>
      </BlockReveal>

      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        {tech.length > 0 && (
          <ul className="project-tags" aria-label="Technologies">
            {tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}

        <div className="project-links">
          {project.live_link && (
            <a className="btn btn-primary btn-small" href={project.live_link} target="_blank" rel="noreferrer">
              <span className="btn-roll">
                <span>Voir le projet</span>
                <span aria-hidden="true">Voir le projet</span>
              </span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          {project.github_link && (
            <a className="btn btn-ghost btn-small" href={project.github_link} target="_blank" rel="noreferrer">
              <GitHubIcon size={16} />
              Code source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Sur grand écran, la section s'épingle et le défilement vertical fait
 * glisser les projets de droite à gauche. Les cartes penchent légèrement
 * selon la vitesse.
 */
function HorizontalTrack({ projects }: { projects: Project[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [projects.length]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distance);
  const velocity = useVelocity(scrollYProgress);
  const skewX = useSpring(useTransform(velocity, [-2, 2], [6, -6], { clamp: true }), {
    stiffness: 200,
    damping: 30,
  });

  return (
    <div className="hscroll" ref={outer} style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="hscroll-sticky">
        <motion.div className="hscroll-track" ref={track} style={{ x }}>
          {projects.map((p) => (
            <motion.div className="hscroll-item" key={p.id ?? p.title} style={{ skewX }}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
        <div className="hscroll-progress" aria-hidden="true">
          <motion.span style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { projects, profile, status } = usePortfolio();
  const horizontal = useMediaQuery("(min-width: 901px) and (prefers-reduced-motion: no-preference)");

  // Les projets phares d'abord
  const ordered = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  return (
    <section id="projects" className="section projects has-bg">
      <BlobScene
        className="projects-blob"
        blobs={[{ corner: "top-left", radius: 240, color: PALETTE.soft, fade: PALETTE.bg, steps: 2, seed: 41 }]}
      />
      <div className="container">
        <header className="projects-head">
          <SectionTitle>Projets</SectionTitle>
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-small">
              Tous mes dépôts GitHub
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </header>
      </div>

      {ordered.length === 0 ? (
        status !== "loading" && (
          <div className="container">
            <p className="empty-note">Les projets arrivent bientôt.</p>
          </div>
        )
      ) : horizontal ? (
        <HorizontalTrack projects={ordered} />
      ) : (
        <div className="container project-list">
          {ordered.map((p) => (
            <ProjectCard key={p.id ?? p.title} project={p} />
          ))}
        </div>
      )}
    </section>
  );
}
