import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ─── Fix: --vh custom property ───────────────────────────────────────────────
// Sets --vh to the real inner height in px so 100 * var(--vh) = true viewport
// height on all browsers including mobile Chrome (which counts the address bar).
// Without this, landing-section uses 100vh which is wrong on mobile/resize.
function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh * 100}px`);
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
