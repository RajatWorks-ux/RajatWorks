import { useEffect, useState } from "react";
import { config } from "../config";
import "./styles/MobileCinematicPortfolio.css";

const scrollToSection = (id: string, close?: () => void) => {
  close?.();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const MobileCinematicPortfolio = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [activeBg, setActiveBg] = useState(0);
  const projects = config.projects;
  const sectionImages = [projects[0]?.images?.[0], projects[2]?.images?.[0], projects[4]?.images?.[0]].filter(Boolean) as string[];

  useEffect(() => {
    const sections = ["mobile-home", "mobile-about", "mobile-work", "mobile-contact"];
    const update = () => {
      const marker = window.innerHeight * 0.48;
      let current = 0;
      sections.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= marker) current = index;
      });
      setActiveBg(current % Math.max(sectionImages.length, 1));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [sectionImages.length]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const project = projects[activeProject] ?? projects[0];
  const techs = [...config.skills.develop.tools.slice(0, 6), ...config.skills.design.tools.slice(0, 4)];

  return (
    <div className="mc-portfolio">
      <div className="mc-backdrop" aria-hidden="true">
        {sectionImages.map((src, index) => <div key={src} className={`mc-backdrop-image ${activeBg === index ? "is-active" : ""}`} style={{ backgroundImage: `url("${src}")` }} />)}
        <div className="mc-backdrop-shade" />
        <div className="mc-backdrop-grain" />
      </div>

      <header className="mc-nav">
        <button className="mc-wordmark" onClick={() => scrollToSection("mobile-home")} aria-label="RajatWorks home">R<span>W</span><i>®</i></button>
        <span className="mc-nav-status"><b /> AVAILABLE FOR SELECT PROJECTS</span>
        <button className={`mc-menu-toggle ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>
          <span /><span />
        </button>
      </header>

      <div className={`mc-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mc-menu-top"><span>INDEX / 2026</span><span>RAJATWORKS</span></div>
        <nav aria-label="Mobile navigation">
          {[ ["01", "Home", "mobile-home"], ["02", "About", "mobile-about"], ["03", "Selected work", "mobile-work"], ["04", "Contact", "mobile-contact"] ].map(([num, label, id]) => (
            <button key={id} onClick={() => scrollToSection(id, () => setMenuOpen(false))}><small>{num}</small><span>{label}</span><b>↗</b></button>
          ))}
        </nav>
        <a className="mc-menu-email" href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
        <div className="mc-menu-foot"><span>INDEPENDENT DEVELOPER</span><span>INDIA · IST</span></div>
      </div>

      <main className="mc-content">
        <section className="mc-hero" id="mobile-home">
          <div className="mc-hero-meta"><span>INDEPENDENT DEVELOPER / DESIGNER</span><span>30° 43′ N — INDIA</span></div>
          <div className="mc-hero-title-wrap">
            <p className="mc-eyebrow"><span className="mc-line" /> BUILDING DIGITAL EXPERIENCES</p>
            <h1><span className="mc-ghost">Hey, I'm</span><span className="mc-name">Rajat<span className="mc-period">.</span></span><span className="mc-surname">KUMAR DUA</span></h1>
            <p className="mc-hero-description">{config.developer.description}</p>
            <button className="mc-explore" onClick={() => scrollToSection("mobile-work")}><span>EXPLORE SELECTED WORK</span><b>↓</b></button>
          </div>
          <div className="mc-hero-bottom"><span>SCROLL TO DISCOVER</span><span className="mc-scroll-line"/><span>01 — 04</span></div>
        </section>

        <section className="mc-about" id="mobile-about">
          <div className="mc-section-meta"><span>01 / THE PERSON</span><span>ABOUT</span></div>
          <h2>Code with<br/><em>intention.</em></h2>
          <p className="mc-about-copy">{config.about.description}</p>
          <div className="mc-facts">
            <div><strong>01</strong><span>FULL-STACK<br/>DEVELOPMENT</span></div>
            <div><strong>02</strong><span>INTERACTION<br/>& MOTION</span></div>
            <div><strong>03</strong><span>PRODUCT<br/>THINKING</span></div>
          </div>
          <div className="mc-stack-heading"><span>TOOLS OF THE TRADE</span><span>{String(techs.length).padStart(2, "0")} TECHNOLOGIES</span></div>
          <div className="mc-tech-list">{techs.map((tech, index) => <span key={`${tech}-${index}`}><small>{String(index + 1).padStart(2, "0")}</small>{tech}</span>)}</div>
        </section>

        <section className="mc-work" id="mobile-work">
          <div className="mc-section-meta"><span>02 / SELECTED WORK</span><span>{String(projects.length).padStart(2, "0")} PROJECTS</span></div>
          <h2>Made to<br/><em>matter.</em></h2>
          <p className="mc-work-intro">A selection of products, platforms, and digital experiences built with care from first idea to final interaction.</p>
          <div className="mc-project-viewer">
            <div className="mc-project-image-frame">
              {project?.images?.[0] && <img key={project.images[0]} src={project.images[0]} alt={`${project.title} project preview`} loading="lazy" />}
              <div className="mc-image-index"><span>PROJECT / {String(activeProject + 1).padStart(2, "0")}</span><span>{String(projects.length).padStart(2, "0")} TOTAL</span></div>
            </div>
            <div className="mc-project-heading"><span>{project?.category ?? "DEVELOPMENT"}</span><a href={project?.link} target="_blank" rel="noreferrer" aria-label={`Open ${project?.title} live website`}>↗</a></div>
            <h3>{project?.title}</h3>
            <p className="mc-project-subtitle">{project?.subtitle}</p>
            <p className="mc-project-description">{project?.description?.split("\n\n")[0]}</p>
            <div className="mc-project-tech">{project?.technologies?.split(",").map(t => <span key={t}>{t.trim()}</span>)}</div>
            <div className="mc-project-controls"><span>SELECT PROJECT</span><div><button onClick={() => setActiveProject(i => (i - 1 + projects.length) % projects.length)} aria-label="Previous project">←</button><span>{String(activeProject + 1).padStart(2, "0")} <i>/</i> {String(projects.length).padStart(2, "0")}</span><button onClick={() => setActiveProject(i => (i + 1) % projects.length)} aria-label="Next project">→</button></div></div>
            <div className="mc-project-index">{projects.map((p, index) => <button key={p.id} className={index === activeProject ? "is-active" : ""} onClick={() => setActiveProject(index)} aria-label={`Show project ${p.title}`}><span>{String(index + 1).padStart(2, "0")}</span></button>)}</div>
          </div>
          <div className="mc-work-note"><span>BUILT WITH PURPOSE.</span><span>DESIGNED FOR PEOPLE.</span></div>
        </section>

        <section className="mc-contact" id="mobile-contact">
          <div className="mc-section-meta"><span>03 / THE NEXT CHAPTER</span><span>CONTACT</span></div>
          <p className="mc-eyebrow"><span className="mc-line"/> HAVE A GOOD ONE IN MIND?</p>
          <h2>Let's make<br/><em>it real.</em></h2>
          <p className="mc-contact-copy">Have a product to build, an idea to explore, or a collaboration in mind? Tell me what you're imagining.</p>
          <a className="mc-email-link" href={`mailto:${config.contact.email}`}><span>{config.contact.email}</span><b>↗</b></a>
          <div className="mc-social-links"><a href={config.contact.github} target="_blank" rel="noreferrer">GITHUB ↗</a><a href={config.contact.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a><a href={config.contact.instagram} target="_blank" rel="noreferrer">INSTAGRAM ↗</a></div>
          <footer className="mc-footer"><span>RAJATWORKS © {new Date().getFullYear()}</span><span>DESIGNED & BUILT WITH INTENTION</span><button onClick={() => scrollToSection("mobile-home")}>BACK TO TOP ↑</button></footer>
        </section>
      </main>
    </div>
  );
};

export default MobileCinematicPortfolio;
