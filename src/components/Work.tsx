import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);

// ─── Show More / Less per card ──────────────────────────────
const WorkCard = ({
  project,
  index,
}: {
  project: (typeof config.projects)[0];
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  const paragraphs = project.description.split("\n\n");
  const shortDesc = paragraphs[0];
  const extraDesc = paragraphs.slice(1).join("\n\n");

  return (
    <div className="work-box">
      <div className="work-info">
        <div className="work-title">
          <h3>0{index + 1}</h3>
          <div>
            <h4>{project.title}</h4>
            <p>{project.subtitle || project.category}</p>
          </div>
        </div>

        <div className="work-desc">
          <p className="work-desc-text">{shortDesc}</p>

          {expanded && extraDesc && (
            <p className="work-desc-extra">{extraDesc}</p>
          )}

          {expanded && project.warning && (
            <div className="work-warning">
              <span>⚠️</span>
              <span>{project.warning}</span>
            </div>
          )}

          {(extraDesc || project.warning) && (
            <button
              className="work-show-btn"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Show Less ↑" : "Show More ↓"}
            </button>
          )}
        </div>

        <h4>Tools and features</h4>
        <p>{project.technologies}</p>
      </div>

      <WorkImage
        images={project.images}
        alt={project.title}
        link={project.link}
      />
    </div>
  );
};

// ─── Main Work Section ───────────────────────────────────────
const Work = () => {
  useEffect(() => {
    // Mobile: no horizontal scroll — vertical layout handles it
    if (window.innerWidth < 1025) return;

    // ── FIX: compute translateX inside a callback so GSAP calls it
    //    AFTER every ScrollTrigger.refresh(), not just at mount time.
    //    This prevents the "too short spacer" bug where layout wasn't
    //    stable at mount and GSAP used a wrong translateX value.
    const getTranslateX = (): number => {
      const boxes = document.getElementsByClassName("work-box");
      if (boxes.length === 0) return 0;

      const container = document.querySelector(".work-container");
      if (!container) return 0;

      const rectLeft   = container.getBoundingClientRect().left;
      const box        = boxes[0] as HTMLElement;
      const parentWidth = box.parentElement!.getBoundingClientRect().width;
      const padding    = parseInt(window.getComputedStyle(box).padding) / 2;

      return box.getBoundingClientRect().width * boxes.length
        - (rectLeft + parentWidth)
        + padding;
    };

    // ── Create timeline with invalidateOnRefresh so the end value and
    //    the tween target are both recalculated on every ST refresh.
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        // FIX: end is a function — GSAP calls this after each refresh,
        //      so the spacer length always matches the real content width.
        end: () => `+=${getTranslateX()}`,
        scrub: true,
        pin: true,
        // FIX: pinSpacing true (default) PLUS anticipatePin prevents
        //      the section from jumping when pinning starts.
        anticipatePin: 1,
        // FIX: recalculate layout on refresh (font/image load changes widths)
        invalidateOnRefresh: true,
        id: "work",
      },
    });

    // FIX: tween target also uses a function so it re-evaluates on refresh
    timeline.to(".work-flex", {
      x: () => -getTranslateX(),
      ease: "none",
      invalidateOnRefresh: true,
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {config.projects.map((project, index) => (
            <WorkCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;

