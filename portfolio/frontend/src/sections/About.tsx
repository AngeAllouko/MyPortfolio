import "./About.css";

const approach = [
  { num: "01", label: "Understand users & goals" },
  { num: "02", label: "Create clean UI layouts" },
  { num: "03", label: "Responsive experiences" },
];

const stats = [
  { value: "02+", label: "Years Of Experience" },
  { value: "15+", label: "Projects Completed" },
  { value: "05+", label: "Clients Served" },
];

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Who I am</span>
          <h2 className="section-title">About Me</h2>
          <p
            className="section-subtitle"
            style={{ margin: "12px auto 0", textAlign: "center" }}
          >
            I'm a front-end developer and designer passionate about crafting
            clean, intuitive, and responsive digital experiences. I focus on
            turning ideas into seamless interfaces by understanding user needs,
            designing thoughtful UI layouts, and ensuring smooth interactions
            across devices.
          </p>
        </div>

        <div className="about-approach">
          <p className="approach-label">My Approach</p>
          <div className="approach-cards">
            {approach.map((a) => (
              <div className="approach-card" key={a.num}>
                <span className="approach-num">{a.num}</span>
                <span className="approach-text">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-stats">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
