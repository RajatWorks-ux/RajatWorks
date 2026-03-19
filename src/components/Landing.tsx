import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName  = nameParts.slice(1).join(" ") || "";

  const videoRef  = useRef<HTMLVideoElement>(null);
  const storyRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on mobile
    if (window.innerWidth >= 1025) return;

    const video = videoRef.current;
    if (!video) return;

    // Pause auto-play — scroll se drive karenge
    const onLoaded = () => {
      video.pause();
      video.currentTime = 0;
    };
    video.addEventListener("loadedmetadata", onLoaded);

    // Scroll → video progress
    const onScroll = () => {
      if (!video.duration || !storyRef.current) return;
      const rect     = storyRef.current.getBoundingClientRect();
      const scrolled = -rect.top;                          // kitna scroll hua
      const total    = rect.height - window.innerHeight;   // total scrollable
      const progress = Math.max(0, Math.min(1, scrolled / total));
      video.currentTime = progress * video.duration;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div className="landing-section" id="landingDiv">

        {/* ── Desktop text (same as before) ── */}
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

        {/* ══════════════════════════════════════════
            MOBILE STORYTELLING  —  only <1025px
            300vh height = scroll space for video
        ═════════════════════════════════════════ */}
        <div className="mobile-story" ref={storyRef}>

          {/* Sticky video wrapper */}
          <div className="story-sticky">

            {/* Purple glows — match site vibe */}
            <div className="story-glow story-glow-1" />
            <div className="story-glow story-glow-2" />

            {/*
              ╔══════════════════════════════════╗
              ║  TUMHARA EK KAAM:                ║
              ║  Video ko rakho yahan:           ║
              ║  public/rajat.mp4         ║
              ║  (.mp4 / .webm / .mov sab chalte)║
              ╚══════════════════════════════════╝
            */}
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

            {/* Dark gradient overlay */}
            <div className="story-overlay" />

            {/* Text at bottom */}
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

            {/* Floating tech tags */}
            <span className="story-tag st-1">React</span>
            <span className="story-tag st-2">Node.js</span>
            <span className="story-tag st-3">Next.js</span>
          </div>
        </div>

        {/* Desktop: 3D character (unchanged) */}
        {children}
      </div>
    </>
  );
};

export default Landing;

              
