import SectionTitle from "../components/SectionTitle";
import BlockReveal from "../components/motion/BlockReveal";
import ScrambleText from "../components/motion/ScrambleText";
import { usePortfolio } from "../data/context";
import "./About.css";

const fmt = (d?: string) => {
  const date = d ? new Date(d) : null;
  return date && !isNaN(+date)
    ? date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
    : "";
};

const pad = (n: number) => String(n).padStart(2, "0");

interface Entry {
  key: string | number;
  when: string;
  title: string;
  where: string;
  detail?: string;
}

function Timeline({ label, entries }: { label: string; entries: Entry[] }) {
  return (
    <div className="timeline">
      <h3 className="timeline-label">{label}</h3>
      <ol className="timeline-list">
        {entries.map((e, i) => (
          <li className="timeline-item" key={e.key}>
            <BlockReveal delay={i * 0.12} block>
              <p className="timeline-when">{e.when}</p>
              <p className="timeline-title">{e.title}</p>
              <p className="timeline-where">{e.where}</p>
              {e.detail && <p className="timeline-detail">{e.detail}</p>}
            </BlockReveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function About() {
  const { profile, experiences, diplomas } = usePortfolio();

  const sortedExp = [...experiences].sort(
    (a, b) => +new Date(b.start_date) - +new Date(a.start_date),
  );
  const sortedDip = [...diplomas].sort((a, b) => Number(b.year) - Number(a.year));

  const currentYear = new Date().getFullYear();
  const firstYear = experiences.length
    ? Math.min(...experiences.map((e) => new Date(e.start_date).getFullYear()))
    : currentYear;
  const yearsExp = Math.max(0, currentYear - firstYear);

  const stats = [
    { label: "Années d'expérience", value: `${pad(yearsExp)}+` },
    { label: "Expériences", value: pad(experiences.length) },
    { label: "Diplômes", value: pad(diplomas.length) },
  ];

  return (
    <section id="about" className="section about">
      <div className="container">
        <header className="section-head">
          <SectionTitle>À propos de moi</SectionTitle>
        </header>

        {profile?.bio && (
          <BlockReveal block className="about-bio-wrap">
            <p className="about-bio">{profile.bio}</p>
          </BlockReveal>
        )}

        {(sortedExp.length > 0 || sortedDip.length > 0) && (
          <div className="about-timelines">
            {sortedExp.length > 0 && (
              <Timeline
                label="Expériences"
                entries={sortedExp.map((e, i) => ({
                  key: e.id ?? i,
                  when: `${fmt(e.start_date)} — ${e.end_date ? fmt(e.end_date) : "aujourd'hui"}`,
                  title: e.job_title,
                  where: [e.company, e.location].filter(Boolean).join(", "),
                  detail: e.description,
                }))}
              />
            )}
            {sortedDip.length > 0 && (
              <Timeline
                label="Formation"
                entries={sortedDip.map((d, i) => ({
                  key: d.id ?? i,
                  when: d.year,
                  title: d.title,
                  where: d.institution,
                  detail: d.description,
                }))}
              />
            )}
          </div>
        )}

        <dl className="about-stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                <ScrambleText text={s.value} duration={800} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
