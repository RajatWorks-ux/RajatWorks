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

const TechStackLazy = lazy(() => import("./TechStack"));

// ── TechStackWithRefresh ──────────────────────────────────────
// Work section ab GSAP pin use nahi karta (Bento Grid hai),
// isliye ScrollTrigger.refresh() sirf TechStack ke liye kaam
// aata hai — baaki koi GSAP scroll trigger nahi hai work mein.
// Phir bhi refresh rakhte hain taaki career/about triggers sahi rahein.
const TechStackWithRefresh = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
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

// ── Device detection — 3-layer, same as App.tsx ──────────────
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
    const resizeHandler = () => setSplitText();
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => initInView(), 300);
    return () => clearTimeout(timer);
  }, []);

  // ── Tap ripple — mobile micro-interaction ─────────────────
  useEffect(() => {
    if (isDesktopView) return;

    const handleTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const tappable = target.closest("a, button") as HTMLElement | null;
      if (!tappable) return;

      const style = window.getComputedStyle(tappable);
      if (style.position === "static") tappable.style.position = "relative";
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
          Bento Grid Work section mein koi GSAP pin nahi hai,
          isliye TechStack overlap ka bug permanently khatam ho gaya.
          Suspense fallback 1000px — safe margin for all screen sizes.
        */}
        <Suspense fallback={<div style={{ minHeight: "1000px" }} />}>
          <TechStackWithRefresh />
        </Suspense>
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;

                                            
