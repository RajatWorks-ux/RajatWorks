import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App, { isMobileOrTablet } from "./App.tsx";
import "./index.css";

// Use the same hardware/input-based device decision as App.tsx. Do not use
// viewport width here: resizing a laptop window must never activate phone art direction.
document.documentElement.setAttribute("data-device", isMobileOrTablet ? "mobile" : "desktop");

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

