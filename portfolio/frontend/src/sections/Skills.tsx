import "./Skills.css";

const skillGroups = [
  {
    category: "Core Skills",
    skills: [
      "UI/UX layout",
      "Frontend Dev",
      "Responsive Web Design",
      "Component-based Design",
    ],
  },
  {
    category: "Frontend Tech",
    skills: ["HTML", "CSS", "JS", "TypeScript", "React", "WordPress"],
  },
  {
    category: "Design Tools",
    skills: ["Figma", "Photoshop", "Illustrator"],
  },
  {
    category: "Tools & Interaction",
    skills: ["GitHub", "Netlify", "GSAP", "UI Interactions"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">What I know</span>
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">
            Crafting seamless UI/UX and clean code
          </p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <div className="skill-card" key={i}>
              <h3 className="skill-category">{group.category}</h3>
              <div className="skill-tags">
                {group.skills.map((skill, j) => (
                  <span className="skill-pill" key={j}>
                    {skill}
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
