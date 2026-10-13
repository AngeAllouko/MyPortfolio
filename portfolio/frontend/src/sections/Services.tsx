import { motion } from "motion/react";
import BlobScene from "../components/bg/BlobScene";
import SectionTitle from "../components/SectionTitle";
import Tilt from "../components/motion/Tilt";
import Float3D from "../components/three-d/Float3D";
import { Terminal3D } from "../components/three-d/Objects3D";
import { usePortfolio } from "../data/context";
import { PALETTE } from "../lib/palette";
import "./Services.css";

export default function Services() {
  const { skillGroups, status } = usePortfolio();

  return (
    <section id="services" className="section services has-bg">
      <BlobScene
        blobs={[
          { corner: "bottom-right", radius: 280, color: PALETTE.soft, fade: PALETTE.bg, steps: 2, seed: 33 },
        ]}
      />
      <div className="container services-inner">
        <Float3D className="services-terminal" depth={0.8}>
          <Terminal3D command="npm run dev" />
        </Float3D>
        <header className="section-head">
          <SectionTitle>Ce que je propose</SectionTitle>
          <p className="section-lead">
            Des sites web réactifs et des applications mobiles iOS, propres et faciles à faire évoluer.
          </p>
        </header>

        {skillGroups.length > 0 ? (
          <ul className="service-grid">
            {skillGroups.map(([category, items], i) => (
              <motion.li
                key={category}
                // Les cartes arrivent en éventail, comme distribuées
                initial={{ opacity: 0, y: 60, rotate: -6 + i * 4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ type: "spring", stiffness: 90, damping: 16, delay: i * 0.1 }}
              >
                <Tilt className="service-card">
                  <div className="service-top">
                    <span className="service-count">
                      {items.length} outil{items.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <h3 className="service-name">{category}</h3>
                  <ul className="service-tags" aria-label={`Outils pour ${category}`}>
                    {items.map((s) => (
                      <li key={s.id ?? s.name}>{s.name}</li>
                    ))}
                  </ul>
                </Tilt>
              </motion.li>
            ))}
          </ul>
        ) : (
          status !== "loading" && (
            <p className="empty-note">Les services seront bientôt détaillés ici.</p>
          )
        )}
      </div>
    </section>
  );
}
