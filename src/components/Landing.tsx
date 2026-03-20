import { PropsWithChildren, useEffect } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName  = nameParts.slice(1).join(" ") || "";

  // ── Mobile parallax: hero image scrolls slower than page ──
  useEffect(() => {
    if (window.innerWidth > 1024) return;
    const img = document.querySelector(".story-image") as HTMLElement | null;
    if (!img) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        if (y < vh) {
          // Subtle upward drift: image moves 20% as fast as scroll
          img.style.transform = `translateY(${y * 0.2}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          loading="eager"
          fetchPriority="high"
          decoding="async"
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

      





