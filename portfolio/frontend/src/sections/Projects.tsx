import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Projects.css";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies?: string[];
  image_url?: string;
  github_link?: string;
  live_link?: string;
  featured: boolean;
}
interface Profile {
  github_url?: string;
}

const ACCENTS = [
  "#e8ff47",
  "#47c8ff",
  "#ff6b6b",
  "#b47fff",
  "#4dff91",
  "#ff6eb4",
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    Promise.allSettled([api.get("/projects"), api.get("/profile")]).then(
      ([p, pr]) => {
        if (p.status === "fulfilled") setProjects(p.value.data);
        if (pr.status === "fulfilled") {
          const d = pr.value.data;
          setProfile(Array.isArray(d) ? d[0] : d);
        }
      },
    );
  }, []);

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="projects-header">
          <div>
            <span className="section-tag">Mon travail</span>
            <h2 className="section-title">Projets</h2>
          </div>
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="view-all-btn"
            >
              Tout voir
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>

        <div className="projects-grid">
          {projects.map((p, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const href = p.live_link || p.github_link || "#";
            return (
              <a
                href={href}
                className="project-card"
                key={p.id}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className="project-preview"
                  style={{ "--card-accent": accent } as React.CSSProperties}
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="project-preview-inner">
                      <span className="project-preview-icon">⊹</span>
                    </div>
                  )}
                </div>
                <div className="project-info">
                  <div className="project-meta">
                    <span className="project-category">
                      {Array.isArray(p.technologies) &&
                      p.technologies.length > 0
                        ? p.technologies.join(" · ")
                        : "Project"}
                    </span>
                    <svg
                      className="project-arrow"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.description}</p>
                  {Array.isArray(p.technologies) &&
                    p.technologies.length > 0 && (
                      <div className="project-tags">
                        {p.technologies.map((t, j) => (
                          <span className="project-tag" key={j}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
