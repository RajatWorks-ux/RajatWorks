import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    if (isMobile) {
      lenis.start();
    } else {
      lenis.stop();
    }

    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ── Scroll progress bar (mobile only) ──
    if (window.innerWidth <= 1024) {
      const bar = document.getElementById("scroll-progress-bar");
      const updateBar = () => {
        if (!bar) return;
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : "0%";
      };
      window.addEventListener("scroll", updateBar, { passive: true });
    }

    // ── Desktop smooth scroll links ──
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          if (section && lenis) {
            const target = document.querySelector(section) as HTMLElement;
            if (target) {
              lenis.scrollTo(target, { offset: 0, duration: 1.5 });
            }
          }
        }
      });
    });

    window.addEventListener("resize", () => { lenis?.resize(); });
    return () => { lenis?.destroy(); };
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close drawer and smooth-scroll to section
  const handleDrawerNav = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const target = document.querySelector(href) as HTMLElement;
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  };

  return (
    <>
      <div className="header">

        {/* ══ Logo ══ */}
        <a href="/#" className="navbar-title rw-logo" data-cursor="disable">
          <span className="rw-logo-thin">Rajat</span>
          <span className="rw-logo-bold">Works</span>
          <span className="rw-logo-dot" />
        </a>

        <a
          href="mailto:rajatworks1@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          rajatworks1@gmail.com
        </a>

        {/* ── Desktop nav (completely unchanged) ── */}
        <ul>
          <li><a data-href="#about"   href="#about"  ><HoverLinks text="ABOUT"   /></a></li>
          <li><a data-href="#work"    href="#work"   ><HoverLinks text="WORK"    /></a></li>
          <li><a data-href="#contact" href="#contact"><HoverLinks text="CONTACT" /></a></li>
        </ul>

        {/* ── Hamburger — CSS shows this only on ≤768px ── */}
        <button
          className={`hamburger-btn${menuOpen ? " is-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* ── Mobile slide-in drawer ── */}
      <nav className={`mobile-drawer${menuOpen ? " is-open" : ""}`}>
        <div className="md-brand">
          <span className="rw-logo-thin">Rajat</span>
          <span className="rw-logo-bold">Works</span>
        </div>
        <ul>
          <li>
            <a href="#about" onClick={(e) => { e.preventDefault(); handleDrawerNav("#about"); }}>
              <span className="md-num">01</span>About
            </a>
          </li>
          <li>
            <a href="#work" onClick={(e) => { e.preventDefault(); handleDrawerNav("#work"); }}>
              <span className="md-num">02</span>Work
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleDrawerNav("#contact"); }}>
              <span className="md-num">03</span>Contact
            </a>
          </li>
        </ul>
        <div className="md-footer">
          <a href="mailto:rajatworks1@gmail.com" className="md-email">
            rajatworks1@gmail.com
          </a>
        </div>
        <div className="md-glow" />
      </nav>

      {/* ── Overlay behind drawer ── */}
      <div
        className={`nav-overlay${menuOpen ? " is-visible" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Scroll progress bar (visible mobile only via CSS) ── */}
      <div id="scroll-progress-bar" />

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;

