import "./styles/Work.css";
import { useEffect, useRef, useState } from "react";
import { config } from "../config";
import { MdArrowOutward } from "react-icons/md";

// ════════════════════════════════════════════════
//  LIGHTBOX — unchanged from original
// ════════════════════════════════════════════════
const Lightbox = ({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) => {
  const [current, setCurrent] = useState(startIndex);
  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, []);
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.97)",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <button onClick={onClose} style={{ position:"absolute",top:16,right:16,width:44,height:44,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10 }}>✕</button>
      <div style={{ position:"absolute",top:20,left:"50%",transform:"translateX(-50%)",color:"rgba(255,255,255,0.7)",fontSize:13,background:"rgba(0,0,0,0.5)",padding:"4px 14px",borderRadius:20,zIndex:10 }}>{current+1} / {images.length}</div>
      {images.length > 1 && <button onClick={(e)=>{e.stopPropagation();prev();}} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10 }}>‹</button>}
      <img key={current} src={images[current]} alt={`Photo ${current+1}`} onClick={(e)=>e.stopPropagation()} style={{ width:"100vw",height:"100vh",objectFit:"contain",display:"block" }} />
      {images.length > 1 && <button onClick={(e)=>{e.stopPropagation();next();}} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10 }}>›</button>}
    </div>
  );
};

// ════════════════════════════════════════════════
//  DESKTOP MAGAZINE ROW CARD — completely untouched
// ════════════════════════════════════════════════
const MagCard = ({ project, index }: { project: (typeof config.projects)[0]; index: number }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isReversed = index % 2 !== 0;

  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("mag-card--visible"); obs.disconnect(); }
    }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const paragraphs = project.description.split("\n\n");
  const thumb = project.images[0];

  return (
    <>
      <div ref={cardRef} className={`mag-card ${isReversed ? "mag-card--reverse" : ""}`} style={{ animationDelay: `${index * 80}ms` }}>
        <div className="mag-img-wrap" onClick={() => setLightboxOpen(true)} data-cursor="disable" title="Click to view all photos">
          <img src={thumb} alt={project.title} loading="lazy" className="mag-img" />
          {project.images.length > 1 && (<span className="mag-photo-badge">1/{project.images.length}&nbsp;⤢</span>)}
          <div className="mag-img-overlay">View Photos</div>
        </div>
        <div className="mag-info">
          <div className="mag-top-row">
            <span className="mag-num">0{index + 1}</span>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="mag-live-btn" data-cursor="disable" onClick={(e) => e.stopPropagation()}>
                <MdArrowOutward />
              </a>
            )}
          </div>
          <span className="mag-cat">{project.subtitle}</span>
          <h3 className="mag-title">{project.title}</h3>
          <div className="mag-desc-block">
            {paragraphs.map((para, i) => (<p key={i} className="mag-desc">{para}</p>))}
            {project.warning && (<div className="mag-warning"><span>⚠️</span><span>{project.warning}</span></div>)}
          </div>
          <p className="mag-tech">{project.technologies}</p>
        </div>
      </div>
      {lightboxOpen && (<Lightbox images={project.images} startIndex={0} onClose={() => setLightboxOpen(false)} />)}
    </>
  );
};

// ════════════════════════════════════════════════
//  MOBILE CASE FILE CARD — full redesign
// ════════════════════════════════════════════════
const CaseFileCard = ({ project, index }: { project: (typeof config.projects)[0]; index: number }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Entrance animation via IntersectionObserver
  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("cf-card--visible"); obs.disconnect(); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // Only swipe if predominantly horizontal
    if (Math.abs(dx) < 40 || dy > Math.abs(dx)) return;
    if (dx < 0) {
      setImgIndex((i) => (i + 1) % project.images.length);
    } else {
      setImgIndex((i) => (i === 0 ? project.images.length - 1 : i - 1));
    }
  };

  const techChips = project.technologies.split(",").map((t) => t.trim()).filter(Boolean);
  const numStr = String(index + 1).padStart(2, "0");

  return (
    <>
      <div ref={cardRef} className="cf-card">
        {/* ── Image gallery ── */}
        <div
          className="cf-img-wrap"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={project.images[imgIndex]}
            alt={`${project.title} screenshot ${imgIndex + 1}`}
            className="cf-img"
            loading={index === 0 ? "eager" : "lazy"}
          />
          {/* Overlay gradient — bottom only */}
          <div className="cf-img-gradient" />
          {/* Project number — top left stamp */}
          <span className="cf-stamp-num">{numStr}</span>
          {/* Counter — top right */}
          {project.images.length > 1 && (
            <span className="cf-img-counter">{imgIndex + 1} / {project.images.length}</span>
          )}
          {/* Swipe hint dots — only if multiple images */}
          {project.images.length > 1 && (
            <div className="cf-swipe-dots">
              {project.images.map((_, i) => (
                <span
                  key={i}
                  className={`cf-swipe-dot${i === imgIndex ? " cf-swipe-dot--active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Content block ── */}
        <div className="cf-content">
          {/* Title row */}
          <div className="cf-title-row">
            <div className="cf-titles">
              <h3 className="cf-title">{project.title}</h3>
              <p className="cf-subtitle">{project.subtitle}</p>
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cf-visit-link"
                onClick={(e) => e.stopPropagation()}
              >
                VISIT <MdArrowOutward />
              </a>
            )}
          </div>

          {/* Rule */}
          <div className="cf-rule" />

          {/* Description — tap to expand */}
          <div
            className={`cf-desc-wrap${descExpanded ? " cf-desc-wrap--open" : ""}`}
            onClick={() => setDescExpanded((v) => !v)}
          >
            <p className="cf-desc">{project.description.split("\n\n")[0]}</p>
            {descExpanded && project.description.split("\n\n").slice(1).map((para, i) => (
              <p key={i} className="cf-desc cf-desc--extra">{para}</p>
            ))}
            {project.warning && descExpanded && (
              <div className="cf-warning"><span>⚠</span><span>{project.warning}</span></div>
            )}
          </div>

          {/* Tech chips */}
          <div className="cf-chips">
            {techChips.map((chip) => (
              <span key={chip} className="cf-chip">{chip}</span>
            ))}
          </div>

          {/* Bottom row: large ghost number */}
          <div className="cf-bottom-row">
            <span className="cf-ghost-num">{numStr}</span>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox images={project.images} startIndex={imgIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
};

// ════════════════════════════════════════════════
//  MAIN
// ════════════════════════════════════════════════
const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 1024);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("in-view"); obs.disconnect(); }
    }, { threshold: 0.04 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const p = config.projects;

  // ── DESKTOP: completely original markup ──
  if (!isMobile) {
    return (
      <div className="work-section" id="work" ref={sectionRef}>
        <div className="work-mag-container section-container">
          <h2 className="work-mag-heading">My <span>Work</span></h2>
          <div className="mag-grid">
            {p.map((project, index) => (
              <MagCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── MOBILE: Case Files redesign ──
  return (
    <div className="work-section cf-section" id="work" ref={sectionRef}>
      {/* Section header */}
      <div className="cf-header">
        <h2 className="cf-heading">
          <span className="cf-heading-line1">SELECTED</span>
          <span className="cf-heading-line2">WORK</span>
        </h2>
        <span className="cf-project-count">{String(p.length).padStart(2, "0")} PROJECTS</span>
      </div>

      {/* Project list */}
      <div className="cf-list">
        {p.map((project, index) => (
          <div key={project.id}>
            <CaseFileCard project={project} index={index} />
            {index < p.length - 1 && <div className="cf-separator" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
