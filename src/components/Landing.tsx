import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName  = nameParts.slice(1).join(" ") || "";

  const videoRef     = useRef<HTMLVideoElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const fixedWrapRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const targetTime   = useRef<number>(0);
  const currentTime  = useRef<number>(0);

  useEffect(() => {
    if (window.innerWidth >= 1025) return;

    const video     = videoRef.current;
    const progress  = progressRef.current;
    const fixedWrap = fixedWrapRef.current;
    if (!video || !fixedWrap) return;

    video.addEventListener("loadedmetadata", () => {
      video.pause();
      video.currentTime = 0;
    });

    // ── RAF loop — smooth interpolation ──
    // Seedha currentTime set karna stuttering deta hai
    // Iss loop mein slowly target ki taraf move karte hain
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const rafLoop = () => {
      if (video.duration) {
        // Smoothly move toward target (0.12 = speed)
        currentTime.current = lerp(currentTime.current, targetTime.current, 0.12);
        
        // Sirf tab set karo jab difference noticeable ho
        if (Math.abs(currentTime.current - video.currentTime) > 0.01) {
          video.currentTime = currentTime.current;
        }
        if (progress) {
          progress.style.width = `${(currentTime.current / video.duration) * 100}%`;
        }
      }
      rafRef.current = requestAnimationFrame(rafLoop);
    };
    rafRef.current = requestAnimationFrame(rafLoop);

    // ── Scroll handler — sirf targetTime update karo ──
    const vh = window.innerHeight;
    const maxScroll = vh * 2; // 300vh section - 1vh visible = 200vh scroll

    const onScroll = () => {
      const pct = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      
      // Video show/hide
      if (window.scrollY < maxScroll + vh) {
        fixedWrap.style.display = "block";
        if (video.duration) {
          targetTime.current = pct * video.duration;
        }
      } else {
        fixedWrap.style.display = "none";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Fixed video wrapper — mobile only */}
      <div className="story-fixed-wrap" ref={fixedWrapRef}>
        <div className="story-progress" ref={progressRef} />
        <div className="story-glow story-glow-1" />
        <div className="story-glow story-glow-2" />
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

      {/* Landing section */}
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
      



              
