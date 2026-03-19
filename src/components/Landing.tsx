import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts  = config.developer.fullName.split(" ");
  const firstName  = nameParts[0] || config.developer.name;
  const lastName   = nameParts.slice(1).join(" ") || "";

  const videoRef    = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth >= 1025) return;

    const video    = videoRef.current;
    const progress = progressRef.current;
    if (!video) return;

    // Video ko pause rakho — scroll se drive karenge
    const onMeta = () => {
      video.pause();
      video.currentTime = 0;
    };
    video.addEventListener("loadedmetadata", onMeta);

    // Scroll → video currentTime + progress bar
    const onScroll = () => {
      if (!video.duration) return;

      // landing-section ki height 300vh hai
      // pehla vh video hai, baaki 2vh scroll room
      const scrollY  = window.scrollY;
      const oneVh    = window.innerHeight;
      const scrollIn = Math.max(0, scrollY);           // kitna scroll hua
      const maxScroll = oneVh * 2;                     // 200vh = poori video
      const pct      = Math.min(1, scrollIn / maxScroll);

      video.currentTime = pct * video.duration;

      if (progress) {
        progress.style.width = `${pct * 100}%`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div className="landing-section" id="landingDiv">

        {/* ── Desktop text (same as original) ── */}
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
            MOBILE VIDEO SCROLL  —  ≤1024px only
            300vh tall, sticky inner, scroll = video
        ═════════════════════════════════════════ */}
        <div className="mobile-story">
          <div className="story-sticky">

            {/* Scroll progress bar — top mein thin purple line */}
            <div className="story-progress" ref={progressRef} />

            {/* Purple glows */}
            <div className="story-glow story-glow-1" />
            <div className="story-glow story-glow-2" />

            {/*
              ╔══════════════════════════════════════╗
              ║  Video path: public/rajat.mp4        ║
              ║  (GitHub mein public/ ke andar)      ║
              ╚══════════════════════════════════════╝
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

            {/* Bottom gradient */}
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

            {/* Floating tags */}
            <span className="story-tag st-1">React</span>
            <span className="story-tag st-2">Node.js</span>
            <span className="story-tag st-3">Next.js</span>
          </div>
        </div>

        {/* Desktop: 3D character */}
        {children}
      </div>
    </>
  );
};

export default Landing;


              
