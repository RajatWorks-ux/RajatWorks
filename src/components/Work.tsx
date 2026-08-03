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

    // ── FIX A: Use .work-container width (not .work-flex width) for the
    //    scroll distance calculation.  Previously box.parentElement was
    //    .work-flex which has a negative margin-left applied — that made
    //    the measured width slightly wider than the visible container and
    //    caused the spacer to be too short, letting TechStack creep up.
    //
    // ── FIX B: Also add work-flex padding-right to the scroll distance.
    //    .work-flex has padding-right: 120px (desktop) / 75px / 45px
    //    depending on breakpoint.  That trailing space is real content the
    //    user must scroll through — ignoring it made the spacer short by
    //    exactly that amount, causing TechStack to visually overlap the
    //    still-pinned Work section before all cards were fully scrolled.
    const getTranslateX = (): number => {
      const boxes = document.getElementsByClassName("work-box");
      if (boxes.length === 0) return 0;

      const container = document.querySelector(".work-container");
      const flex     = document.querySelector<HTMLElement>(".work-flex");
      if (!container || !flex) return 0;

      const containerRect = container.getBoundingClientRect();
      const box           = boxes[0] as HTMLElement;
      const boxWidth      = box.getBoundingClientRect().width;

      // Read the live computed padding-right so breakpoint changes are
      // automatically picked up on every GSAP refresh.
      const paddingRight = parseFloat(window.getComputedStyle(flex).paddingRight) || 0;

      // Total scrollable width  =  all cards  +  right padding
      // Minus what is already visible  =  container width
      return boxWidth * boxes.length + paddingRight - containerRect.width;
    };

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        // end is a function — GSAP calls this after each refresh,
        // so the spacer length always matches the real content width.
        end: () => `+=${getTranslateX()}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: () => -getTranslateX(),
      ease: "none",
      invalidateOnRefresh: true,
    });

    // ── FIX: Project images load asynchronously — when they finish,
    //    the work-box heights can change, making getTranslateX() return
    //    a different value.  Refresh GSAP after all images in the section
    //    have loaded so the spacer is always accurate.
    const images = document.querySelectorAll<HTMLImageElement>(".work-section img");
    let loaded = 0;
    const onImgLoad = () => {
      loaded++;
      if (loaded >= images.length) {
        ScrollTrigger.refresh();
      }
    };
    images.forEach((img) => {
      if (img.complete) {
        loaded++;
      } else {
        img.addEventListener("load", onImgLoad, { once: true });
        img.addEventListener("error", onImgLoad, { once: true });
      }
    });
    // If all images were already cached
    if (loaded >= images.length && images.length > 0) {
      ScrollTrigger.refresh();
    }

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


