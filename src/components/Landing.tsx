import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const TOTAL_FRAMES = 77;
const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;
const frameImgs: HTMLImageElement[] = new Array(TOTAL_FRAMES).fill(null);

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName  = nameParts.slice(1).join(" ") || "";

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const curFrameRef = useRef(0);

  useEffect(() => {
    if (!isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // ─── HIGH QUALITY rendering settings ───
    ctx.imageSmoothingEnabled  = true;
    ctx.imageSmoothingQuality  = "high";

    // ─── Canvas sizing — CSS pixels only, NO DPR scaling ───
    // Frames are 540x960 portrait — we let CSS handle display scaling
    // This avoids blur from double-scaling
    const setCanvasSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width  = w;
      canvas.height = h;
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    // ─── Draw frame — portrait frames, cover fill, face at top-center ───
    const drawImg = (img: HTMLImageElement) => {
      if (!img?.complete || !img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;  // 540
      const ih = img.naturalHeight; // 960

      // object-fit: cover — fill canvas keeping aspect ratio
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      // Center horizontally, slight top bias (face stays visible)
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) * 0.10;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh);
    };

    const resize = () => {
      setCanvasSize();
      drawImg(frameImgs[curFrameRef.current]);
    };

    // ─── Load frames ───
    const loadFrame = (i: number) => {
      if (frameImgs[i]?.src) return;
      const img = new Image();
      const num = String(i + 1).padStart(3, "0");
      img.src = `/frames/ezgif-frame-${num}.jpg`;
      img.onload = () => {
        frameImgs[i] = img;
        if (i === 0) { resize(); }
      };
      frameImgs[i] = img;
    };

    setCanvasSize();
    loadFrame(0);
    setTimeout(() => {
      for (let i = 1; i < TOTAL_FRAMES; i++) loadFrame(i);
    }, 60);

    // ─── Reveal helper ───
    const reveal = (sel: string, show: boolean) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return;
      if (show) { el.classList.remove("s-hidden"); el.classList.add("s-visible"); }
      else       { el.classList.remove("s-visible"); el.classList.add("s-hidden"); }
    };

    // ─── Scroll handler ───
    // story-fixed-wrap is 300vh — sticky child stays pinned
    // User scrolls 300vh → frames play → About section appears naturally after
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) { ticking = false; return; }

        const wrapTop     = wrapper.getBoundingClientRect().top + window.scrollY;
        const scrolled    = Math.max(0, window.scrollY - wrapTop);
        const totalScroll = wrapper.offsetHeight - window.innerHeight;
        const p = Math.min(1, scrolled / Math.max(totalScroll, 1));

        // Frame index — maps scroll 0→1 to frame 0→76
        const idx = Math.min(TOTAL_FRAMES - 1, Math.round(p * (TOTAL_FRAMES - 1)));
        if (idx !== curFrameRef.current) {
          curFrameRef.current = idx;
          const img = frameImgs[idx];
          if (img?.complete && img.naturalWidth) drawImg(img);
        }

        // Text elements reveal at scroll milestones
        reveal(".story-greeting",    p >= 0.08);
        reveal(".sn-first",          p >= 0.18);
        reveal(".sn-last",           p >= 0.26);
        reveal(".story-role",        p >= 0.36);
        reveal(".st-1",              p >= 0.45);
        reveal(".st-2",              p >= 0.54);
        reveal(".st-3",              p >= 0.62);
        reveal(".story-scroll-hint", p >= 0.75 && p <= 0.97);

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
      {/*
        MOBILE HERO
        story-fixed-wrap → 300vh scroll space
        frame-sticky     → sticky, pinned to screen while parent scrolls
        After 300vh, About section appears naturally below
      */}
      <div className="story-fixed-wrap" ref={wrapperRef}>
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

      {/* DESKTOP — completely untouched */}
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

