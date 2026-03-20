import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName  = nameParts.slice(1).join(" ") || "";

  return (
    <>
      {/* ══ MOBILE HERO — Image wala ══ */}
      <div className="story-fixed-wrap">
        <div className="story-glow story-glow-1" />
        <div className="story-glow story-glow-2" />

        {/*
          ╔══════════════════════════════════════╗
          ║  Apni photo rename karo:             ║
          ║  rajat.webp (ya rajat.jpg)           ║
          ║  Rakho: public/images/rajat.webp     ║
          ╚══════════════════════════════════════╝
        */}
        <img
          src="/images/rajat.webp"
          alt="Rajat Kumar Dua"
          className="story-image"
        />

        <div className="story-overlay" />

        <div className="story-text">
          <p className="story-greeting">Hello, I'm</p>
          <h1 className="story-name">
            <span className="sn-first">RAJAT</span>
            <span className="sn-last">KUMAR DUA</span>
          </h1>
          <div className="story-role">
            <span>Full Stack Developer</span>
            <span className="story-sep">·</span>
            <span>UI / UX Designer</span>
          </div>
          <div className="story-scroll-hint">
            <span>scroll</span>
            <div className="story-scroll-line" />
          </div>
        </div>

        <span className="story-tag st-1">React</span>
        <span className="story-tag st-2">Node.js</span>
        <span className="story-tag st-3">Next.js</span>
      </div>

      {/* Landing section — mobile pe sirf scroll space */}
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
          </div>
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Designer</div>
              <div className="landing-h2-2">Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Developer</div>
              <div className="landing-h2-info-1">Designer</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;

      



              
