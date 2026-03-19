import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName  = nameParts.slice(1).join(" ") || "";

  const videoRef     = useRef<HTMLVideoElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const sectionRef   = useRef<HTMLDivElement>(null);
  const fixedWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth >= 1025) return;

    const video    = videoRef.current;
    const progress = progressRef.current;
    const section  = sectionRef.current;
    const fixedWrap = fixedWrapRef.current;
    if (!video || !section || !fixedWrap) return;

    // Video pause — scroll se chalegi
    video.addEventListener("loadedmetadata", () => {
      video.pause();
      video.currentTime = 0;
    });

    const onScroll = () => {
      const rect    = section.getBoundingClientRect();
      const scrollY = window.scrollY;
      const sectionTop    = scrollY + rect.top;
      const sectionHeight = section.offsetHeight; // 300vh
      const viewH   = window.innerHeight;

      // Section ke andar hain? Fixed video dikhao
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight - viewH) {
        fixedWrap.style.display = "block";

        // Progress: 0 (top) → 1 (bottom of section)
        const scrolled = scrollY - sectionTop;
        const scrollable = sectionHeight - viewH;
        const pct = Math.max(0, Math.min(1, scrolled / scrollable));

        if (video.duration) {
          video.currentTime = pct * video.duration;
        }
        if (progress) progress.style.width = `${pct * 100}%`;

      } else {
        // Section se bahar — fixed hide karo
        fixedWrap.style.display = "none";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Initial call

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ══ MOBILE: Fixed video (position:fixed — overflow se affect nahi) ══ */}
      <div className="story-fixed-wrap" ref={fixedWrapRef}>
        {/* Progress bar */}
        <div className="story-progress" ref={progressRef} />

        {/* Glows */}
        <div className="story-glow story-glow-1" />
        <div className="story-glow story-glow-2" />

        {/* Video */}
        <video
          ref={videoRef}
          className="story-video"
          src="/rajat.mp4"
          autoPlay
          muted
          playsInline
          loop={false}
          preload="auto"
        />

        {/* Overlay */}
        <div className="story-overlay" />

        {/* Text */}
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

        {/* Tags */}
        <span className="story-tag st-1">React</span>
        <span className="story-tag st-2">Node.js</span>
        <span className="story-tag st-3">Next.js</span>
      </div>

      {/* ══ LANDING SECTION ══ */}
      <div className="landing-section" id="landingDiv" ref={sectionRef}>

        {/* Desktop text (same as original) */}
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

        {/* Desktop: 3D character */}
        {children}
      </div>
    </>
  );
};

export default Landing;



              
