import { useState } from "react";
import "./styles/Career.css";
import "./styles/MobileExperience.css";
import { config } from "../config";

const EraDivider = ({ label, sub }: { label: string; sub: string }) => (
  <div className="career-era-divider">
    <div className="career-era-line" />
    <div className="career-era-label">
      <span className="career-era-title">{label}</span>
      <span className="career-era-sub">{sub}</span>
    </div>
    <div className="career-era-line" />
  </div>
);

const EvolutionMap = () => {
  const experiences = config.experiences;
  const [expanded, setExpanded] = useState<number | null>(4);
  let lastEra = "";
  return (
    <section className="evolution-map" aria-labelledby="evolution-title">
      <div className="evolution-heading">
        <div className="evolution-eyebrow"><span>FIELD NOTES / 2020—2026</span><span>PERSONAL EVOLUTION</span></div>
        <h2 id="evolution-title">My journey <span>&</span><br />story<span className="evolution-period">.</span></h2>
        <p>From first lines of code to products built for real people. Every milestone changed how I build.</p>
      </div>
      <div className="evolution-map-line" aria-hidden="true"><span /></div>
      <div className="evolution-milestones">
        {experiences.map((exp, index) => {
          const showDivider = exp.era !== lastEra;
          lastEra = exp.era;
          const isOpen = expanded === index;
          return (
            <div className={`evolution-entry ${isOpen ? "is-expanded" : ""}`} key={`${exp.period}-${exp.position}`}>
              {showDivider && (
                <div className="evolution-era">
                  <span className="evolution-era-node" />
                  <div><small>PHASE {exp.era === "learning" ? "01" : "02"}</small><strong>{exp.era === "learning" ? "Foundation" : "Builder era"}</strong></div>
                  <span>{exp.era === "learning" ? "2020 — 2023" : "2023 — 2026"}</span>
                </div>
              )}
              <button className="evolution-milestone" type="button" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : index)}>
                <span className="evolution-year">{exp.period}</span>
                <span className="evolution-milestone-main">
                  <small>{exp.type === "freelance" ? "BUILDER / SHIPPED WORK" : "LEARNING / FOUNDATION"}</small>
                  <strong>{exp.position}</strong><em>{exp.company}</em>
                </span>
                <span className="evolution-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
              <div className="evolution-description" hidden={!isOpen}>
                <p>{exp.description}</p>
                <span className="evolution-index">MILESTONE {String(index + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const Career = () => {
  const experiences = config.experiences;
  let lastEra = "";
  return (
    <>
      {/* Mobile experience is isolated from the original desktop career layout. */}
      <div className="career-mobile-evolution">
        <EvolutionMap />
      </div>
      {/* Original desktop career markup and hierarchy retained. */}
      <div className="career-desktop-original career-section section-container">
        <div className="career-container">
          <h2>My journey <span>&</span><br /> story</h2>
          <div className="career-info">
            <div className="career-timeline"><div className="career-dot"></div></div>
            {experiences.map((exp, index) => {
              const showDivider = exp.era !== lastEra;
              lastEra = exp.era;
              return (
                <div key={index}>
                  {showDivider && (
                    <EraDivider
                      label={exp.era === "learning" ? "Learning Era" : "Builder Era"}
                      sub={exp.era === "learning" ? "2020 – 2023 · Foundation" : "2023 – 2026 · Shipping Real Things"}
                    />
                  )}
                  <div className="career-info-box">
                    <div className="career-info-in">
                      <div className="career-role">
                        <span className={`career-badge career-badge--${exp.type}`}>
                          {exp.type === "freelance" ? "⚡ Builder" : "📖 Learning"}
                        </span>
                        <h4>{exp.position}</h4>
                        <h5>{exp.company}</h5>
                      </div>
                      <h3>{exp.period}</h3>
                    </div>
                    <p>{exp.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default Career;
