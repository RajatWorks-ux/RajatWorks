import { useEffect, useRef, useState } from "react";
import "./styles/Career.css";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════════════
//  DESKTOP — completely original, untouched
// ════════════════════════════════════════════════
const EraDivider = ({ label, sub }: { label: string; sub: string }) => (
  <div className="career-era-divider">
    <div className="career-era-line" />
    <div className="career-era-label">
      <span className="career-era-title">{label}</span>
      <span className="career-era-sub">{sub}</span>
    </div>
    <div className="career-era-line" />
  </div>
);

// ════════════════════════════════════════════════
//  MOBILE — Signal Tape: horizontal scrub timeline
// ════════════════════════════════════════════════

const PHASE_BREAK_INDEX = config.experiences.findIndex((e) => e.era === "freelance");

const SignalTape = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const scrubRef = useRef(0); // 0–1 progress value

  const exps = config.experiences;

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    // Total horizontal scroll distance
    const getScrollWidth = () => inner.scrollWidth - window.innerWidth;

    // GSAP horizontal scrub pin
    const ctx = gsap.context(() => {
      const tl = gsap.to(inner, {
        x: () => -getScrollWidth(),
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollWidth()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          scrubRef.current = self.progress;
          // Update active node based on progress
          const idx = Math.round(self.progress * (exps.length - 1));
          setActiveIndex(Math.max(0, Math.min(idx, exps.length - 1)));
          // Background tint shift
          if (bgRef.current) {
            const phase2Start = PHASE_BREAK_INDEX / (exps.length - 1);
            const inPhase2 = self.progress >= phase2Start;
            bgRef.current.style.opacity = inPhase2 ? "1" : "0";
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Touch drag on the track itself also scrubs
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dy > Math.abs(dx)) return; // vertical scroll wins

    const inner = innerRef.current;
    if (!inner) return;
    const scrollWidth = inner.scrollWidth - window.innerWidth;
    const delta = (-dx / scrollWidth) * 0.3;
    const newProgress = Math.max(0, Math.min(1, scrubRef.current + delta));

    // Find the ScrollTrigger and set progress
    const st = ScrollTrigger.getAll().find((t) => t.vars.trigger === sectionRef.current);
    if (st) {
      const scrollY = st.start + newProgress * (Number(st.end) - st.start);
      window.scrollTo({ top: scrollY });
    }
    touchStartX.current = e.touches[0].clientX;
  };

  return (
    <section
      ref={sectionRef}
      className="st-section career-mobile-evolution"
      aria-label="Career timeline"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Phase 2 background tint — fades in when entering Builder era */}
      <div ref={bgRef} className="st-phase2-bg" aria-hidden="true" />

      {/* Scrolling inner track */}
      <div ref={innerRef} className="st-inner">

        {/* ── Section heading (stays at left edge) ── */}
        <div className="st-heading-block">
          <p className="st-eyebrow">2020 — 2026</p>
          <h2 className="st-heading">
            MY<br />JOURNEY
          </h2>
          <p className="st-sub">Scroll to move through time</p>
        </div>

        {/* ── Track with nodes ── */}
        <div ref={trackRef} className="st-track-wrap">
          {/* The track line */}
          <div className="st-track-line">
            {/* Phase 1: dashed segment */}
            <div className="st-track-seg st-track-seg--dashed" style={{ width: `${(PHASE_BREAK_INDEX / exps.length) * 100}%` }} />
            {/* Phase break label */}
            <div className="st-phase-break" style={{ left: `${(PHASE_BREAK_INDEX / exps.length) * 100}%` }}>
              <span className="st-phase-label">PHASE 02<br />BUILDER</span>
            </div>
            {/* Phase 2: solid segment */}
            <div className="st-track-seg st-track-seg--solid" style={{ left: `${(PHASE_BREAK_INDEX / exps.length) * 100}%`, width: `${((exps.length - PHASE_BREAK_INDEX) / exps.length) * 100}%` }} />
          </div>

          {/* Milestone nodes */}
          {exps.map((exp, i) => {
            const isActive = i === activeIndex;
            const posPercent = (i / (exps.length - 1)) * 100;
            const isAbove = i % 2 === 0;

            return (
              <div
                key={`${exp.period}-${exp.position}`}
                ref={(el) => { nodeRefs.current[i] = el; }}
                className={`st-node-wrap${isActive ? " st-node-wrap--active" : ""}`}
                style={{ left: `${posPercent}%` }}
              >
                {/* Card — alternates above/below track */}
                <div className={`st-card${isAbove ? " st-card--above" : " st-card--below"}${isActive ? " st-card--active" : ""}`}>
                  <span className="st-card-year">{exp.period}</span>
                  <strong className="st-card-title">{exp.position}</strong>
                  <p className="st-card-desc">{exp.description.slice(0, 100)}{exp.description.length > 100 ? "…" : ""}</p>
                </div>

                {/* Connector line from card to node */}
                <div className={`st-connector${isAbove ? " st-connector--above" : " st-connector--below"}`} />

                {/* The diamond node on the track */}
                <div className="st-diamond" aria-label={`${exp.period} — ${exp.position}`} />
              </div>
            );
          })}
        </div>

        {/* Right padding spacer */}
        <div className="st-end-spacer" />
      </div>

      {/* Fixed progress bar at bottom */}
      <div className="st-progress-bar">
        <div
          className="st-progress-fill"
          style={{ width: `${activeIndex / (exps.length - 1) * 100}%` }}
        />
      </div>

      {/* Fixed active card detail overlay at bottom */}
      <div className="st-active-detail">
        <span className="st-active-phase">
          {config.experiences[activeIndex]?.era === "learning" ? "PHASE 01 · FOUNDATION" : "PHASE 02 · BUILDER"}
        </span>
        <strong className="st-active-title">{config.experiences[activeIndex]?.position}</strong>
        <span className="st-active-year">{config.experiences[activeIndex]?.period}</span>
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════
//  ROOT EXPORT
// ════════════════════════════════════════════════
const Career = () => {
  const experiences = config.experiences;
  let lastEra = "";

  return (
    <>
      {/* Mobile: Signal Tape */}
      <SignalTape />

      {/* Desktop: completely original */}
      <div className="career-desktop-original career-section section-container">
        <div className="career-container">
          <h2>My journey <span>&</span><br /> story</h2>
          <div className="career-info">
            <div className="career-timeline"><div className="career-dot"></div></div>
            {experiences.map((exp, index) => {
              const showDivider = exp.era !== lastEra;
              lastEra = exp.era;
              return (
                <div key={index}>
                  {showDivider && (
                    <EraDivider
                      label={exp.era === "learning" ? "Learning Era" : "Builder Era"}
                      sub={exp.era === "learning" ? "2020 – 2023 · Foundation" : "2023 – 2026 · Shipping Real Things"}
                    />
                  )}
                  <div className="career-info-box">
                    <div className="career-info-in">
                      <div className="career-role">
                        <span className={`career-badge career-badge--${exp.type}`}>
                          {exp.type === "freelance" ? "⚡ Builder" : "📖 Learning"}
                        </span>
                        <h4>{exp.position}</h4>
                        <h5>{exp.company}</h5>
                      </div>
                      <h3>{exp.period}</h3>
                    </div>
                    <p>{exp.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Career;

