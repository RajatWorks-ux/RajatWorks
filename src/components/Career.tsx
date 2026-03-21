import "./styles/Career.css";
import { config } from "../config";

// Render an era divider between Learning → Builder phase
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

const Career = () => {
  // Find where era switches so we can inject the divider once
  const experiences = config.experiences;
  let lastEra = "";

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My journey <span>&</span>
          <br /> story
        </h2>

        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {experiences.map((exp, index) => {
            // Inject era divider the first time era changes
            const showDivider = exp.era !== lastEra;
            lastEra = exp.era;

            return (
              <div key={index}>
                {/* Era section header */}
                {showDivider && (
                  <EraDivider
                    label={
                      exp.era === "learning"
                        ? "Learning Era"
                        : "Builder Era"
                    }
                    sub={
                      exp.era === "learning"
                        ? "2020 – 2023 · Foundation"
                        : "2023 – 2026 · Shipping Real Things"
                    }
                  />
                )}

                {/* Card */}
                <div className="career-info-box">
                  <div className="career-info-in">
                    <div className="career-role">
                      <span
                        className={`career-badge career-badge--${exp.type}`}
                      >
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
  );
};

export default Career;
                      
