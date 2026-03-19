import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
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

        {/* ── Mobile Storytelling Hero ── */}
        <div className="mobile-story">
          <div className="story-photo-wrap">
            <div className="story-glow story-glow-1"></div>
            <div className="story-glow story-glow-2"></div>
            {/*
              ⚠️  TUMHARA KAAM (1 step):
              Apni photo file rename karo:
                InShot-20260319-175834298.webp  →  rajat.webp
              Aur rakho yahan:  public/images/rajat.webp
            */}
            <img
              src="/images/rajat.webp"
              alt="Rajat Kumar Dua"
              className="story-photo"
              loading="eager"
            />
            <div className="story-photo-overlay"></div>
          </div>

          <div className="story-text">
            <p className="story-greeting">Hello, I'm</p>
            <h1 className="story-name">
              <span className="story-name-first">RAJAT</span>
              <span className="story-name-last">KUMAR DUA</span>
            </h1>
            <div className="story-role">
              <span>Full Stack Developer</span>
              <span className="story-role-sep">·</span>
              <span>UI/UX Designer</span>
            </div>
            <div className="story-scroll-hint">
              <span>scroll</span>
              <div className="story-scroll-line"></div>
            </div>
          </div>

          <div className="story-tag story-tag-1">React</div>
          <div className="story-tag story-tag-2">Node.js</div>
          <div className="story-tag story-tag-3">Next.js</div>
        </div>

        {children}
      </div>
    </>
  );
};

export default Landing;
