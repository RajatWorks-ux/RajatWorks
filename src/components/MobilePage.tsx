/**
 * MobilePage.tsx — COMPLETE MOBILE EXPERIENCE v3
 * ─────────────────────────────────────────────────────────────────────────
 * Rajat's content in friend's (sarang-space.site) cinematic design.
 *
 * VIEWS (SPA state-based routing):
 *   "home"     → full scroll: Hero → About → Work → Services → WhyMe →
 *                             Process → Testimonials → FAQ → CTA → Contact → Footer
 *   "about"    → About sub-page  (profile card + bio + skills + experience)
 *   "projects" → Projects sub-page (Creative Archive)
 *   "contact"  → Contact sub-page (full form with gradient-blinds bg)
 *
 * • Zero Next.js deps — pure React + GSAP
 * • Inline styles + one injected <style> tag for pseudo-selectors
 * ─────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";

import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiNodedotjs, SiExpress, SiMongodb, SiTailwindcss,
  SiFramer, SiThreedotjs,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────
// CONSTANTS & DATA
// ─────────────────────────────────────────────────────────────────
const ORANGE = "#ff6b1a";
const BG     = "#080808";

type View = "home" | "about" | "projects" | "contact";

const SECTION_IMAGES = [
  { id: null,                src: "/mobile-assets/hero.webp"    },
  { id: "m-about-section",   src: "/mobile-assets/about.webp"   },
  { id: "m-work-section",    src: "/mobile-assets/project.webp" },
  { id: "m-contact-section", src: "/mobile-assets/contact.webp" },
];

const TECH_SKILLS = [
  { label: "JavaScript",    Icon: SiJavascript  },
  { label: "TypeScript",    Icon: SiTypescript  },
  { label: "React",         Icon: SiReact       },
  { label: "Next.js",       Icon: SiNextdotjs   },
  { label: "Node.js",       Icon: SiNodedotjs   },
  { label: "Express.js",    Icon: SiExpress     },
  { label: "MongoDB",       Icon: SiMongodb     },
  { label: "TailwindCSS",   Icon: SiTailwindcss },
  { label: "Framer Motion", Icon: SiFramer      },
  { label: "Three.js",      Icon: SiThreedotjs  },
];

const DESIGN_SKILLS = [
  "UI Design","UX Design","Figma","Photoshop",
  "Motion Design","Responsive Design","Accessibility","Prototyping",
];

const SERVICES = [
  {
    num: "01",
    title: "FULL-STACK WEB DEVELOPMENT",
    desc: "End-to-end React + Node.js applications built for performance, scale, and real users. From landing pages to full product suites.",
    tags: ["React", "Next.js", "Node.js", "MongoDB"],
  },
  {
    num: "02",
    title: "UI/UX DESIGN",
    desc: "I design in Figma and build pixel-perfect implementations. Clean, accessible interfaces that convert and feel premium.",
    tags: ["Figma", "UI Design", "UX Design", "Responsive"],
  },
  {
    num: "03",
    title: "BACKEND & API SYSTEMS",
    desc: "Secure REST APIs, authentication flows, database architecture, CMS panels, and third-party service integrations.",
    tags: ["Express.js", "Supabase", "REST APIs", "Auth"],
  },
  {
    num: "04",
    title: "MOTION & ANIMATIONS",
    desc: "I add purposeful scroll-driven animations and motion design to make your site feel polished, alive, and memorable.",
    tags: ["GSAP", "Framer Motion", "Three.js", "CSS"],
  },
];

const WHY_ME = [
  {
    num: "01",
    title: "Velocity & Agility",
    desc: "Most projects ship in 2–4 weeks. I move fast without cutting corners — clean code, clear communication, no delays.",
  },
  {
    num: "02",
    title: "Direct Collaboration",
    desc: "You work directly with the developer building your product. Zero agency overhead, zero communication latency.",
  },
  {
    num: "03",
    title: "Design + Engineering",
    desc: "Bridging the gap between beautiful design and production-grade code — ensuring the final product matches the vision exactly.",
  },
  {
    num: "04",
    title: "Device Precision",
    desc: "Fully responsive layouts built mobile-first and tested on physical devices — phones, tablets, and desktop.",
  },
  {
    num: "05",
    title: "Full Code Ownership",
    desc: "No proprietary platforms or vendor lock-in. Clean, modular code that your team owns completely.",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery & Strategy",
    desc: "We discuss objectives, references, and brand parameters. I establish a bulletproof technical brief before writing a single line of code.",
  },
  {
    num: "02",
    title: "Design & Prototyping",
    desc: "Custom layouts in Figma and structured motion/UI components so the visual direction is concrete before development begins.",
  },
  {
    num: "03",
    title: "High-Performance Dev",
    desc: "I build using React, Next.js, and Node.js — focusing on accessibility, SEO, performance, and pixel-perfect implementation.",
  },
  {
    num: "04",
    title: "Test & Launch",
    desc: "Responsiveness tested across multiple real devices, loading speed optimized, and the final build deployed with zero compromises.",
  },
];

const TESTIMONIALS = [
  {
    stars: 5,
    quote: "Rajat built our gym's website and a complete owner panel from scratch. We can now update everything ourselves — membership plans, gallery, hero content — without touching any code. The quality is exceptional.",
    name: "Harpreet Singh",
    role: "OWNER · KNOCKOUT GYM",
    initials: "HS",
  },
  {
    stars: 5,
    quote: "Clean architecture, fast delivery, and excellent communication throughout the project. Rajat built exactly what we envisioned. The animations and UI polish are at a professional agency level.",
    name: "Priya Sharma",
    role: "PRODUCT LEAD · VAKILR",
    initials: "PS",
  },
  {
    stars: 5,
    quote: "MIRA exceeded all our expectations. Multi-model AI routing, beautiful responsive UI, and a rock-solid auth system — all shipped solo. Rajat understands both design and engineering at a deep level.",
    name: "Arjun Mehta",
    role: "FOUNDER · TECH STARTUP",
    initials: "AM",
  },
];

const FAQ_ITEMS = [
  {
    q: "How long does a typical project take?",
    a: "Most projects ship in 2–4 weeks. Simple landing pages take 1–2 weeks. Full-stack apps with auth and CMS typically take 3–6 weeks. I give an honest timeline upfront after understanding full scope.",
  },
  {
    q: "What do you need from me to begin?",
    a: "A clear brief — your goals, references you like, and any existing brand assets. If you don't have a design, I handle that too. We start with a discovery call to align on scope.",
  },
  {
    q: "Do you work with clients remotely?",
    a: "Yes. I work fully remote and have delivered projects across India and internationally. Communication is async-friendly — I keep you updated at every milestone.",
  },
  {
    q: "Can you redesign an existing website?",
    a: "Absolutely. I analyze your current site, identify friction points, and rebuild with better architecture and design. Content migration and backend integration included.",
  },
  {
    q: "What is your pricing model?",
    a: "Project-based fixed pricing — no hourly billing surprises. I quote after understanding full scope. Payment is split: 50% upfront to begin, 50% on final delivery.",
  },
];

interface Project {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  technologies: string;
  link: string;
  description: string;
  images?: string[];
}

// ─────────────────────────────────────────────────────────────────
// SCROLL-DRIVEN PARALLAX BACKGROUND (home view only)
// ─────────────────────────────────────────────────────────────────
function ScrollBackground() {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const getSectionTop = (id: string | null): number => {
      if (!id) return 0;
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
    };

    const loop = () => {
      const scrollY   = window.scrollY;
      const viewH     = window.innerHeight;
      const docH      = document.documentElement.scrollHeight;
      const maxScroll = docH - viewH;
      const scrollPct = maxScroll > 0 ? scrollY / maxScroll : 0;

      const tops = SECTION_IMAGES.map(s => getSectionTop(s.id));
      let activeIdx = 0;
      for (let i = tops.length - 1; i >= 0; i--) {
        if (scrollY + viewH * 0.4 >= tops[i]) { activeIdx = i; break; }
      }

      layerRefs.current.forEach((layer, idx) => {
        if (!layer) return;
        const target  = idx === activeIdx ? 1 : 0;
        const cur     = parseFloat(layer.style.opacity || "0");
        layer.style.opacity   = String(cur + (target - cur) * 0.08);
        const py = scrollPct * 30 * (idx % 2 === 0 ? 1 : -1);
        layer.style.transform = `translateY(${py}px) scale(1.1)`;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: BG }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "rgba(8,8,8,0.62)" }} />
      {SECTION_IMAGES.map((s, idx) => (
        <div
          key={idx}
          ref={el => { layerRefs.current[idx] = el; }}
          style={{
            position: "absolute", inset: "-10%",
            opacity: idx === 0 ? 1 : 0,
            backgroundImage: `url(${s.src})`,
            backgroundSize: "cover", backgroundPosition: "center",
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STATIC BACKGROUND (sub-pages)
// ─────────────────────────────────────────────────────────────────
function SubPageBackground({ src }: { src: string }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: BG }}>
      <div style={{
        position: "absolute", inset: "-10%",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.18, filter: "blur(3px)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(8,8,8,0.65) 0%, rgba(8,8,8,0.55) 50%, rgba(8,8,8,0.88) 100%)",
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────
interface NavbarProps {
  view: View;
  setView: (v: View) => void;
}

function MobileNavbar({ view, setView }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (menuOpen) {
      overlay.style.display = "flex";
      gsap.fromTo(overlay, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
      const links = overlay.querySelectorAll(".m-nav-link");
      gsap.fromTo(links, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out", delay: 0.1 });
      document.body.style.overflow = "hidden";
    } else {
      gsap.to(overlay, { opacity: 0, y: -10, duration: 0.3, ease: "power2.in", onComplete: () => { overlay.style.display = "none"; } });
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  // Close menu on view change
  useEffect(() => { setMenuOpen(false); }, [view]);

  const navigate = (target: View | string) => {
    if (target === "about" || target === "projects" || target === "contact" || target === "home") {
      setView(target as View);
    } else {
      // scroll to section id (only works on home view)
      if (view !== "home") {
        setView("home");
        setTimeout(() => {
          const el = document.getElementById(target as string);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        const el = document.getElementById(target as string);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  const NAV_LINKS = [
    { label: "About",    action: "about"              },
    { label: "Projects", action: "projects"            },
    { label: "Services", action: "m-services-section"  },
    { label: "Process",  action: "m-process-section"   },
    { label: "Contact",  action: "contact"             },
  ];

  const isSubPage = view !== "home";
  const subPageLabels: Record<string, string> = {
    about: "ABOUT ME", projects: "CREATIVE ARCHIVE", contact: "GET IN TOUCH",
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: "60px",
        background: (scrolled || isSubPage) ? "rgba(8,8,8,0.92)" : "transparent",
        backdropFilter: (scrolled || isSubPage) ? "blur(16px)" : "none",
        borderBottom: (scrolled || isSubPage) ? "1px solid rgba(255,255,255,0.07)" : "none",
        transition: "background 0.4s, border-color 0.4s",
      }}>
        {/* Left side */}
        {isSubPage ? (
          <button
            onClick={() => setView("home")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "10px", color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.2em", textTransform: "uppercase",
              padding: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: ORANGE, fontWeight: 700 }}>{subPageLabels[view]}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>BACK</span>
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/mobile-assets/logo navbar inverse.png"
              alt="Rajat"
              style={{ height: "26px", objectFit: "contain" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <span style={{
              fontFamily: "'Inter', sans-serif", fontWeight: 700,
              fontSize: "15px", color: "#fff", letterSpacing: "-0.02em",
            }}>Rajat</span>
          </div>
        )}

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
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block",
              width: menuOpen && i === 1 ? 0 : "22px",
              height: "2px", background: "#fff", borderRadius: "2px",
              transition: "all 0.3s ease",
              transform: menuOpen
                ? i === 0 ? "rotate(45deg) translate(5px,5px)"
                : i === 2 ? "rotate(-45deg) translate(5px,-5px)"
                : "scaleX(0)"
                : "none",
            }}/>
          ))}
        </button>
      </nav>

      {/* Fullscreen overlay menu */}
      <div
        ref={overlayRef}
        style={{
          display: "none", position: "fixed", inset: 0, zIndex: 99,
          background: "rgba(8,8,8,0.97)",
          flexDirection: "column", alignItems: "flex-start",
          justifyContent: "center", padding: "0 32px", gap: "4px",
        }}
      >
        {NAV_LINKS.map(link => (
          <button
            key={link.label}
            className="m-nav-link"
            onClick={() => navigate(link.action)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700, fontSize: "clamp(2rem, 10vw, 3.5rem)",
              color: "#fff", letterSpacing: "-0.03em",
              padding: "6px 0", textAlign: "left", opacity: 0,
            }}
          >
            {link.label}
          </button>
        ))}
        <button
          className="m-nav-link"
          onClick={() => navigate("contact")}
          style={{
            marginTop: "20px", padding: "14px 32px",
            background: ORANGE, border: "none", borderRadius: "4px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700, fontSize: "14px", color: "#fff",
            cursor: "pointer", letterSpacing: "0.05em",
            textTransform: "uppercase", opacity: 0,
          }}
        >
          Start a Project
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────
function MobileHero({ setView }: { setView: (v: View) => void }) {
  const labelRef     = useRef<HTMLParagraphElement>(null);
  const ghostLineRef = useRef<HTMLSpanElement>(null);
  const nameRef      = useRef<HTMLSpanElement>(null);
  const bioRef       = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(labelRef.current,     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.3 })
      .fromTo(ghostLineRef.current, { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
      .fromTo(nameRef.current?.querySelectorAll(".hero-letter") ?? [],
        { opacity: 0, y: 100, rotateX: -40 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 0.6 }, "-=0.4")
      .fromTo(bioRef.current,  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.2")
      .fromTo(ctaRef.current,  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
  }, []);

  return (
    <section style={{
      position: "relative", zIndex: 1, minHeight: "100svh",
      display: "flex", flexDirection: "column",
      justifyContent: "flex-end", padding: "0 24px 64px",
    }}>
      <p ref={labelRef} style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "10px", color: ORANGE,
        letterSpacing: "0.2em", textTransform: "uppercase",
        fontWeight: 700, marginBottom: "24px", opacity: 0,
      }}>
        Full Stack Developer
      </p>

      <h1 style={{
        margin: 0, padding: 0, fontFamily: "'Inter', sans-serif",
        fontWeight: 900, lineHeight: 0.85, letterSpacing: "-0.03em",
        fontSize: "clamp(4rem, 18vw, 7rem)",
      }}>
        <span ref={ghostLineRef} style={{
          display: "block", fontFamily: "'Playfair Display', serif",
          fontStyle: "italic", fontWeight: 400, color: "transparent",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.45)", opacity: 0,
        }}>Hey, I'm</span>
        <span ref={nameRef} style={{ display: "block", color: "#fff", perspective: "600px" }}>
          {"Rajat.".split("").map((char, i) => (
            <span key={i} className="hero-letter" style={{ display: "inline-block", opacity: 0 }}>
              {char}
            </span>
          ))}
        </span>
      </h1>

      <p ref={bioRef} style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "14px", lineHeight: 1.7,
        color: "rgba(255,255,255,0.6)",
        maxWidth: "320px", margin: "20px 0 28px", opacity: 0,
      }}>
        Full-stack builder creating digital experiences that respect humans and scale with clarity.
      </p>

      <div ref={ctaRef} style={{ opacity: 0, display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <button
          onClick={() => setView("contact")}
          style={{
            padding: "12px 24px",
            background: ORANGE, border: "none", borderRadius: "4px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px", fontWeight: 700, color: "#fff",
            letterSpacing: "0.06em", textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Start a Project →
        </button>
        <button
          onClick={() => { const el = document.getElementById("m-work-section"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
          style={{
            background: "none", border: "none",
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px", color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.1em", cursor: "pointer", padding: 0,
          }}
        >
          Explore ↓
        </button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// ABOUT (inline scroll section — simplified, full detail in sub-page)
// ─────────────────────────────────────────────────────────────────
function MobileAbout({ setView }: { setView: (v: View) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const freelanceExps = config.experiences.filter((e: { era: string }) => e.era === "freelance");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const animIn = (sel: string, opts: gsap.TweenVars = {}) =>
      gsap.fromTo(section.querySelectorAll(sel),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" }, ...opts });
    animIn(".m-about-el");
    animIn(".m-skill-badge", { stagger: 0.04, delay: 0.2 });
    animIn(".m-exp-item",    { stagger: 0.1,  delay: 0.3 });
  }, []);

  return (
    <section ref={sectionRef} id="m-about-section" style={{
      position: "relative", zIndex: 1,
      minHeight: "100svh", padding: "80px 24px 80px",
    }}>
      <p className="m-about-el" style={{
        fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE,
        letterSpacing: "0.2em", textTransform: "uppercase",
        fontWeight: 700, marginBottom: "16px", opacity: 0,
      }}>About Me</p>

      <h2 className="m-about-el" style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 900,
        fontSize: "clamp(2rem, 9vw, 3rem)", letterSpacing: "-0.03em",
        lineHeight: 1.05, color: "#fff", marginBottom: "32px", opacity: 0,
      }}>
        I'm Rajat.{" "}
        <span style={{
          fontFamily: "'Playfair Display', serif", fontStyle: "italic",
          fontWeight: 400, color: "transparent",
          WebkitTextStroke: "1.2px rgba(255,255,255,0.45)",
        }}>Developer &amp; Designer.</span>
      </h2>

      <div className="m-about-el" style={{ marginBottom: "40px", opacity: 0 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.8, color: "rgba(255,255,255,0.6)", marginBottom: "14px" }}>
          Full-stack builder creating digital experiences that respect humans and scale with clarity. I specialize in React, Node.js, and cutting-edge web technologies.
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.8, color: "rgba(255,255,255,0.6)" }}>
          Four years of self-taught growth — from writing my first &lt;h1&gt; tag to building production-grade platforms with auth, AI integrations, and real users.
        </p>
      </div>

      {/* Tech skills */}
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>Technologies</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
        {TECH_SKILLS.map(({ label, Icon }) => (
          <span key={label} className="m-skill-badge" style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "6px 12px", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "4px", fontFamily: "'Inter', sans-serif",
            fontSize: "12px", color: "rgba(255,255,255,0.7)",
            background: "rgba(255,255,255,0.04)", opacity: 0,
          }}>
            <Icon size={12} color={ORANGE} />{label}
          </span>
        ))}
      </div>

      {/* Experience */}
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Experience</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
        {freelanceExps.map((exp: { position: string; period: string; company: string }, idx: number) => (
          <div key={idx} className="m-exp-item" style={{
            padding: "14px 16px", background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", opacity: 0,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "13px", color: "#fff" }}>{exp.position}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: ORANGE, fontWeight: 600 }}>{exp.period}</span>
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{exp.company}</span>
          </div>
        ))}
      </div>

      {/* View full profile CTA */}
      <button
        className="m-about-el"
        onClick={() => setView("about")}
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "12px 24px",
          border: `1.5px solid ${ORANGE}`, borderRadius: "4px",
          background: "none", cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px", fontWeight: 600, color: ORANGE,
          letterSpacing: "0.05em", opacity: 0,
        }}
      >
        View Full Profile →
      </button>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// WORK / PROJECTS
// ─────────────────────────────────────────────────────────────────
function MobileWork({ setView }: { setView: (v: View) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.fromTo(section.querySelectorAll(".m-project-item"),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" } });
  }, []);

  const projects = config.projects as Project[];

  return (
    <section ref={sectionRef} id="m-work-section" style={{
      position: "relative", zIndex: 1, minHeight: "100svh", padding: "80px 24px",
    }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "16px" }}>
        Selected Work
      </p>
      <h2 style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 900,
        fontSize: "clamp(2rem, 9vw, 3rem)", letterSpacing: "-0.03em",
        lineHeight: 1.05, color: "#fff", marginBottom: "40px",
      }}>
        Things I've{" "}
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, color: "transparent", WebkitTextStroke: "1.2px rgba(255,255,255,0.45)" }}>
          built.
        </span>
      </h2>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {projects.map((project, idx) => (
          <div key={project.id} className="m-project-item" style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "20px", paddingBottom: "20px", opacity: 0,
          }}>
            <button
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                width: "100%", textAlign: "left",
                display: "flex", alignItems: "flex-start", gap: "16px", padding: 0,
              }}
            >
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.2)", minWidth: "20px", paddingTop: "4px" }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff", letterSpacing: "-0.02em", margin: 0 }}>{project.title}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "4px 0 0" }}>
                  {project.category} · {project.subtitle}
                </p>
              </div>
              <span style={{ color: ORANGE, fontSize: "18px", transform: expanded === idx ? "rotate(90deg)" : "none", transition: "transform 0.3s ease", paddingTop: "2px" }}>→</span>
            </button>

            {expanded === idx && (
              <div style={{ marginTop: "16px", paddingLeft: "36px" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.75, color: "rgba(255,255,255,0.55)", marginBottom: "12px" }}>
                  {project.description.split("\n\n")[0]}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.03em" }}>{project.technologies}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, color: ORANGE, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  View Project →
                </a>
              </div>
            )}
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />
      </div>

      {/* Archive CTA */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          onClick={() => setView("projects")}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "12px 28px",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px",
            background: "rgba(255,255,255,0.03)", cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}
        >
          View Creative Archive →
        </button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SERVICES — "WHAT I DO"
// ─────────────────────────────────────────────────────────────────
function MobileServices() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.fromTo(section.querySelectorAll(".m-svc-item"),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" } });
  }, []);

  return (
    <section ref={sectionRef} id="m-services-section" style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
      <p className="m-svc-item" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "16px", opacity: 0 }}>
        What I Do
      </p>
      <h2 className="m-svc-item" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 9vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", marginBottom: "48px", opacity: 0 }}>
        Services.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {SERVICES.map((svc, i) => (
          <div key={i} className="m-svc-item" style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "28px 0", opacity: 0,
          }}>
            <div style={{ display: "flex", gap: "16px" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: ORANGE, fontWeight: 700, minWidth: "24px", paddingTop: "2px" }}>{svc.num}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "15px", color: "#fff", letterSpacing: "0.02em", margin: "0 0 10px" }}>
                  {svc.title}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: "0 0 14px" }}>
                  {svc.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {svc.tags.map(tag => (
                    <span key={tag} style={{
                      padding: "3px 10px", border: "1px solid rgba(255,107,26,0.2)",
                      borderRadius: "3px", fontFamily: "'Inter', sans-serif",
                      fontSize: "10px", color: "rgba(255,255,255,0.45)",
                      background: "rgba(255,107,26,0.04)", letterSpacing: "0.05em",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// WHY WORK WITH ME
// ─────────────────────────────────────────────────────────────────
function MobileWhyMe() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.fromTo(section.querySelectorAll(".m-whyme-el"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" } });
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
      <p className="m-whyme-el" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "16px", opacity: 0 }}>
        Why Work With Me
      </p>
      <h2 className="m-whyme-el" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem, 7vw, 2.6rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#fff", marginBottom: "48px", opacity: 0 }}>
        The difference is in the execution.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {WHY_ME.map((item, i) => (
          <div key={i} className="m-whyme-el" style={{ display: "flex", gap: "20px", opacity: 0 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: ORANGE, fontWeight: 700, minWidth: "24px", paddingTop: "2px" }}>{item.num}</span>
            <div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "15px", color: "#fff", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{item.title}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: 0 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// PROCESS
// ─────────────────────────────────────────────────────────────────
function MobileProcess() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.fromTo(section.querySelectorAll(".m-proc-el"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" } });
  }, []);

  return (
    <section ref={sectionRef} id="m-process-section" style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
      <p className="m-proc-el" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "16px", opacity: 0 }}>
        How It Works
      </p>
      <h2 className="m-proc-el" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 9vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", marginBottom: "48px", opacity: 0 }}>
        Process.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {PROCESS_STEPS.map((step, i) => (
          <div key={i} className="m-proc-el" style={{ paddingBottom: "32px", marginBottom: "32px", borderBottom: i < PROCESS_STEPS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none", opacity: 0 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: ORANGE, fontWeight: 700, display: "block", marginBottom: "8px" }}>{step.num}</span>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "17px", color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>{step.title}</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.75, color: "rgba(255,255,255,0.5)", margin: 0 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────
function MobileTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.fromTo(section.querySelectorAll(".m-testi-card"),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" } });
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "16px" }}>
        What Clients Say
      </p>
      <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 9vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", marginBottom: "40px" }}>
        Testimonials.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="m-testi-card" style={{
            padding: "24px 20px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px", opacity: 0,
          }}>
            {/* Stars */}
            <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
              {Array(t.stars).fill(0).map((_, j) => (
                <span key={j} style={{ color: ORANGE, fontSize: "14px" }}>★</span>
              ))}
            </div>
            {/* Quote */}
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.75, color: "rgba(255,255,255,0.65)", margin: "0 0 20px", fontStyle: "italic" }}>
              "{t.quote}"
            </p>
            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "rgba(255,107,26,0.15)",
                border: "1px solid rgba(255,107,26,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "12px", color: ORANGE }}>{t.initials}</span>
              </div>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "13px", color: "#fff", margin: 0 }}>{t.name}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.35)", margin: "2px 0 0", letterSpacing: "0.05em" }}>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────
function MobileFAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.fromTo(section.querySelectorAll(".m-faq-item"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" } });
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "16px" }}>
        Questions
      </p>
      <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 9vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", marginBottom: "40px" }}>
        FAQ.
      </h2>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="m-faq-item" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", opacity: 0 }}>
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                width: "100%", display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "20px 0", textAlign: "left",
              }}
            >
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "14px", color: openIdx === i ? "#fff" : "rgba(255,255,255,0.7)", flex: 1, paddingRight: "16px" }}>
                {item.q}
              </span>
              <span style={{
                color: ORANGE, fontSize: "20px", fontWeight: 300, lineHeight: 1,
                transform: openIdx === i ? "rotate(45deg)" : "none",
                transition: "transform 0.25s ease", flexShrink: 0,
              }}>+</span>
            </button>
            {openIdx === i && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.75, color: "rgba(255,255,255,0.5)", padding: "0 32px 20px 0", margin: 0 }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// CTA — "Ready to build something?"
// ─────────────────────────────────────────────────────────────────
function MobileCTA({ setView }: { setView: (v: View) => void }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.fromTo(section.querySelectorAll(".m-cta-el"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" } });
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative", zIndex: 1, padding: "80px 24px 80px" }}>
      <p className="m-cta-el" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "20px", opacity: 0 }}>
        Next Phase
      </p>
      <h2 className="m-cta-el" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 8vw, 2.8rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#fff", marginBottom: "20px", opacity: 0 }}>
        Ready to build something great?
      </h2>
      <p className="m-cta-el" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", marginBottom: "36px", maxWidth: "340px", opacity: 0 }}>
        Let's discuss your objectives, design parameters, and construct a web solution built for real impact.
      </p>
      <div className="m-cta-el" style={{ display: "flex", gap: "14px", flexWrap: "wrap", opacity: 0 }}>
        <button
          onClick={() => setView("contact")}
          style={{
            padding: "14px 28px", background: ORANGE, border: "none",
            borderRadius: "4px", fontFamily: "'Inter', sans-serif",
            fontSize: "13px", fontWeight: 700, color: "#fff",
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Start a Project →
        </button>
        <button
          onClick={() => setView("projects")}
          style={{
            padding: "14px 24px", background: "none",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
          }}
        >
          View My Work
        </button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// CONTACT (inline section)
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
    gsap.fromTo(section.querySelectorAll(".m-contact-animate"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" } });
  }, []);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "4px", outline: "none",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px", color: "#fff",
    marginBottom: "12px", boxSizing: "border-box",
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
    <section ref={sectionRef} id="m-contact-section" style={{ position: "relative", zIndex: 1, minHeight: "100svh", padding: "80px 24px" }}>
      <p className="m-contact-animate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "16px", opacity: 0 }}>
        Get In Touch
      </p>
      <h2 className="m-contact-animate" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 9vw, 2.8rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#fff", marginBottom: "12px", opacity: 0 }}>
        Let's build something{" "}
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, color: "transparent", WebkitTextStroke: "1.2px rgba(255,255,255,0.45)" }}>cool.</span>
      </h2>
      <p className="m-contact-animate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "32px", opacity: 0 }}>
        Open for new projects, freelance work, and collaborations. Drop me a message.
      </p>

      <div className="m-contact-animate" style={{ display: "flex", gap: "8px", marginBottom: "24px", opacity: 0 }}>
        {(["email", "whatsapp"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: "8px 20px",
            background: mode === m ? ORANGE : "rgba(255,255,255,0.05)",
            border: mode === m ? "none" : "1px solid rgba(255,255,255,0.12)",
            borderRadius: "4px", cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px", fontWeight: 600,
            color: mode === m ? "#fff" : "rgba(255,255,255,0.5)",
            textTransform: "capitalize", transition: "all 0.2s",
          }}>
            {m === "email" ? "📧 Email" : "💬 WhatsApp"}
          </button>
        ))}
      </div>

      <form className="m-contact-animate" onSubmit={handleSubmit} style={{ opacity: 0 }}>
        <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required className="m-input" style={inputStyle} />
        <input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required className="m-input" style={inputStyle} />
        <textarea placeholder="Your Message" value={msg} onChange={e => setMsg(e.target.value)} required rows={5} className="m-input" style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }} />
        <button type="submit" style={{ width: "100%", padding: "16px", background: ORANGE, border: "none", borderRadius: "4px", fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer" }}>
          {mode === "email" ? "Send Email →" : "Send via WhatsApp →"}
        </button>
      </form>

      <div style={{ marginTop: "28px" }}>
        <a href={`mailto:${config.contact.email}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
          {config.contact.email}
        </a>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────
function MobileFooter({ setView }: { setView: (v: View) => void }) {
  return (
    <footer style={{ position: "relative", zIndex: 1, padding: "60px 24px 40px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(3.5rem, 18vw, 7rem)", letterSpacing: "-0.04em", lineHeight: 0.85, color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.1)", marginBottom: "40px" }}>
        Rajat
      </h2>
      <nav style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "About",    action: () => setView("about")    },
          { label: "Projects", action: () => setView("projects") },
          { label: "Contact",  action: () => setView("contact")  },
        ].map(link => (
          <button key={link.label} onClick={link.action} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", padding: 0, transition: "color 0.2s" }}>
            {link.label}
          </button>
        ))}
      </nav>
      <div style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "GitHub",    href: config.contact.github    },
          { label: "LinkedIn",  href: config.contact.linkedin  },
          { label: "Instagram", href: config.contact.instagram },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {s.label}
          </a>
        ))}
      </div>
      <a href={`mailto:${config.contact.email}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: ORANGE, textDecoration: "none", display: "block", marginBottom: "32px" }}>
        {config.contact.email}
      </a>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.18)", letterSpacing: "0.05em" }}>
        © {new Date().getFullYear()} Rajat Kumar Dua. All rights reserved.
      </p>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SUB-PAGES
// ═══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// ABOUT SUB-PAGE
// ─────────────────────────────────────────────────────────────────
function AboutSubPage({ setView }: { setView: (v: View) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const freelanceExps = config.experiences.filter((e: { era: string }) => e.era === "freelance");

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".ap-label",   { y: 20, opacity: 0, duration: 0.5, delay: 0.3 });
      gsap.from(".ap-h",       { y: 55, opacity: 0, duration: 0.8, ease: "power4.out", delay: 0.5 });
      gsap.from(".ap-card",    { scale: 0.95, opacity: 0, duration: 1, ease: "power3.out", delay: 0.6 });
      gsap.from(".ap-bio",     { y: 25, opacity: 0, duration: 0.6, delay: 0.8 });
      gsap.from(".ap-skill",   { x: -10, opacity: 0, stagger: 0.04, duration: 0.4, delay: 1 });
      gsap.from(".ap-exp",     { y: 15, opacity: 0, stagger: 0.08, duration: 0.5, delay: 1.1 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 1, padding: "80px 24px 60px", minHeight: "100svh" }}>
      <SubPageBackground src="/mobile-assets/about.webp" />

      <p className="ap-label" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 700, marginBottom: "20px" }}>
        About Me
      </p>
      <h1 className="ap-h" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 8vw, 2.8rem)", letterSpacing: "-0.03em", lineHeight: 1.0, color: "#fff", marginBottom: "28px" }}>
        <span style={{ display: "block" }}>I'm Rajat.</span>
        <span style={{ display: "block", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, color: "transparent", WebkitTextStroke: "1.2px rgba(255,255,255,0.45)", fontSize: "0.85em" }}>
          Developer &amp; Designer.
        </span>
      </h1>

      {/* Profile Card */}
      <div className="ap-card" style={{ marginBottom: "32px", display: "flex", justifyContent: "center" }}>
        <div style={{
          width: "100%", maxWidth: "300px", borderRadius: "20px",
          background: "linear-gradient(135deg, #1a1230 0%, #0f1a35 40%, #0f3060 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
          padding: "28px 22px", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "20px", background: "radial-gradient(ellipse at 25% 15%, rgba(255,107,26,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
          {/* Avatar */}
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #ff6b1a, #ff9a4a)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", boxShadow: "0 8px 28px rgba(255,107,26,0.35)" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "24px", color: "#fff" }}>RK</span>
          </div>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "20px", color: "#fff", letterSpacing: "-0.03em", margin: "0 0 4px" }}>Rajat Kumar Dua</h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0 0 20px" }}>Full Stack Developer</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(255,107,26,0.15)", border: "1px solid rgba(255,107,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "11px" }}>👤</span>
              </div>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: "#fff", margin: 0 }}>@rajatworks</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Available for Hire</p>
              </div>
            </div>
            <button onClick={() => setView("contact")} style={{ padding: "6px 14px", background: ORANGE, border: "none", borderRadius: "20px", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              Hire Me
            </button>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ marginBottom: "28px" }}>
        {[
          "Full-stack builder creating digital experiences that respect humans and scale with clarity. I specialize in React, Node.js, and cutting-edge web technologies — turning complex problems into clean, performant products.",
          "Four years of self-taught growth — from writing my first <h1> tag to building production-grade platforms with auth, AI integrations, and real users. Accessibility is my north star.",
          "I work closely with clients to build products that are fast, beautiful, and built for real business goals.",
        ].map((text, i) => (
          <p key={i} className="ap-bio" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.8, color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
            {text}
          </p>
        ))}
      </div>

      <a href={config.contact.github} target="_blank" rel="noopener noreferrer" className="ap-bio" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 22px", border: `1px solid rgba(255,107,26,0.3)`, borderRadius: "40px", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, color: ORANGE, textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "40px" }}>
        View GitHub →
      </a>

      {/* Tech skills */}
      <p className="ap-bio" style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>Tech I Work With</p>
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "24px", scrollbarWidth: "none" }}>
        {TECH_SKILLS.map(({ label, Icon }) => (
          <span key={label} className="ap-skill" style={{ flexShrink: 0, padding: "5px 10px", display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.9)", borderRadius: "40px", fontFamily: "'Inter', sans-serif", fontSize: "8px", color: "#000", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            <Icon size={9} />{label}
          </span>
        ))}
      </div>

      {/* Creative tools */}
      <p className="ap-bio" style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>Creative Tools</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "36px" }}>
        {DESIGN_SKILLS.map(label => (
          <span key={label} className="ap-skill" style={{ padding: "5px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "40px", fontFamily: "'Inter', sans-serif", fontSize: "8px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {label}
          </span>
        ))}
      </div>

      {/* Experience */}
      <p className="ap-bio" style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>Experience</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {freelanceExps.map((exp: { position: string; period: string; company: string }, i: number) => (
          <div key={i} className="ap-exp" style={{ borderLeft: `2px solid rgba(255,107,26,0.25)`, paddingLeft: "14px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 2px" }}>{exp.position}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>{exp.period}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PROJECTS SUB-PAGE — Creative Archive
// ─────────────────────────────────────────────────────────────────
function ProjectsSubPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "Full Stack" | "Frontend">("ALL");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const projects = config.projects as Project[];

  const filtered = activeFilter === "ALL"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".pa-heading",  { y: 50, opacity: 0, duration: 0.8, ease: "power4.out", delay: 0.4 });
      gsap.from(".pa-label",   { y: 20, opacity: 0, duration: 0.5, delay: 0.3 });
      gsap.from(".pa-filter",  { y: 15, opacity: 0, stagger: 0.06, duration: 0.4, delay: 0.7 });
    }, ref);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pa-project-row", { opacity: 0, y: 30, stagger: 0.08, duration: 0.5, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, [activeFilter]);

  const FILTERS = ["ALL", "Full Stack", "Frontend"] as const;

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 1, padding: "80px 24px 60px", minHeight: "100svh" }}>
      <SubPageBackground src="/mobile-assets/project.webp" />

      <p className="pa-label" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 700, marginBottom: "12px" }}>
        Creative
      </p>
      <h1 className="pa-heading" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem, 13vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#fff", marginBottom: "36px" }}>
        Archive.
      </h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "40px", flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f} className="pa-filter" onClick={() => { setActiveFilter(f); setExpandedId(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: activeFilter === f ? ORANGE : "rgba(255,255,255,0.35)", borderBottom: activeFilter === f ? `2px solid ${ORANGE}` : "2px solid transparent", paddingBottom: "4px", transition: "all 0.2s" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Projects list */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {filtered.map((project, idx) => (
          <div key={project.id} className="pa-project-row" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
              style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: "22px 0", display: "flex", gap: "16px", alignItems: "flex-start" }}
            >
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "12px", color: "rgba(255,255,255,0.2)", minWidth: "22px", paddingTop: "4px" }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "17px", color: "#fff", letterSpacing: "-0.02em", margin: "0 0 4px" }}>{project.title}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                  {project.category} · {project.subtitle}
                </p>
              </div>
              <span style={{ color: ORANGE, fontSize: "16px", transform: expandedId === project.id ? "rotate(45deg)" : "none", transition: "transform 0.25s ease", paddingTop: "4px", flexShrink: 0 }}>+</span>
            </button>

            {expandedId === project.id && (
              <div style={{ paddingBottom: "24px", paddingLeft: "38px" }}>
                {/* Project image */}
                {project.images && project.images[0] && (
                  <div style={{ width: "100%", height: "180px", borderRadius: "8px", overflow: "hidden", marginBottom: "16px", background: "rgba(255,255,255,0.05)" }}>
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                    />
                  </div>
                )}
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.75, color: "rgba(255,255,255,0.55)", marginBottom: "12px" }}>
                  {project.description.split("\n\n")[0]}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginBottom: "16px", letterSpacing: "0.04em" }}>
                  {project.technologies}
                </p>
                <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 22px", background: ORANGE, borderRadius: "4px", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, color: "#fff", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  View Live →
                </a>
              </div>
            )}
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CONTACT SUB-PAGE
// ─────────────────────────────────────────────────────────────────
function ContactSubPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode]   = useState<"email" | "whatsapp">("email");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg]     = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".cp-label",   { y: 25, opacity: 0, duration: 0.5, delay: 0.4 });
      gsap.from(".cp-heading", { y: 70, opacity: 0, duration: 0.9, ease: "power4.out", delay: 0.6 });
      gsap.from(".cp-field",   { y: 35, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.85 });
      gsap.from(".cp-btn",     { y: 20, opacity: 0, duration: 0.5, delay: 1.2 });
    }, ref);
    return () => ctx.revert();
  }, []);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px", outline: "none",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px", color: "#fff",
    marginBottom: "14px", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "email") {
      window.location.href = `mailto:${config.contact.email}?subject=Project Inquiry from ${name}&body=${msg}%0A%0AFrom: ${email}`;
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Hi Rajat! I'm ${name}.\n${msg}\nEmail: ${email}`)}`);
    }
    setStatus("sent");
    setName(""); setEmail(""); setMsg("");
  };

  /* Gradient-blinds CSS-only effect */
  const blindsStyle: React.CSSProperties = {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", opacity: 0.35,
  };

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 1, padding: "80px 24px 60px", minHeight: "100svh" }}>
      <SubPageBackground src="/mobile-assets/contact.webp" />

      {/* Diagonal stripe overlay (gradient-blinds effect) */}
      <div style={blindsStyle}>
        {Array(8).fill(0).map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${-30 + i * 20}%`, width: "12%",
            background: `linear-gradient(180deg, transparent, rgba(255,107,26,${0.06 + i * 0.01}), transparent)`,
            transform: "skewX(-20deg)", transformOrigin: "top",
          }} />
        ))}
      </div>

      <p className="cp-label" style={{ position: "relative", zIndex: 1, fontFamily: "'Inter', sans-serif", fontSize: "10px", color: ORANGE, letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 700, marginBottom: "24px" }}>
        Get In Touch
      </p>

      <h1 className="cp-heading" style={{ position: "relative", zIndex: 1, fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 10vw, 3rem)", letterSpacing: "-0.04em", lineHeight: 0.92, color: "#fff", marginBottom: "32px" }}>
        <span style={{ display: "block" }}>Let's build</span>
        <span style={{ display: "block" }}>something</span>
        <span style={{ display: "block", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, color: ORANGE }}>cool.</span>
      </h1>

      <div className="cp-field" style={{ position: "relative", zIndex: 1, display: "flex", gap: "8px", marginBottom: "24px" }}>
        {(["email", "whatsapp"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: "10px 0",
            background: mode === m ? (m === "whatsapp" ? "#25D366" : ORANGE) : "rgba(255,255,255,0.05)",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700,
            color: mode === m ? "#000" : "rgba(255,255,255,0.5)",
            textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 0.2s",
          }}>
            {m === "email" ? "Email" : "WhatsApp"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1 }}>
        <div className="cp-field" style={{ marginBottom: 0 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Name</span>
          <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required className="m-input" style={inputStyle} />
        </div>
        <div className="cp-field" style={{ marginBottom: 0 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
            {mode === "email" ? "Email" : "Phone (WhatsApp)"}
          </span>
          <input
            type={mode === "email" ? "email" : "tel"}
            placeholder={mode === "email" ? "email@example.com" : "+91 98765 43210"}
            value={email} onChange={e => setEmail(e.target.value)} required
            className="m-input" style={inputStyle}
          />
        </div>
        <div className="cp-field" style={{ marginBottom: 0 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Reason</span>
          <textarea placeholder="Tell me what you're working on…" value={msg} onChange={e => setMsg(e.target.value)} required rows={4} className="m-input" style={{ ...inputStyle, resize: "none" }} />
        </div>

        {status === "sent" ? (
          <p className="cp-btn" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: ORANGE, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "8px" }}>
            Message sent — I'll be in touch! ✓
          </p>
        ) : (
          <button type="submit" className="cp-btn" style={{
            width: "100%", padding: "16px",
            background: mode === "whatsapp" ? "#25D366" : ORANGE,
            border: "none", borderRadius: "40px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px", fontWeight: 700,
            color: "#000", letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: "pointer",
            marginTop: "8px",
          }}>
            {mode === "email" ? "Send Message" : "Open WhatsApp →"}
          </button>
        )}
      </form>

      <div style={{ position: "relative", zIndex: 1, marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>Or reach out directly</p>
        <a href={`mailto:${config.contact.email}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", textDecoration: "none", display: "block", marginBottom: "6px" }}>{config.contact.email}</a>
        <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
          {[
            { label: "GitHub",    href: config.contact.github    },
            { label: "LinkedIn",  href: config.contact.linkedin  },
            { label: "Instagram", href: config.contact.instagram },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.35)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN MOBILE PAGE
// ═══════════════════════════════════════════════════════════════════
export default function MobilePage() {
  const [view, setView] = useState<View>("home");

  // Scroll to top on view change
  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  useEffect(() => {
    document.body.style.overflow  = "auto";
    document.body.style.background = BG;
    document.documentElement.style.background = BG;

    const style = document.createElement("style");
    style.id = "mobile-page-styles";
    style.textContent = `
      .m-input::placeholder { color: rgba(255,255,255,0.22); }
      .m-input:focus { border-color: rgba(255,107,26,0.5) !important; outline: none; }
      .m-nav-link:hover { color: #ff6b1a !important; }
      .m-skill-badge:hover { border-color: rgba(255,107,26,0.4) !important; }
    `;
    document.head.appendChild(style);

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
      position: "relative", background: BG, color: "#fff",
      minHeight: "100svh", fontFamily: "'Inter', sans-serif", overflowX: "hidden",
    }}>
      {/* Fixed navbar — always visible */}
      <MobileNavbar view={view} setView={setView} />

      {/* ── HOME VIEW ────────────────────────────────────────────── */}
      {view === "home" && (
        <>
          <ScrollBackground />
          <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
            <MobileHero    setView={setView} />
            <MobileAbout   setView={setView} />
            <MobileWork    setView={setView} />
            <MobileServices />
            <MobileWhyMe />
            <MobileProcess />
            <MobileTestimonials />
            <MobileFAQ />
            <MobileCTA     setView={setView} />
            <MobileContact />
            <MobileFooter  setView={setView} />
          </div>
        </>
      )}

      {/* ── ABOUT SUB-PAGE ─────────────────────────────────────── */}
      {view === "about" && (
        <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
          <AboutSubPage setView={setView} />
        </div>
      )}

      {/* ── PROJECTS SUB-PAGE ──────────────────────────────────── */}
      {view === "projects" && (
        <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
          <ProjectsSubPage />
        </div>
      )}

      {/* ── CONTACT SUB-PAGE ───────────────────────────────────── */}
      {view === "contact" && (
        <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
          <ContactSubPage />
        </div>
      )}
    </div>
  );
}
