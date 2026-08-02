import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

// ✅ STATIC constant — same as version 6. Computed ONCE at page load.
// No useState, no resize listener. Prevents laptop-resize-to-phone bug.
const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

const Navbar = () => {
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
    if (isMobile) {
      const bar = document.getElementById("scroll-progress-bar");
      const updateBar = () => {
        if (!bar) return;
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : "0%";
      };
      window.addEventListener("scroll", updateBar, { passive: true });
      return () => {
        window.removeEventListener("scroll", updateBar);
        lenis?.destroy();
      };
    }

    return () => {
      lenis?.destroy();
    };
  }, []);

  useEffect(() => {
    // ── Desktop smooth scroll links ──
    const links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (!isMobile) {
          e.preventDefault();
          const el = e.currentTarget as HTMLAnchorElement;
          const section = el.getAttribute("data-href");
          if (section && lenis) {
            const target = document.querySelector(section) as HTMLElement;
            if (target) {
              lenis.scrollTo(target, { offset: 0, duration: 1.5 });
            }
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    const onResize = () => { lenis?.resize(); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <div className="header">
        {/* ══ RajatWorks Logo ══ */}
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

        <ul>
          <li><a data-href="#about"   href="#about"  ><HoverLinks text="ABOUT"   /></a></li>
          <li><a data-href="#work"    href="#work"   ><HoverLinks text="WORK"    /></a></li>
          <li><a data-href="#contact" href="#contact"><HoverLinks text="CONTACT" /></a></li>
        </ul>
      </div>

      {/* ── Scroll progress bar (visible on mobile via CSS) ── */}
      <div id="scroll-progress-bar" />

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;

