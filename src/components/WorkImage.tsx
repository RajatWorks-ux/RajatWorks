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

  // Split description into first paragraph and the rest
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

        {/* Description with show more / show less */}
        <div className="work-desc">
          <p className="work-desc-text">{shortDesc}</p>

          {expanded && extraDesc && (
            <p className="work-desc-extra">{extraDesc}</p>
          )}

          {/* Warning badge */}
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
    // Mobile pe horizontal scroll band — seedha vertical layout
    if (window.innerWidth < 1025) return;

    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX =
        rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
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


