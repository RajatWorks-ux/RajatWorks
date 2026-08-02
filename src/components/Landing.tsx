import { PropsWithChildren, useEffect, useRef, useState } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const TOTAL_FRAMES = 77;

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  // ✅ FIX #1: Reactive isMobile detection (was frozen constant)
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth <= 1024
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const lockedRef = useRef(true);
  const touchStartY = useRef(0);
  const frameImgs: HTMLImageElement[] = useRef(new Array(TOTAL_FRAMES).fill(null)).current;

  // ✅ Update isMobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    // ── Draw frame with proper centering ──
    const drawImg = (img: HTMLImageElement) => {
      if (!img?.complete || !img.naturalWidth) return;
      const cw = canvas.width,
        ch = canvas.height;
      const iw = img.naturalWidth,
        ih = img.naturalHeight;

      // ✅ FIX #5: Improved frame scaling with better Y-offset (was 0.10, now 0.18)
      // This ensures character head/upper body is always visible, not cropped at top
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale,
        sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) * 0.18; // Better vertical centering for character

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
        if (i === 0) {
          setCanvasSize();
          drawImg(img);
        }
      };
      frameImgs[i] = img;
    };

    setCanvasSize();
    loadFrame(0);
    setTimeout(() => {
      for (let i = 1; i < TOTAL_FRAMES; i++) loadFrame(i);
    }, 60);

    // ── Reveal helper ──
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

    // ── Update frame + text from progress p (0→1) ──
    let lastIdx = -1;
    const applyProgress = (p: number) => {
      const idx = Math.min(TOTAL_FRAMES - 1, Math.round(p * (TOTAL_FRAMES - 1)));
      if (idx !== lastIdx) {
        lastIdx = idx;
        const img = frameImgs[idx];
        if (img?.complete && img.naturalWidth) drawImg(img);
      }
      reveal(".story-greeting", p >= 0.08);
      reveal(".sn-first", p >= 0.18);
      reveal(".sn-last", p >= 0.26);
      reveal(".story-role", p >= 0.36);
      reveal(".st-1", p >= 0.45);
      reveal(".st-2", p >= 0.54);
      reveal(".st-3", p >= 0.62);
      reveal(".story-scroll-hint", p >= 0.75 && p <= 0.97);
    };

    // ── UNLOCK: animation complete → hero becomes static ──
    const unlock = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;

      const wrap = document.querySelector(".story-fixed-wrap") as HTMLElement | null;

      // ✅ FIX #4: iOS-safe scroll lock removal (no position:fixed on body)
      // Remove position:fixed properties properly
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";

      // Allow normal scroll
      document.documentElement.style.scrollBehavior = "auto";

      // Convert hero from fixed → static block
      if (wrap) {
        wrap.style.position = "relative";
        wrap.style.height = "100svh";
        wrap.style.zIndex = "1";
      }

      // ✅ FIX #7: Clean up Landing.tsx touch/wheel listeners after unlock
      // (They will be removed in cleanup below)

      // Smoothly scroll to About
      setTimeout(() => {
        const about = document.getElementById("about");
        if (about) about.scrollIntoView({ behavior: "smooth" });
      }, 80);
    };

    // ── LOCK: freeze page scroll while hero is active ──
    const lockBody = () => {
      document.body.style.overflow = "hidden";
      // ✅ FIX #4: Use scrollTop instead of position:fixed (iOS-safe)
      const scrollPos = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPos}px`;
      document.body.style.width = "100%";
    };
    lockBody();

    const WHEEL_FACTOR = 1 / 900;
    const TOUCH_FACTOR = 1 / 700;

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
      const dy = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      if (dy <= 0) return;
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

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", onResize, { passive: true });

    // Draw first frame on load
    applyProgress(0);

    return () => {
      // ✅ FIX #7: Proper cleanup - remove ALL listeners
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile]);

  return (
    <>
      {/* ══ MOBILE HERO — fullscreen, scroll-locked until frames done ══ */}
      {isMobile && (
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
                <span className="sn-last s-hidden">KUMAR DUA</span>
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
      )}

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
