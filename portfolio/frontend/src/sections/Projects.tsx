import "./Projects.css";

// Ajoute tes projets ici
const projects = [
  {
    title: "E-Commerce Dashboard",
    category: "UI/UX · Frontend",
    desc: "A clean admin dashboard with real-time analytics, dark theme, and responsive layouts.",
    tags: ["React", "TypeScript", "CSS"],
    link: "#",
    accent: "#e8ff47",
  },
  {
    title: "Portfolio Website",
    category: "Design · Development",
    desc: "Personal portfolio with smooth animations, dark aesthetic, and optimized performance.",
    tags: ["Vite", "React", "Figma"],
    link: "#",
    accent: "#47c8ff",
  },
  {
    title: "Landing Page UI",
    category: "Frontend · WordPress",
    desc: "Conversion-focused landing page with mobile-first design and fast load times.",
    tags: ["HTML", "CSS", "WordPress"],
    link: "#",
    accent: "#ff6b6b",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="projects-header">
          <div>
            <span className="section-tag">My work</span>
            <h2 className="section-title">Projects</h2>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="view-all-btn"
          >
            View all
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
        </div>

        <div className="projects-grid">
          {projects.map((p, i) => (
            <a
              href={p.link}
              className="project-card"
              key={i}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className="project-preview"
                style={{ "--card-accent": p.accent } as React.CSSProperties}
              >
                <div className="project-preview-inner">
                  <span className="project-preview-icon">⊹</span>
                </div>
              </div>
              <div className="project-info">
                <div className="project-meta">
                  <span className="project-category">{p.category}</span>
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
                <p className="project-desc">{p.desc}</p>
                <div className="project-tags">
                  {p.tags.map((tag, j) => (
                    <span className="project-tag" key={j}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
