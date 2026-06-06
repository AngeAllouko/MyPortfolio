import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Skills.css";

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    api
      .get("/skills")
      .then((r) => setSkills(r.data))
      .catch(() => {});
  }, []);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Qu'est ce que je connais</span>
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">
            Création de design attrayant et de code propre
          </p>
        </div>

        <div className="skills-grid">
          {Object.entries(grouped).map(([category, items]) => (
            <div className="skill-card" key={category}>
              <h3 className="skill-category">{category}</h3>
              <div className="skill-tags">
                {items.map((s) => (
                  <span className="skill-pill" key={s.id}>
                    {s.name}
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
