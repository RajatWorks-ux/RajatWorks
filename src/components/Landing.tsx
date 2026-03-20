import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";
import { config } from "../config";

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
const TOTAL_FRAMES = 77;
const isMobile =
  typeof window !== "undefined" && window.innerWidth <= 1024;

// Module-level frame cache — survives re-renders, no double loading
const frameImgs: HTMLImageElement[] = new Array(TOTAL_FRAMES).fill(null);

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName  = nameParts.slice(1).join(" ") || "";

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const curFrameRef = useRef(0);

  // ── MOBILE: Frame sequence + scroll-reveal ──
  useEffect(() => {
    if (!isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // ── Draw one frame — object-fit: cover logic ──
    const drawImg = (img: HTMLImageElement) => {
      if (!img?.complete || !img.naturalWidth) return;
      const cw = canvas.width  || window.innerWidth;
      const ch = canvas.height || window.innerHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) / 2;
      // Face upper-center: 15% from top
      const sy = (ch - sh) * 0.15;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh);
    };

    // ── Resize canvas ──
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      drawImg(frameImgs[curFrameRef.current]);
    };

    // ── Preload frames ──
    // Frame 0 (first) loads priority → shows immediately
    const loadFrame = (i: number) => {
      if (frameImgs[i]?.src) return;       // already queued
      const img  = new Image();
      const num  = String(i + 1).padStart(3, "0");
      img.src    = `/frames/frame_${num}.jpg`;
      img.onload = () => {
        frameImgs[i] = img;
        if (i === 0) { resize(); }
      };
      frameImgs[i] = img;
    };

    // Priority load first frame, then the rest
    loadFrame(0);
    requestAnimationFrame(() => {
      for (let i = 1; i < TOTAL_FRAMES; i++) loadFrame(i);
    });

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // ── Scroll-reveal helper ──
    const reveal = (sel: string, show: boolean) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return;
      if (show) {
        el.classList.remove("s-hidden");
        el.classList.add("s-visible");
      } else {
        el.classList.remove("s-visible");
        el.classList.add("s-hidden");
      }
    };

    // ── Scroll handler ──
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) { ticking = false; return; }

        const wrapTop     = wrapper.getBoundingClientRect().top + window.scrollY;
        const scrolled    = window.scrollY - wrapTop;
        const totalScroll = wrapper.offsetHeight - window.innerHeight;
        const p = Math.max(0, Math.min(1, scrolled / Math.max(totalScroll, 1)));

        // Frame index
        const idx = Math.min(TOTAL_FRAMES - 1, Math.round(p * (TOTAL_FRAMES - 1)));
        if (idx !== curFrameRef.current) {
          curFrameRef.current = idx;
          const img = frameImgs[idx];
          if (img?.complete && img.naturalWidth) drawImg(img);
        }

        // Text reveals — each tied to scroll depth
        reveal(".story-greeting",    p >= 0.06);
        reveal(".sn-first",          p >= 0.14);
        reveal(".sn-last",           p >= 0.22);
        reveal(".story-role",        p >= 0.30);
        reveal(".st-1",              p >= 0.40);
        reveal(".st-2",              p >= 0.50);
        reveal(".st-3",              p >= 0.58);
        reveal(".story-scroll-hint", p >= 0.72 && p <= 0.95);

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize,   { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* ══ MOBILE HERO — 300vh scroll space, sticky canvas inside ══ */}
      <div className="story-fixed-wrap" ref={wrapperRef}>
        <div className="frame-sticky">

          {/* Canvas — frame renderer */}
          <canvas ref={canvasRef} className="frame-canvas" />

          {/* Ambient purple glows */}
          <div className="story-glow story-glow-1" />
          <div className="story-glow story-glow-2" />

          {/* Dark gradient overlay */}
          <div className="story-overlay" />

          {/* Floating glassmorphism tech tags */}
          <span className="story-tag st-1 s-hidden">React</span>
          <span className="story-tag st-2 s-hidden">Node.js</span>
          <span className="story-tag st-3 s-hidden">Next.js</span>

          {/* Text block — pinned to bottom */}
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

      {/* ══ DESKTOP SECTION — completely untouched ══ */}
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
            
