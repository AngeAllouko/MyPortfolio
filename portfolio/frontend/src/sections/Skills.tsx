import { motion, useReducedMotion } from "motion/react";
import SectionTitle from "../components/SectionTitle";
import ScrambleText from "../components/motion/ScrambleText";
import BlobScene from "../components/bg/BlobScene";
import Float3D from "../components/three-d/Float3D";
import { Chip } from "../components/three-d/Objects3D";
import { PALETTE } from "../lib/palette";
import { usePortfolio } from "../data/context";
import "./Skills.css";

const CELLS = 10;

export default function Skills() {
  const { skillGroups, status } = usePortfolio();
  const reduce = useReducedMotion();

  return (
    <section id="skills" className="section skills has-bg">
      {/* Blob ton sur ton, à peine plus clair que le fond de la section */}
      <BlobScene
        blobs={[{ corner: "top-right", radius: 260, color: PALETTE.soft, fade: PALETTE.bg3, steps: 2, seed: 27 }]}
      />
      <div className="container skills-inner">
        <Float3D className="skills-chip" depth={0.9}>
          <Chip />
        </Float3D>
        <header className="section-head">
          <SectionTitle>Compétences</SectionTitle>
          <p className="section-lead">
            Des interfaces soignées et un code propre, du premier croquis à la mise en ligne.
          </p>
        </header>

        {skillGroups.length > 0 ? (
          <div className="skill-groups">
            {skillGroups.map(([category, items]) => (
              <div className="skill-group" key={category}>
                <h3 className="skill-category">{category}</h3>
                <ul className="skill-list">
                  {items.map((s) => {
                    const level = Math.max(0, Math.min(100, Number(s.level) || 0));
                    // Chaque case vaut 10 % ; la dernière peut être partielle
                    const lit = level / (100 / CELLS);
                    return (
                      <motion.li
                        className="skill"
                        key={s.id ?? s.name}
                        initial="off"
                        whileInView="on"
                        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                      >
                        <div className="skill-top">
                          <span className="skill-name">{s.name}</span>
                          <ScrambleText className="skill-pct" text={`${level} %`} duration={700} />
                        </div>
                        <div
                          className="skill-cells"
                          role="meter"
                          aria-label={s.name}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={level}
                        >
                          {Array.from({ length: CELLS }, (_, c) => {
                            const fill = Math.max(0, Math.min(1, lit - c));
                            return (
                              <span className="skill-cell" key={c}>
                                {fill > 0 && (
                                  <motion.span
                                    className="skill-cell-fill"
                                    style={{ width: `${fill * 100}%` }}
                                    variants={{
                                      off: { scaleY: reduce ? 1 : 0 },
                                      on: {
                                        scaleY: 1,
                                        transition: { delay: c * 0.06, duration: 0.3, ease: "backOut" },
                                      },
                                    }}
                                  />
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          status !== "loading" && <p className="empty-note">Les compétences seront bientôt ajoutées.</p>
        )}
      </div>
    </section>
  );
}
