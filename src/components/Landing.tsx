import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const TOTAL_FRAMES  = 77;
const isMobile      = typeof window !== "undefined" && window.innerWidth <= 1024;
const frameImgs: HTMLImageElement[] = new Array(TOTAL_FRAMES).fill(null);

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName  = nameParts.slice(1).join(" ") || "";

  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const progressRef  = useRef(0);   // virtual scroll progress 0→1
  const lockedRef    = useRef(true); // true = scroll locked in hero
  const touchStartY  = useRef(0);

  useEffect(() => {
    if (!isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // ── Canvas size ──
    const setCanvasSize = () => {
      canvas.width        = window.innerWidth;
      canvas.height       = window.innerHeight;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    // ── Draw frame ──
    const drawImg = (img: HTMLImageElement) => {
      if (!img?.complete || !img.naturalWidth) return;
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale, sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) * 0.10;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh);
    };

    // ── Load frames ──
    const loadFrame = (i: number) => {
      if (frameImgs[i]?.src) return;
      const img = new Image();
      img.src = `/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;
      img.onload = () => {
        frameImgs[i] = img;
        if (i === 0) { setCanvasSize(); drawImg(img); }
      };
      frameImgs[i] = img;
    };

    setCanvasSize();
    loadFrame(0);
    setTimeout(() => { for (let i = 1; i < TOTAL_FRAMES; i++) loadFrame(i); }, 60);

    // ── Reveal helper ──
    const reveal = (sel: string, show: boolean) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return;
      if (show) { el.classList.remove("s-hidden"); el.classList.add("s-visible"); }
      else       { el.classList.remove("s-visible"); el.classList.add("s-hidden"); }
    };

    // ── Update frame + text from progress p (0→1) ──
    let lastIdx = -1;
    const applyProgress = (p: number) => {
      const idx = Math.min(TOTAL_FRAMES - 1, Math.round(p * (TOTAL_FRAMES - 1)));
      if (idx !== lastIdx) {
        lastIdx = idx;
        const img = frameImgs[idx];
        if (img?.complete && img.naturalWidth) drawImg(img);
      }
      reveal(".story-greeting",    p >= 0.08);
      reveal(".sn-first",          p >= 0.18);
      reveal(".sn-last",           p >= 0.26);
      reveal(".story-role",        p >= 0.36);
      reveal(".st-1",              p >= 0.45);
      reveal(".st-2",              p >= 0.54);
      reveal(".st-3",              p >= 0.62);
      reveal(".story-scroll-hint", p >= 0.75 && p <= 0.97);
    };

    // ── UNLOCK: animation complete → hide hero → scroll to About ──
    const unlock = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;

      // Hide the fixed hero overlay
      const wrap = document.querySelector(".story-fixed-wrap") as HTMLElement | null;
      if (wrap) {
        wrap.style.transition = "opacity 0.4s ease";
        wrap.style.opacity    = "0";
        setTimeout(() => { wrap.style.display = "none"; }, 420);
      }

      // Restore body scroll
      document.body.style.overflow  = "";
      document.body.style.position  = "";
      document.body.style.width     = "";

      // Scroll to About section
      setTimeout(() => {
        const about = document.getElementById("about");
        if (about) about.scrollIntoView({ behavior: "smooth" });
      }, 440);
    };

    // ── LOCK: freeze page scroll while hero is active ──
    const lockBody = () => {
      document.body.style.overflow  = "hidden";
      document.body.style.position  = "fixed";
      document.body.style.width     = "100%";
    };
    lockBody();

    // How much virtual scroll per wheel tick / touch px
    const WHEEL_FACTOR = 1 / 900;   // ~900px total wheel to finish
    const TOUCH_FACTOR = 1 / 700;   // ~700px drag to finish

    // ── Wheel handler ──
    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      progressRef.current = Math.min(1, progressRef.current + Math.abs(e.deltaY) * WHEEL_FACTOR);
      applyProgress(progressRef.current);
      if (progressRef.current >= 1) unlock();
    };

    // ── Touch handlers ──
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      const dy = touchStartY.current - e.touches[0].clientY; // positive = scroll down
      touchStartY.current = e.touches[0].clientY;
      if (dy <= 0) return; // ignore upward swipes
      progressRef.current = Math.min(1, progressRef.current + dy * TOUCH_FACTOR);
      applyProgress(progressRef.current);
      if (progressRef.current >= 1) unlock();
    };

    // ── Resize ──
    const onResize = () => {
      setCanvasSize();
      const img = frameImgs[lastIdx >= 0 ? lastIdx : 0];
      if (img?.complete && img.naturalWidth) drawImg(img);
    };

    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    window.addEventListener("resize",     onResize,     { passive: true  });

    // Draw first frame on load
    applyProgress(0);

    return () => {
      // Always restore scroll on unmount
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width    = "";
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("resize",     onResize);
    };
  }, []);

  return (
    <>
      {/* ══ MOBILE HERO — fullscreen, scroll-locked until frames done ══ */}
      <div className="story-fixed-wrap">
        <div className="frame-sticky">
          <canvas ref={canvasRef} className="frame-canvas" />
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

