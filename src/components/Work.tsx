import "./styles/Work.css";
import { useState, useEffect, useRef } from "react";
import { config } from "../config";
import { MdArrowOutward } from "react-icons/md";

// ─── Lightbox (same as WorkImage — reused here directly) ─────
const Lightbox = ({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) => {
  const [current, setCurrent] = useState(startIndex);
  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.95)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <button onClick={onClose} style={{
        position: "absolute", top: 16, right: 16,
        width: 40, height: 40, borderRadius: "50%", border: "none",
        background: "rgba(255,255,255,0.15)", color: "#fff",
        fontSize: 18, cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}>✕</button>

      <div style={{
        position: "absolute", top: 16, left: "50%",
        transform: "translateX(-50%)", color: "rgba(255,255,255,0.7)",
        fontSize: 13, background: "rgba(0,0,0,0.4)",
        padding: "3px 12px", borderRadius: 20,
      }}>{current + 1} / {images.length}</div>

      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          width: 48, height: 48, borderRadius: "50%", border: "none",
          background: "rgba(255,255,255,0.12)", color: "#fff",
          fontSize: 28, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>‹</button>
      )}

      <img key={current} src={images[current]} alt={`Photo ${current + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain",
          borderRadius: 12, boxShadow: "0 0 60px rgba(0,0,0,0.8)",
        }}
      />

      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); next(); }} style={{
          position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
          width: 48, height: 48, borderRadius: "50%", border: "none",
          background: "rgba(255,255,255,0.12)", color: "#fff",
          fontSize: 28, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>›</button>
      )}

      {images.length > 1 && (
        <div style={{
          position: "absolute", bottom: 20, left: "50%",
          transform: "translateX(-50%)", display: "flex", gap: 8,
        }}>
          {images.map((_, i) => (
            <button key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              style={{
                width: i === current ? 16 : 8, height: 8, borderRadius: 4,
                border: "none",
                background: i === current ? "#fff" : "rgba(255,255,255,0.35)",
                cursor: "pointer", transition: "all 0.2s", padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Single Bento Card ────────────────────────────────────────
const BentoCard = ({
  project,
  index,
  variant,
}: {
  project: (typeof config.projects)[0];
  index: number;
  variant: "wide" | "tall" | "square";
}) => {
  const [expanded, setExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver fade-in
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("bento-card--visible");
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const paragraphs = project.description.split("\n\n");
  const shortDesc = paragraphs[0];
  const extraDesc = paragraphs.slice(1).join("\n\n");
  const hasMore = !!(extraDesc || project.warning);

  // Thumbnail image — first image in the array
  const thumb = project.images[0];

  return (
    <>
      <div
        ref={cardRef}
        className={`bento-card bento-card--${variant}`}
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* ── Thumbnail ── */}
        <div
          className="bento-thumb"
          onClick={() => setLightboxOpen(true)}
          data-cursor="disable"
          title="Click to view all photos"
        >
          <img src={thumb} alt={project.title} loading="lazy" />
          {project.images.length > 1 && (
            <span className="bento-photo-count">
              1/{project.images.length} &nbsp;⤢
            </span>
          )}
          <div className="bento-thumb-overlay">View Photos</div>
        </div>

        {/* ── Info ── */}
        <div className="bento-info">
          <div className="bento-top-row">
            <span className="bento-num">0{index + 1}</span>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-live-btn"
                data-cursor="disable"
                onClick={(e) => e.stopPropagation()}
              >
                <MdArrowOutward />
              </a>
            )}
          </div>

          <h3 className="bento-title">{project.title}</h3>
          <p className="bento-subtitle">{project.subtitle}</p>

          <p className="bento-desc">{shortDesc}</p>

          {expanded && extraDesc && (
            <p className="bento-desc bento-desc--extra">{extraDesc}</p>
          )}

          {expanded && project.warning && (
            <div className="bento-warning">
              <span>⚠️</span>
              <span>{project.warning}</span>
            </div>
          )}

          <div className="bento-bottom-row">
            <span className="bento-tech">{project.technologies}</span>
            {hasMore && (
              <button
                className="bento-toggle"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Less ↑" : "More ↓"}
              </button>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={project.images}
          startIndex={0}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
};

// ─── Work Section ─────────────────────────────────────────────
// Layout for 5 projects:
//   Row 1: [Project 1 — wide]  [Project 2 — tall, spans 2 rows]
//   Row 2: [Project 3 — wide]
//   Row 3: [Project 4 — square] [Project 5 — square]
//
// No GSAP pin. No horizontal scroll. Zero overlap with TechStack.

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Slide-up the heading via IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const p = config.projects; // [0]=MIRA [1]=ANON [2]=PhoneShop [3]=Voltri [4]=Vakilr

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-bento-container section-container">
        <h2 className="work-bento-heading">
          My <span>Work</span>
        </h2>

        {/* ── Bento Grid ── */}
        <div className="bento-grid">
          {/* Row 1 left — wide */}
          <BentoCard project={p[0]} index={0} variant="wide" />

          {/* Row 1+2 right — tall (spans 2 rows) */}
          <BentoCard project={p[1]} index={1} variant="tall" />

          {/* Row 2 left — wide */}
          <BentoCard project={p[2]} index={2} variant="wide" />

          {/* Row 3 — two squares */}
          <BentoCard project={p[3]} index={3} variant="square" />
          <BentoCard project={p[4]} index={4} variant="square" />
        </div>
      </div>
    </div>
  );
};

export default Work;
            

