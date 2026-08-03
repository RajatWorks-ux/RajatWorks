import { lazy, PropsWithChildren, Suspense, useEffect } from "react";
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

// ── FIX: TechStack wrapped in a named component so we can fire
//    ScrollTrigger.refresh() the moment it finishes mounting.
//    Without this, GSAP's Work pin-spacer was calculated when TechStack
//    hadn't rendered yet → spacer was correct but total page height was
//    wrong → TechStack overlapped the Work section on laptop.
const TechStackLazy = lazy(() => import("./TechStack"));

const TechStackWithRefresh = () => {
  useEffect(() => {
    // Give browser one frame to paint TechStack, then tell GSAP to
    // re-measure all scroll positions.  This fixes the Work pin-spacer
    // height mismatch caused by lazy-loading TechStack after GSAP ran.
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(raf);
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
      // Only update split text on resize — device type never changes
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
        {/* ── FIX: TechStackWithRefresh fires ScrollTrigger.refresh() after
               TechStack mounts so GSAP recalculates Work's pin-spacer height.
               The Suspense fallback has a fixed min-height so the page height
               doesn't collapse to 0 while loading — that would cause a second
               GSAP miscalculation if Work's trigger fires before fallback
               clears. ── */}
        <Suspense fallback={<div style={{ minHeight: "700px" }} />}>
          <TechStackWithRefresh />
        </Suspense>
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;

