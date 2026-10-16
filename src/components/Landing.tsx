import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName  = nameParts.slice(1).join(" ") || "";

  // Mobile intentionally uses a lightweight editorial hero instead of the old
  // scroll-locked frame sequence. Desktop hero markup and the 3D experience remain unchanged.



  return (
    <>
      {/* ══ MOBILE HERO — fullscreen, scroll-locked until frames done ══ */}
      {/* Rendered in DOM on mobile only (static check at load time) */}
      <div className="story-fixed-wrap">
        <div className="frame-sticky">
          <canvas className="frame-canvas" aria-hidden="true" />
          <div className="story-glow story-glow-1" />
          <div className="story-glow story-glow-2" />
          <div className="story-overlay" />
          <span className="story-tag st-1 s-hidden">React</span>
          <span className="story-tag st-2 s-hidden">Node.js</span>
          <span className="story-tag st-3 s-hidden">Next.js</span>
          <div className="story-text">
            <p className="story-greeting s-hidden">Hello, I'm</p>
            <h1 className="story-name">
              <span className="sn-first s-hidden">RAJAT</span>
              <span className="sn-last  s-hidden">KUMAR DUA</span>
            </h1>
            <div className="story-role s-hidden">
              <span>Full Stack Developer</span>
              <span className="story-sep">·</span>
              <span>UI / UX Designer</span>
            </div>
            <div className="story-scroll-hint s-hidden">
              <span className="ssh-label">scroll</span>
              <div className="story-scroll-line">
                <span className="ssl-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ DESKTOP — completely untouched ══ */}
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
                
