import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Services.css";

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
}

const ICONS: string[] = ["✦", "⟨/⟩", "⚡", "⊞", "◈", "⟳"];

export default function Services() {
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
    <section id="services" className="services">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Ce que je propose</span>
          <h2 className="section-title">Services</h2>
          <p className="section-subtitle">
            Concevoir des sites Web réactifs et des applications mobile IOS,
            propres et évolutifs
          </p>
        </div>

        <div className="services-grid">
          {Object.entries(grouped).map(([category, items], i) => (
            <div className="service-card" key={category}>
              <div className="service-icon">{ICONS[i % ICONS.length]}</div>
              <h3 className="service-title">{category}</h3>
              <div className="service-tags">
                {items.map((s) => (
                  <span className="service-tag" key={s.id}>
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
