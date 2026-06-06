import { useEffect, useState } from "react";
import api from "../api/axios";
import "./About.css";

interface Profile {
  bio?: string;
}
interface Experience {
  id: number;
  job_title: string;
  company: string;
  start_date: string;
  end_date?: string;
  location?: string;
  description: string;
}
interface Diploma {
  id: number;
  title: string;
  institution: string;
  year: string;
  description?: string;
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExp] = useState<Experience[]>([]);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);

  useEffect(() => {
    Promise.allSettled([
      api.get("/profile"),
      api.get("/experiences"),
      api.get("/diplomas"),
    ]).then(([p, e, d]) => {
      if (p.status === "fulfilled") {
        const v = p.value.data;
        setProfile(Array.isArray(v) ? v[0] : v);
      }
      if (e.status === "fulfilled") setExp(e.value.data);
      if (d.status === "fulfilled") setDiplomas(d.value.data);
    });
  }, []);

  const currentYear = new Date().getFullYear();
  const firstYear = experiences.length
    ? Math.min(...experiences.map((e) => new Date(e.start_date).getFullYear()))
    : currentYear;
  const yearsExp = currentYear - firstYear;

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Qui suis-je ?</span>
          <h2 className="section-title">A propos de moi</h2>
          <p
            className="section-subtitle"
            style={{ margin: "12px auto 0", textAlign: "center" }}
          >
            {profile?.bio ?? ""}
          </p>
        </div>

        {/* Expériences sous forme de approach-cards */}
        {experiences.length > 0 && (
          <div className="about-approach">
            <p className="approach-label">Expériences</p>
            <div className="approach-cards">
              {experiences.map((exp, i) => (
                <div className="approach-card" key={exp.id}>
                  <span className="approach-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="approach-text">{exp.job_title}</span>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {exp.company} · {fmt(exp.start_date)} —{" "}
                      {exp.end_date ? fmt(exp.end_date) : "Présent"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diplômes */}
        {diplomas.length > 0 && (
          <div className="about-approach">
            <p className="approach-label">Formation</p>
            <div className="approach-cards">
              {diplomas.map((d, i) => (
                <div className="approach-card" key={d.id}>
                  <span className="approach-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="approach-text">{d.title}</span>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {d.institution} · {d.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats dynamiques — même design qu'avant */}
        <div className="about-stats">
          <div className="stat-item">
            <span className="stat-value">
              {String(yearsExp).padStart(2, "0")}+
            </span>
            <span className="stat-label">Années d'expériences</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {String(experiences.length).padStart(2, "0")}+
            </span>
            <span className="stat-label">Expériences</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {String(diplomas.length).padStart(2, "0")}+
            </span>
            <span className="stat-label">Diplômes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
