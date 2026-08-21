import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ─── Fix A: Mark <html> as desktop so CSS never collapses landing-section ────
// The CSS media query (max-width: 1024px) was collapsing .landing-section to
// height:0 — correct for real phones, but wrong for a laptop resized to <1024px.
// By setting data-device="desktop" on <html> from JS (which correctly detects
// real laptops via UA + pointer), CSS can use [data-device="desktop"] to
// override the collapse rule and keep the landing section visible.
//
// BUG FIX: Lowered isVeryWideScreen from 1400 → 1024 (mirrors App.tsx change).
// This ensures monitors at 1280px/1366px get data-device="desktop", which
// prevents the CSS from showing the mobile hero (story-fixed-wrap) on them.
const ua = navigator.userAgent;
const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
// FIX: was > 1400, now > 1024
const isWideScreen = window.innerWidth > 1024;
const isRealDesktop = !mobileUA && (isWideScreen || hasFinePointer);
document.documentElement.setAttribute("data-device", isRealDesktop ? "desktop" : "mobile");

// ─── Fix B: --vh custom property ─────────────────────────────────────────────
// The @supports (height: 100svh) block in index.css was overriding our --vh
// with 100svh. We fix this by setting --vh as an inline style on :root via JS,
// which has higher specificity than any @supports block and updates on resize.
function setVH() {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
setVH();
window.addEventListener("resize", setVH, { passive: true });
window.addEventListener("orientationchange", () => {
  setTimeout(setVH, 150);
}, { passive: true });
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

