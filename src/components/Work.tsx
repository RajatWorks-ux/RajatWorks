import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { useEffect, useRef, useState } from "react";
import { config } from "../config";
import { MdArrowOutward } from "react-icons/md";

// ════════════════════════════════════════════════
//  LIGHTBOX
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
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <button onClick={onClose} style={{ position:"absolute",top:16,right:16,width:40,height:40,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
      <div style={{ position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",color:"rgba(255,255,255,0.7)",fontSize:13,background:"rgba(0,0,0,0.4)",padding:"3px 12px",borderRadius:20 }}>{current+1} / {images.length}</div>
      {images.length > 1 && <button onClick={(e)=>{e.stopPropagation();prev();}} style={{ position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>}
      <img key={current} src={images[current]} alt={`Photo ${current+1}`} onClick={(e)=>e.stopPropagation()} style={{ maxWidth:"90vw",maxHeight:"90vh",objectFit:"contain",borderRadius:12,boxShadow:"0 0 60px rgba(0,0,0,0.8)" }} />
      {images.length > 1 && <button onClick={(e)=>{e.stopPropagation();next();}} style={{ position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>}
      {images.length > 1 && (
        <div style={{ position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8 }}>
          {images.map((_,i) => <button key={i} onClick={(e)=>{e.stopPropagation();setCurrent(i);}} style={{ width:i===current?16:8,height:8,borderRadius:4,border:"none",background:i===current?"#fff":"rgba(255,255,255,0.35)",cursor:"pointer",transition:"all 0.2s",padding:0 }} />)}
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════
//  DESKTOP BENTO CARD
//  - No Show More button — full text always visible
//  - Thumbnail stays visible always, card height = auto
// ════════════════════════════════════════════════
const BentoCard = ({ project, index, variant }: { project: (typeof config.projects)[0]; index: number; variant: "wide" | "tall" | "square" }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add("bento-card--visible"); obs.disconnect(); } }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const paragraphs = project.description.split("\n\n");
  const thumb = project.images[0];

  return (
    <>
      <div ref={cardRef} className={`bento-card bento-card--${variant}`} style={{ animationDelay:`${index*80}ms` }}>

        {/* Thumbnail — always shown, fixed height per variant */}
        <div className="bento-thumb" onClick={() => setLightboxOpen(true)} data-cursor="disable" title="Click to view all photos">
          <img src={thumb} alt={project.title} loading="lazy" />
          {project.images.length > 1 && <span className="bento-photo-count">1/{project.images.length}&nbsp;⤢</span>}
          <div className="bento-thumb-overlay">View Photos</div>
        </div>

        {/* Info — no show more, everything visible */}
        <div className="bento-info">
          <div className="bento-top-row">
            <span className="bento-num">0{index+1}</span>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="bento-live-btn" data-cursor="disable" onClick={(e)=>e.stopPropagation()}>
                <MdArrowOutward />
              </a>
            )}
          </div>

          <h3 className="bento-title">{project.title}</h3>
          <p className="bento-subtitle">{project.subtitle}</p>

          {/* All paragraphs shown — no toggle */}
          <div className="bento-desc-block">
            {paragraphs.map((para, i) => (
              <p key={i} className="bento-desc">{para}</p>
            ))}
            {project.warning && (
              <div className="bento-warning"><span>⚠️</span><span>{project.warning}</span></div>
            )}
          </div>

          <p className="bento-tech">{project.technologies}</p>
        </div>
      </div>

      {lightboxOpen && <Lightbox images={project.images} startIndex={0} onClose={() => setLightboxOpen(false)} />}
    </>
  );
};

// ════════════════════════════════════════════════
//  MOBILE CARD — exact purana layout with WorkImage
// ════════════════════════════════════════════════
const MobileWorkCard = ({ project, index }: { project: (typeof config.projects)[0]; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = project.description.split("\n\n");
  const shortDesc = paragraphs[0];
  const extraDesc = paragraphs.slice(1).join("\n\n");

  return (
    <div className="work-box">
      <div className="work-info">
        <div className="work-title">
          <h3>0{index+1}</h3>
          <div>
            <h4>{project.title}</h4>
            <p>{project.subtitle || project.category}</p>
          </div>
        </div>
        <div className="work-desc">
          <p className="work-desc-text">{shortDesc}</p>
          {expanded && extraDesc && <p className="work-desc-extra">{extraDesc}</p>}
          {expanded && project.warning && (
            <div className="work-warning"><span>⚠️</span><span>{project.warning}</span></div>
          )}
          {(extraDesc || project.warning) && (
            <button className="work-show-btn" onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Show Less ↑" : "Show More ↓"}
            </button>
          )}
        </div>
        <h4>Tools and features</h4>
        <p>{project.technologies}</p>
      </div>
      <WorkImage images={project.images} alt={project.title} link={project.link} />
    </div>
  );
};

// ════════════════════════════════════════════════
//  MAIN — Desktop = Bento, Mobile = original
// ════════════════════════════════════════════════
const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 1024);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // in-view for heading + mobile card animations
  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add("in-view"); obs.disconnect(); } }, { threshold: 0.04 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const p = config.projects;

  if (isMobile) {
    return (
      <div className="work-section" id="work" ref={sectionRef}>
        <div className="work-container section-container">
          <h2>My <span>Work</span></h2>
          <div className="work-flex">
            {p.map((project, index) => <MobileWorkCard key={project.id} project={project} index={index} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-bento-container section-container">
        <h2 className="work-bento-heading">My <span>Work</span></h2>
        <div className="bento-grid">
          {/* Row1: wide | tall(span 2 rows) */}
          <BentoCard project={p[0]} index={0} variant="wide" />
          <BentoCard project={p[1]} index={1} variant="tall" />
          {/* Row2: wide */}
          <BentoCard project={p[2]} index={2} variant="wide" />
          {/* Row3: square | square */}
          <BentoCard project={p[3]} index={3} variant="square" />
          <BentoCard project={p[4]} index={4} variant="square" />
        </div>
      </div>
    </div>
  );
};

export default Work;

