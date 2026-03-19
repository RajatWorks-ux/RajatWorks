import "./styles/About.css";
import { config } from "../config";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{config.about.title}</h3>
        <p className="para">{config.about.description}</p>

        {/* ── Stats Cards ── */}
        <div className="about-stats">
          <div className="about-stat">
            <span className="astat-num">2+</span>
            <span className="astat-lbl">Years Exp.</span>
          </div>
          <div className="about-stat">
            <span className="astat-num">15+</span>
            <span className="astat-lbl">Projects</span>
          </div>
          <div className="about-stat">
            <span className="astat-num">5+</span>
            <span className="astat-lbl">Clients</span>
          </div>
        </div>

        {/* ── Skill Tags ── */}
        <div className="about-tags">
          {["Full Stack", "React", "Node.js", "UI/UX", "Next.js", "TypeScript"].map(t => (
            <span key={t} className="about-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;

