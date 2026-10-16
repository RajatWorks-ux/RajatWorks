import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";
import "./styles/MobileExperience.css";
import { config } from "../config";

function LivingField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let pointerX = 0;
    let pointerY = 0;
    let scrollProgress = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes: { x: number; y: number; z: number; phase: number; size: number }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes.length = 0;
      const count = Math.max(38, Math.min(74, Math.round((width * height) / 9500)));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0.25 + Math.random() * 0.75,
          phase: Math.random() * Math.PI * 2,
          size: 0.7 + Math.random() * 1.4,
        });
      }
    };

    const updateScroll = () => {
      const rect = canvas.getBoundingClientRect();
      scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
    };
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
    };
    const onTouch = (event: TouchEvent) => {
      if (!event.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      pointerX = event.touches[0].clientX - rect.left;
      pointerY = event.touches[0].clientY - rect.top;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = reducedMotion ? 0 : time * 0.00022;
      const shiftX = (pointerX - width / 2) * 0.035;
      const shiftY = (pointerY - height / 2) * 0.035;
      const cx = width * (0.53 + scrollProgress * 0.12);
      const cy = height * (0.43 + scrollProgress * 0.1);
      const radius = Math.min(width, height) * (0.22 + scrollProgress * 0.08);

      // Layered orbital rings: a lightweight, custom canvas visual rather than a video.
      ctx.save();
      ctx.translate(cx + shiftX, cy + shiftY);
      ctx.rotate(t * 0.8);
      for (let ring = 0; ring < 4; ring++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * (0.62 + ring * 0.16), radius * (0.32 + ring * 0.13), ring * 0.48, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(194,164,255,${0.1 + ring * 0.035})`;
        ctx.lineWidth = ring === 0 ? 1.1 : 0.65;
        ctx.stroke();
      }
      ctx.restore();

      const projected = nodes.map((node) => {
        const wobble = reducedMotion ? 0 : Math.sin(t * 2 + node.phase) * 8;
        const x = node.x + Math.sin(t + node.phase) * (node.z * 9) + shiftX * node.z;
        const y = node.y + Math.cos(t * 0.8 + node.phase) * (node.z * 8) + shiftY * node.z + wobble;
        return { x, y, z: node.z, size: node.size };
      });
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i], b = projected[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 78) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(194,164,255,${(1 - dist / 78) * 0.17 * Math.min(a.z, b.z)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      projected.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * node.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,202,255,${0.25 + node.z * 0.6})`;
        ctx.fill();
      });
      if (!reducedMotion) raf = window.requestAnimationFrame(draw);
    };

    resize();
    updateScroll();
    if (reducedMotion) draw(0);
    else raf = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    canvas.addEventListener("pointermove", onPointer, { passive: true });
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return <canvas ref={canvasRef} className="mobile-field-canvas" aria-hidden="true" />;
}

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      <section className="mobile-hero-experience" aria-label="Introduction">
        <div className="mobile-hero-gridline" aria-hidden="true" />
        <LivingField />
        <div className="mobile-hero-index">RW / 01 <span>INDEPENDENT DEVELOPER</span></div>
        <div className="mobile-hero-content">
          <p className="mobile-hero-kicker"><span /> HELLO, I'M</p>
          <h1><span>{firstName.toUpperCase()}</span><em>{lastName.toUpperCase()}</em></h1>
          <p className="mobile-hero-role">Full Stack Developer <i>·</i> UI / UX Designer</p>
          <div className="mobile-hero-capabilities">
            <span>ENGINEERING</span><span>INTERACTION</span><span>PRODUCTS</span>
          </div>
          <a className="mobile-hero-scroll" href="#about"><span>EXPLORE THE WORK</span><b>↓</b></a>
        </div>
        <div className="mobile-hero-coordinate" aria-hidden="true">DESIGN × CODE × SYSTEMS</div>
      </section>

      {/* Desktop hero intentionally retains its original markup and styling. */}
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>{firstName.toUpperCase()}<br />{lastName && <span>{lastName.toUpperCase()}</span>}</h1>
          </div>
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2"><div className="landing-h2-1">Designer</div><div className="landing-h2-2">Developer</div></h2>
            <h2><div className="landing-h2-info">Developer</div><div className="landing-h2-info-1">Designer</div></h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};
export default Landing;
