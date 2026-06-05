import "./Services.css";

const services = [
  {
    icon: "✦",
    title: "UI/UX Website Design",
    desc: "Clean, user-focused layouts with clear structure, smooth navigation, and strong visual hierarchy.",
    tags: ["Modern layouts", "Responsive design"],
  },
  {
    icon: "⟨/⟩",
    title: "Frontend Development",
    desc: "Responsive interfaces using HTML, CSS, and JavaScript for clean, consistent, reliable performance.",
    tags: ["Clean HTML/CSS", "Smooth interactions"],
  },
  {
    icon: "⚡",
    title: "Performance & Responsiveness",
    desc: "Fast, mobile-first websites optimized for speed, accessibility, and dependable performance.",
    tags: ["Speed optimization", "Asset efficiency"],
  },
  {
    icon: "⊞",
    title: "WordPress Implementation",
    desc: "Lightweight WordPress setups with easy updates, fast loading, and scalable, clean, customizable layouts.",
    tags: ["Theme setup", "Easy management"],
  },
];

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">What I offer</span>
          <h2 className="section-title">Services</h2>
          <p className="section-subtitle">
            Designing clean scalable responsive websites
          </p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card" key={i}>
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <div className="service-tags">
                {s.tags.map((tag, j) => (
                  <span className="service-tag" key={j}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
