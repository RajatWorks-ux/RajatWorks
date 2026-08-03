import { lazy, Suspense } from "react";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";

// Desktop only — 3D character
const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer  = lazy(() => import("./components/MainContainer"));

// ─────────────────────────────────────────────────────────────────────────────
// DEVICE DETECTION — 3-layer check, handles tablets correctly
//
// The Problem We're Solving:
//   1. Laptop minimised to 400px → should show DESKTOP (3D model)
//   2. Real phone (Brave, Chrome, etc.) → should show MOBILE (canvas frames)
//   3. Android tablet → should show MOBILE (no 3D model, too heavy)
//
// Layer 1 — Screen size: anything above 1400px is almost certainly a real desktop
// Layer 2 — User Agent: Android/iPhone/iPad in UA = mobile/tablet hardware
// Layer 3 — Hover capability: real laptops have :hover, phones/tablets don't
//
// Laptop shrunk to 600px: passes Layer 1 (>1400? no, but...) → UA has no
//   "Android/iPhone" → hasFinePointer = TRUE → canHover = TRUE → NOT mobile ✅
// Android tablet: UA has "Android" → mobileUA = TRUE
//   + screen probably under 1400px → isMobile = TRUE ✅
// Real phone: UA has "Android"/"iPhone" → mobileUA = TRUE → isMobile = TRUE ✅
// ─────────────────────────────────────────────────────────────────────────────
const isMobileOrTablet: boolean = (() => {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;

  // Any Android/iOS/mobile UA = phone or tablet, never a real laptop
  const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // Screens wider than 1400px at load = almost certainly a real desktop/laptop
  // Even a big tablet (iPad Pro 12.9") is only 1366px wide
  const isVeryWideScreen = window.innerWidth > 1400;

  // If it has a real mouse pointer — only desktop/laptop has this reliably
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  // It's a laptop/desktop if:
  //   - No mobile UA  AND  (very wide screen OR has mouse)
  const isDesktop = !mobileUA && (isVeryWideScreen || hasFinePointer);

  return !isDesktop;
})();

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            {/*
              Desktop/Laptop: 3D CharacterModel renders
              Phone/Tablet: CharacterModel NOT rendered (too heavy)
              Laptop at 600px width? Still shows 3D model. Correct.
              Android tablet? No 3D. Correct.
            */}
            {!isMobileOrTablet && (
              <Suspense>
                <CharacterModel />
              </Suspense>
            )}
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;

export { isMobileOrTablet };

