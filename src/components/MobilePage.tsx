/**
 * MobilePage.tsx
 * ──────────────────────────────────────────────────────────────────
 * Complete phone experience (≤ 480px) matching the friend's
 * cinematic portfolio design — EXACTLY — but with Rajat's content.
 *
 * • Scroll-driven parallax backgrounds (4 section images via RAF loop)
 * • Orange #ff6b1a accent on #080808 background
 * • Playfair Display (ghost/italic) + Inter (body)
 * • Navbar → Hero → About → Work → Contact → Footer
 * • ZERO Next.js deps — pure React
 * ──────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";

// ── react-icons for tech badges ──────────────────────────────────
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiNodedotjs, SiExpress, SiMongodb, SiTailwindcss,
  SiFramer, SiThreedotjs,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────
const ORANGE = "#ff6b1a";
const BG     = "#080808";

const SECTION_IMAGES = [
  { id: null,               src: "/mobile-assets/hero.webp"    },
  { id: "m-about-section",  src: "/mobile-assets/about.webp"   },
  { id: "m-work-section",   src: "/mobile-assets/project.webp" },
  { id: "m-contact-section",src: "/mobile-assets/contact.webp" },
];

const TECH_SKILLS = [
  { label: "JavaScript",   Icon: SiJavascript  },
  { label: "TypeScript",   Icon: SiTypescript  },
  { label: "React",        Icon: SiReact       },
  { label: "Next.js",      Icon: SiNextdotjs   },
  { label: "Node.js",      Icon: SiNodedotjs   },
  { label: "Express.js",   Icon: SiExpress     },
  { label: "MongoDB",      Icon: SiMongodb     },
  { label: "TailwindCSS",  Icon: SiTailwindcss },
  { label: "Framer Motion",Icon: SiFramer      },
  { label: "Three.js",     Icon: SiThreedotjs  },
];

const DESIGN_SKILLS = ["UI Design","UX Design","Figma","Photoshop","Motion Design","Responsive Design","Accessibility","Prototyping"];

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────
interface Project {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  technologies: string;
  link: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────
// SCROLL-DRIVEN PARALLAX BACKGROUND
// ─────────────────────────────────────────────────────────────────
function ScrollBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef       = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find section offsets
    const getSectionTop = (id: string | null): number => {
      if (!id) return 0;
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
    };

    let sectionTops: number[] = [];

    const updateTops = () => {
      sectionTops = SECTION_IMAGES.map(s => getSectionTop(s.id));
    };

    updateTops();

    const loop = () => {
      const scrollY    = window.scrollY;
      const viewH      = window.innerHeight;
      const docH       = document.documentElement.scrollHeight;
      const maxScroll  = docH - viewH;
      const scrollPct  = maxScroll > 0 ? scrollY / maxScroll : 0;

      updateTops();

      // Determine active section
      let activeIdx = 0;
      for (let i = sectionTops.length - 1; i >= 0; i--) {
        if (scrollY + viewH * 0.4 >= sectionTops[i]) {
          activeIdx = i;
          break;
        }
      }

      layerRefs.current.forEach((layer, idx) => {
        if (!layer) return;

        const isActive = idx === activeIdx;
        const targetOpacity = isActive ? 1 : 0;
        const currentOpacity = parseFloat(layer.style.opacity || "0");
        const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.08;
        layer.style.opacity = String(newOpacity);

        // Subtle parallax — translate bg image
        const parallaxY = scrollPct * 30 * (idx % 2 === 0 ? 1 : -1);
        layer.style.transform = `translateY(${parallaxY}px) scale(1.1)`;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        background: BG,
      }}
    >
      {/* Dark overlay so text is always readable */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "rgba(8,8,8,0.62)",
      }} />
      {SECTION_IMAGES.map((s, idx) => (
        <div
          key={idx}
          ref={el => { layerRefs.current[idx] = el; }}
          style={{
            position: "absolute", inset: "-10%",
            opacity: idx === 0 ? 1 : 0,
            transition: "opacity 0.4s ease",
            backgroundImage: `url(${s.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────
function MobileNavbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const navRef                    = useRef<HTMLElement>(null);
  const overlayRef                = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate overlay open/close
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (menuOpen) {
      overlay.style.display = "flex";
      gsap.fromTo(overlay,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
      // Stagger links
      const links = overlay.querySelectorAll(".m-nav-link");
      gsap.fromTo(links,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out", delay: 0.1 }
      );
      document.body.style.overflow = "hidden";
    } else {
      gsap.to(overlay, {
        opacity: 0, y: -10, duration: 0.3, ease: "power2.in",
        onComplete: () => { overlay.style.display = "none"; }
      });
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const NAV_LINKS = [
    { label: "Projects",  target: "m-work-section"    },
    { label: "About",     target: "m-about-section"   },
    { label: "Contact",   target: "m-contact-section" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px",
          height: "60px",
          background: scrolled ? "rgba(8,8,8,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src="/mobile-assets/logo navbar inverse.png"
            alt="Rajat"
            style={{ height: "28px", objectFit: "contain" }}
            onError={e => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700, fontSize: "16px",
            color: "#fff", letterSpacing: "-0.02em",
          }}>
            Rajat
          </span>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px", display: "flex", flexDirection: "column",
            gap: "5px", alignItems: "center",
          }}
        >
          {[0,1,2].map(i => (
            <span
              key={i}
              style={{
                display: "block",
                width: menuOpen && i === 1 ? 0 : "22px",
                height: "2px",
                background: "#fff",
                borderRadius: "2px",
                transition: "all 0.3s ease",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px,5px)"
                  : i === 2 ? "rotate(-45deg) translate(5px,-5px)"
                  : "scaleX(0)"
                  : "none",
              }}
            />
          ))}
        </button>
      </nav>

      {/* Fullscreen overlay menu */}
      <div
        ref={overlayRef}
        style={{
          display: "none",
          position: "fixed", inset: 0, zIndex: 99,
          background: "rgba(8,8,8,0.97)",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 32px",
          gap: "8px",
        }}
      >
        {NAV_LINKS.map(link => (
          <button
            key={link.label}
            className="m-nav-link"
            onClick={() => scrollTo(link.target)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700, fontSize: "clamp(2rem, 10vw, 3.5rem)",
              color: "#fff", letterSpacing: "-0.03em",
              padding: "8px 0",
              textAlign: "left",
              opacity: 0,
            }}
          >
            {link.label}
          </button>
        ))}
        {/* CTA */}
        <button
          onClick={() => scrollTo("m-contact-section")}
          style={{
            marginTop: "24px",
            padding: "14px 32px",
            background: ORANGE,
            border: "none", borderRadius: "4px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700, fontSize: "14px",
            color: "#fff", cursor: "pointer",
            letterSpacing: "0.05em", textTransform: "uppercase",
          }}
        >
          Start Now
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────
function MobileHero() {
  const sectionRef    = useRef<HTMLElement>(null);
  const labelRef      = useRef<HTMLParagraphElement>(null);
  const ghostLineRef  = useRef<HTMLSpanElement>(null);
  const nameRef       = useRef<HTMLSpanElement>(null);
  const bioRef        = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(labelRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, delay: 0.3 })
      .fromTo(ghostLineRef.current,
        { opacity: 0, y: 90 },
        { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
      .fromTo(nameRef.current?.querySelectorAll(".hero-letter") ?? [],
        { opacity: 0, y: 100, rotateX: -40 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 0.6 }, "-=0.4")
      .fromTo(bioRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 }, "-=0.2")
      .fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById("m-work-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative", zIndex: 1,
        minHeight: "100svh",
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 24px 64px",
      }}
    >
      {/* Label */}
      <p
        ref={labelRef}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "10px", color: ORANGE,
          letterSpacing: "0.2em", textTransform: "uppercase",
          fontWeight: 700, marginBottom: "24px",
          opacity: 0,
        }}
      >
        Full Stack Developer
      </p>

      {/* Big heading */}
      <h1 style={{
        margin: 0, padding: 0,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900, lineHeight: 0.85,
        letterSpacing: "-0.03em",
        fontSize: "clamp(4rem, 18vw, 7rem)",
      }}>
        {/* Ghost line */}
        <span
          ref={ghostLineRef}
          style={{
            display: "block",
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic", fontWeight: 400,
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.45)",
            opacity: 0,
          }}
        >
          Hey, I'm
        </span>

        {/* Name with per-letter animation */}
        <span
          ref={nameRef}
          style={{
            display: "block",
            color: "#ffffff",
            perspective: "600px",
          }}
        >
          {"Rajat.".split("").map((char, i) => (
            <span
              key={i}
              className="hero-letter"
              style={{
                display: "inline-block",
                opacity: 0,
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </h1>

      {/* Bio */}
      <p
        ref={bioRef}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px", lineHeight: 1.7,
          color: "rgba(255,255,255,0.6)",
          maxWidth: "320px", margin: "20px 0 32px",
          opacity: 0,
        }}
      >
        {config.developer.description}
      </p>

      {/* CTA */}
      <div ref={ctaRef} style={{ opacity: 0 }}>
        <button
          onClick={scrollToWork}
          style={{
            background: "none", border: "none",
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px", color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.1em", cursor: "pointer",
            padding: 0,
          }}
        >
          Explore ↓
        </button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// ABOUT SECTION
// ─────────────────────────────────────────────────────────────────
function MobileAbout() {
  const sectionRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animateIn = (targets: string, opts: gsap.TweenVars = {}) =>
      gsap.fromTo(
        section.querySelectorAll(targets),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          ...opts,
        }
      );

    animateIn(".m-section-label");
    animateIn(".m-about-heading", { delay: 0.1 });
    animateIn(".m-about-bio p", { stagger: 0.12, delay: 0.2 });
    animateIn(".m-skill-badge", { stagger: 0.04, delay: 0.35 });
    animateIn(".m-exp-item", { stagger: 0.1, delay: 0.4 });
  }, []);

  // Freelance experiences only
  const freelanceExps = config.experiences.filter(e => e.era === "freelance");

  return (
    <section
      ref={sectionRef}
      id="m-about-section"
      style={{
        position: "relative", zIndex: 1,
        minHeight: "100svh",
        padding: "80px 24px 80px",
      }}
    >
      {/* Label */}
      <p className="m-section-label" style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "10px", color: ORANGE,
        letterSpacing: "0.2em", textTransform: "uppercase",
        fontWeight: 700, marginBottom: "16px",
        opacity: 0,
      }}>
        About Me
      </p>

      {/* Heading */}
      <h2 className="m-about-heading" style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900, fontSize: "clamp(2rem, 9vw, 3rem)",
        letterSpacing: "-0.03em", lineHeight: 1.05,
        color: "#fff", marginBottom: "32px",
        opacity: 0,
      }}>
        I'm Rajat.{" "}
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic", fontWeight: 400,
          color: "transparent",
          WebkitTextStroke: "1.2px rgba(255,255,255,0.45)",
        }}>
          Developer &amp; Designer.
        </span>
      </h2>

      {/* Bio paragraphs */}
      <div className="m-about-bio" style={{ marginBottom: "40px" }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px", lineHeight: 1.8,
          color: "rgba(255,255,255,0.6)",
          marginBottom: "16px", opacity: 0,
        }}>
          Full-stack builder creating digital experiences that respect humans and scale with clarity. I specialize in React, Node.js, and cutting-edge web technologies — turning complex problems into clean, performant products.
        </p>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px", lineHeight: 1.8,
          color: "rgba(255,255,255,0.6)",
          marginBottom: "16px", opacity: 0,
        }}>
          Four years of self-taught growth — from writing my first &lt;h1&gt; tag to building production-grade platforms with auth, AI integrations, and real users. Accessibility is my north star.
        </p>
      </div>

      {/* Tech skills */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "11px", color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.15em", textTransform: "uppercase",
        marginBottom: "12px",
      }}>
        Technologies
      </p>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "8px",
        marginBottom: "32px",
      }}>
        {TECH_SKILLS.map(({ label, Icon }) => (
          <span
            key={label}
            className="m-skill-badge"
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "6px 12px",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "4px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px", color: "rgba(255,255,255,0.7)",
              background: "rgba(255,255,255,0.04)",
              opacity: 0,
            }}
          >
            <Icon size={12} color={ORANGE} />
            {label}
          </span>
        ))}
      </div>

      {/* Design skills */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "11px", color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.15em", textTransform: "uppercase",
        marginBottom: "12px",
      }}>
        Creative Tools
      </p>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "8px",
        marginBottom: "40px",
      }}>
        {DESIGN_SKILLS.map(label => (
          <span
            key={label}
            className="m-skill-badge"
            style={{
              padding: "5px 10px",
              border: `1px solid rgba(${parseInt(ORANGE.slice(1,3),16)},${parseInt(ORANGE.slice(3,5),16)},${parseInt(ORANGE.slice(5,7),16)},0.3)`,
              borderRadius: "4px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px", color: "rgba(255,255,255,0.55)",
              background: "rgba(255,107,26,0.05)",
              opacity: 0,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Experience timeline */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "11px", color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.15em", textTransform: "uppercase",
        marginBottom: "16px",
      }}>
        Experience
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
        {freelanceExps.map((exp, idx) => (
          <div
            key={idx}
            className="m-exp-item"
            style={{
              padding: "16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              opacity: 0,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600, fontSize: "13px", color: "#fff",
              }}>
                {exp.position}
              </span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px", color: ORANGE, fontWeight: 600,
              }}>
                {exp.period}
              </span>
            </div>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px", color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              {exp.company}
            </span>
          </div>
        ))}
      </div>

      {/* Resume button */}
      <a
        href={config.contact.github}
        target="_blank" rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "12px 28px",
          border: `1.5px solid ${ORANGE}`,
          borderRadius: "4px",
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px", fontWeight: 600,
          color: ORANGE, textDecoration: "none",
          letterSpacing: "0.05em",
        }}
      >
        View GitHub →
      </a>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// WORK / PROJECTS SECTION
// ─────────────────────────────────────────────────────────────────
function MobileWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelectorAll(".m-project-item"),
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      }
    );
  }, []);

  const projects = config.projects as Project[];

  return (
    <section
      ref={sectionRef}
      id="m-work-section"
      style={{
        position: "relative", zIndex: 1,
        minHeight: "100svh",
        padding: "80px 24px 80px",
      }}
    >
      {/* Label */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "10px", color: ORANGE,
        letterSpacing: "0.2em", textTransform: "uppercase",
        fontWeight: 700, marginBottom: "16px",
      }}>
        Selected Work
      </p>

      {/* Heading */}
      <h2 style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900, fontSize: "clamp(2rem, 9vw, 3rem)",
        letterSpacing: "-0.03em", lineHeight: 1.05,
        color: "#fff", marginBottom: "40px",
      }}>
        Things I've{" "}
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic", fontWeight: 400,
          color: "transparent",
          WebkitTextStroke: "1.2px rgba(255,255,255,0.45)",
        }}>
          built.
        </span>
      </h2>

      {/* Project list */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="m-project-item"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "20px", paddingBottom: "20px",
              opacity: 0,
            }}
          >
            {/* Row: number + title + arrow */}
            <button
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                width: "100%", textAlign: "left",
                display: "flex", alignItems: "flex-start",
                gap: "16px", padding: 0,
              }}
            >
              {/* Number */}
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic", fontWeight: 400,
                fontSize: "14px", color: "rgba(255,255,255,0.2)",
                minWidth: "20px", paddingTop: "4px",
              }}>
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Title + category */}
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700, fontSize: "18px",
                  color: "#fff", letterSpacing: "-0.02em",
                  margin: 0,
                }}>
                  {project.title}
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px", color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  margin: "4px 0 0",
                }}>
                  {project.category} · {project.subtitle}
                </p>
              </div>

              {/* Expand arrow */}
              <span style={{
                color: ORANGE, fontSize: "18px",
                transform: expanded === idx ? "rotate(90deg)" : "none",
                transition: "transform 0.3s ease",
                paddingTop: "2px",
              }}>
                →
              </span>
            </button>

            {/* Expanded description */}
            {expanded === idx && (
              <div style={{ marginTop: "16px", paddingLeft: "36px" }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px", lineHeight: 1.75,
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: "12px",
                }}>
                  {project.description.split("\n\n")[0]}
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px", color: "rgba(255,255,255,0.3)",
                  marginBottom: "14px",
                  letterSpacing: "0.03em",
                }}>
                  {project.technologies}
                </p>
                <a
                  href={project.link}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px", fontWeight: 700,
                    color: ORANGE, textDecoration: "none",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                  }}
                >
                  View Project →
                </a>
              </div>
            )}
          </div>
        ))}

        {/* Bottom border */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// CONTACT SECTION
// ─────────────────────────────────────────────────────────────────
function MobileContact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const [mode, setMode]   = useState<"email" | "whatsapp">("email");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg]     = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelectorAll(".m-contact-animate"),
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      }
    );
  }, []);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "4px", outline: "none",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px", color: "#fff",
    marginBottom: "12px",
    boxSizing: "border-box",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "email") {
      window.location.href = `mailto:${config.contact.email}?subject=Project Inquiry from ${name}&body=${msg}%0A%0AFrom: ${email}`;
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Hi Rajat! I'm ${name}.\n${msg}\nEmail: ${email}`)}`);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="m-contact-section"
      style={{
        position: "relative", zIndex: 1,
        minHeight: "100svh",
        padding: "80px 24px 80px",
      }}
    >
      {/* Label */}
      <p className="m-contact-animate" style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "10px", color: ORANGE,
        letterSpacing: "0.2em", textTransform: "uppercase",
        fontWeight: 700, marginBottom: "16px",
        opacity: 0,
      }}>
        Get In Touch
      </p>

      {/* Heading */}
      <h2 className="m-contact-animate" style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900, fontSize: "clamp(1.8rem, 9vw, 2.8rem)",
        letterSpacing: "-0.03em", lineHeight: 1.1,
        color: "#fff", marginBottom: "12px",
        opacity: 0,
      }}>
        Let's build something{" "}
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic", fontWeight: 400,
          color: "transparent",
          WebkitTextStroke: "1.2px rgba(255,255,255,0.45)",
        }}>
          cool.
        </span>
      </h2>

      <p className="m-contact-animate" style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "14px", color: "rgba(255,255,255,0.5)",
        lineHeight: 1.7, marginBottom: "32px",
        opacity: 0,
      }}>
        Open for new projects, freelance work, and collaborations. Drop me a message.
      </p>

      {/* Toggle: Email / WhatsApp */}
      <div className="m-contact-animate" style={{
        display: "flex", gap: "8px", marginBottom: "24px",
        opacity: 0,
      }}>
        {(["email", "whatsapp"] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "8px 20px",
              background: mode === m ? ORANGE : "rgba(255,255,255,0.05)",
              border: mode === m ? "none" : "1px solid rgba(255,255,255,0.12)",
              borderRadius: "4px", cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px", fontWeight: 600,
              color: mode === m ? "#fff" : "rgba(255,255,255,0.5)",
              textTransform: "capitalize",
              transition: "all 0.2s",
            }}
          >
            {m === "email" ? "📧 Email" : "💬 WhatsApp"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form className="m-contact-animate" onSubmit={handleSubmit} style={{ opacity: 0 }}>
        <input
          type="text" placeholder="Your Name" value={name}
          onChange={e => setName(e.target.value)} required
          className="m-input" style={inputStyle}
        />
        <input
          type="email" placeholder="Your Email" value={email}
          onChange={e => setEmail(e.target.value)} required
          className="m-input" style={inputStyle}
        />
        <textarea
          placeholder="Your Message" value={msg}
          onChange={e => setMsg(e.target.value)} required rows={5}
          className="m-input" style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
        />
        <button
          type="submit"
          style={{
            width: "100%", padding: "16px",
            background: ORANGE, border: "none", borderRadius: "4px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px", fontWeight: 700, color: "#fff",
            letterSpacing: "0.05em", textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {mode === "email" ? "Send Email →" : "Send WhatsApp →"}
        </button>
      </form>

      {/* Direct contact */}
      <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <a
          href={`mailto:${config.contact.email}`}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px", color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
          }}
        >
          {config.contact.email}
        </a>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────
function MobileFooter() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{
      position: "relative", zIndex: 1,
      padding: "60px 24px 40px",
      borderTop: "1px solid rgba(255,255,255,0.07)",
    }}>
      {/* Big name */}
      <h2 style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900, fontSize: "clamp(3.5rem, 18vw, 7rem)",
        letterSpacing: "-0.04em", lineHeight: 0.85,
        color: "transparent",
        WebkitTextStroke: "1.5px rgba(255,255,255,0.12)",
        marginBottom: "40px",
      }}>
        Rajat
      </h2>

      {/* Nav links */}
      <nav style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "Projects", id: "m-work-section" },
          { label: "About",    id: "m-about-section" },
          { label: "Contact",  id: "m-contact-section" },
        ].map(link => (
          <button
            key={link.label}
            onClick={() => scrollTo(link.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px", color: "rgba(255,255,255,0.4)",
              padding: 0,
              transition: "color 0.2s",
            }}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Social links */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "GitHub",    href: config.contact.github },
          { label: "LinkedIn",  href: config.contact.linkedin },
          { label: "Instagram", href: config.contact.instagram },
        ].map(social => (
          <a
            key={social.label}
            href={social.href}
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px", color: "rgba(255,255,255,0.35)",
              textDecoration: "none", textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {social.label}
          </a>
        ))}
      </div>

      {/* Email */}
      <a
        href={`mailto:${config.contact.email}`}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px", color: ORANGE,
          textDecoration: "none", display: "block",
          marginBottom: "32px",
        }}
      >
        {config.contact.email}
      </a>

      {/* Copyright */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "11px", color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.05em",
      }}>
        © {new Date().getFullYear()} Rajat Kumar Dua. All rights reserved.
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN MOBILE PAGE
// ─────────────────────────────────────────────────────────────────
export default function MobilePage() {
  useEffect(() => {
    // Override global body styles for mobile experience
    document.body.style.overflow  = "auto";
    document.body.style.background = BG;
    document.documentElement.style.background = BG;

    // Inject scoped styles for placeholder + input focus + hover
    const style = document.createElement("style");
    style.id = "mobile-page-styles";
    style.textContent = `
      .m-input::placeholder { color: rgba(255,255,255,0.25); }
      .m-input:focus { border-color: rgba(255,107,26,0.5) !important; outline: none; }
      .m-nav-link:hover { color: ${ORANGE} !important; }
      .m-skill-badge:hover { border-color: rgba(255,107,26,0.4) !important; }
    `;
    document.head.appendChild(style);

    // Single cleanup — restores everything
    return () => {
      document.body.style.overflow = "";
      document.body.style.background = "";
      document.documentElement.style.background = "";
      const s = document.getElementById("mobile-page-styles");
      if (s) s.remove();
    };
  }, []);

  return (
    <div style={{
      position: "relative",
      background: BG,
      color: "#fff",
      minHeight: "100svh",
      fontFamily: "'Inter', sans-serif",
      overflowX: "hidden",
    }}>
      {/* Fixed parallax background */}
      <ScrollBackground />

      {/* Fixed navbar */}
      <MobileNavbar />

      {/* Page sections — positioned above background (z:1) */}
      {/* max-width 680px so tablets look centered + cinematic, not stretched */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
        <MobileHero />
        <MobileAbout />
        <MobileWork />
        <MobileContact />
        <MobileFooter />
      </div>
    </div>
  );
}
