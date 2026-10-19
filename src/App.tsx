import { lazy, Suspense } from "react";
import "./App.css";
import "./components/styles/MobileExperience.css";
import { LoadingProvider } from "./context/LoadingProvider";

// Desktop only — 3D character
const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer  = lazy(() => import("./components/MainContainer"));

// Phone + Tablet — cinematic orange experience (friend's design + Rajat's content)
const MobilePage = lazy(() => import("./components/MobilePage"));

// ─────────────────────────────────────────────────────────────────────────────
// DEVICE DETECTION — 2 tiers:
//
//   isMobileOrTablet  → MobilePage (orange cinematic — phones + tablets)
//   desktop/laptop    → MainContainer + 3D CharacterModel (purple, unchanged)
//
// Layer 1 — Screen size: > 1024px is almost certainly a real desktop/laptop
// Layer 2 — User Agent: Android/iPhone/iPad in UA = mobile/tablet hardware
// Layer 3 — Hover capability: real laptops have mouse pointer, phones/tablets don't
// ─────────────────────────────────────────────────────────────────────────────

/** True on ALL phones and tablets — shows the orange cinematic experience */
const isMobileOrTablet: boolean = (() => {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;

  // Any Android/iOS/mobile UA = phone or tablet, never a real laptop
  const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // 1024px is safe: largest phone is ~932px (iPhone 15 Pro Max landscape),
  // tablets in landscape are ~1024px but caught by Layer 2 UA above
  const isWideScreen = window.innerWidth > 1024;

  // Real mouse pointer = only desktop/laptop has this reliably
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  // It's a laptop/desktop if: No mobile UA AND (wide screen OR has mouse)
  const isDesktop = !mobileUA && (isWideScreen || hasFinePointer);

  return !isDesktop;
})();

const App = () => {
  // ── Phone + Tablet → cinematic orange experience ──────────────────
  if (isMobileOrTablet) {
    return (
      <Suspense fallback={null}>
        <MobilePage />
      </Suspense>
    );
  }

  // ── Desktop / Laptop → existing purple 3D experience ─────────────
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;

export { isMobileOrTablet };
