import { lazy, PropsWithChildren, Suspense, useEffect, useRef } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import { initInView } from "../utils/useInView";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── TechStack is lazy-loaded so it doesn't block the initial paint.
//    TechStackWithRefresh fires ScrollTrigger.refresh() after TechStack
//    fully mounts AND after the browser has painted it, so GSAP's Work
//    pin-spacer is always calculated against the real page height.
const TechStackLazy = lazy(() => import("./TechStack"));

const TechStackWithRefresh = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    // Strategy: fire ScrollTrigger.refresh() in 3 waves so we catch
    // every possible paint timing (fast machine, slow machine, cached assets).
    //
    // Wave 1 — next frame: catches fast machines where TechStack paints immediately.
    // Wave 2 — 300 ms: catches normal machines where 3D canvas takes a moment.
    // Wave 3 — 800 ms: catches slow machines / cold cache where physics init is slow.
    //
    // Each wave is safe to call multiple times — GSAP deduplicates refreshes.

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    const t1 = setTimeout(() => ScrollTrigger.refresh(), 300);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return <TechStackLazy />;
};

// ── DEVICE DETECTION: same 3-layer logic as App.tsx ──
// Computed ONCE at module load — never changes on resize
const isDesktopView: boolean = (() => {
  if (typeof window === "undefined") return true;
  const ua = navigator.userAgent;
  const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isVeryWideScreen = window.innerWidth > 1400;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  return !mobileUA && (isVeryWideScreen || hasFinePointer);
})();

const MainContainer = ({ children }: PropsWithChildren) => {

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      initInView();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // ── Tap ripple effect — mobile micro-interaction ──
  useEffect(() => {
    if (isDesktopView) return;

    const handleTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const tappable = target.closest("a, button") as HTMLElement | null;
      if (!tappable) return;

      const style = window.getComputedStyle(tappable);
      if (style.position === "static") {
        tappable.style.position = "relative";
      }
      tappable.style.overflow = "hidden";

      const rect = tappable.getBoundingClientRect();
      const touch = e.touches[0];
      const size = Math.max(rect.width, rect.height) * 2;
      const x = touch.clientX - rect.left - size / 2;
      const y = touch.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "tap-ripple";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      tappable.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    };

    document.addEventListener("touchstart", handleTouch, { passive: true });
    return () => document.removeEventListener("touchstart", handleTouch);
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        {/*
          ── FIX: Suspense fallback min-height is set to 1000px (was 700px).
             This ensures the page has enough height WHILE TechStack is loading
             so GSAP's Work pin-spacer is calculated correctly.
             If the fallback collapses to 0 before TechStack mounts, GSAP
             will compute a wrong (too-small) spacer, causing TechStack to
             visually overlap the still-pinned Work section.

             1000px is safely larger than the actual TechStack height (~750px
             on desktop including title + canvas + padding), so the spacer
             never gets miscalculated due to a collapsing fallback.
        ── */}
        <Suspense fallback={<div style={{ minHeight: "1000px" }} />}>
          <TechStackWithRefresh />
        </Suspense>
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
                                            
