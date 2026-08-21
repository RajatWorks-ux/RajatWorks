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
// BUG FIX: isVeryWideScreen threshold lowered from 1400px → 1024px.
// Many real monitors and laptops run at 1366px or 1280px. With the old 1400px
// threshold, these machines would FAIL the wide-screen check AND potentially
// fail the pointer check on certain setups (external monitors, KVM switches),
// causing the site to treat a real desktop/laptop as "mobile" and show the
// phone frame-sequence instead of the 3D character.
//
// 1024px is safe: the largest phone viewport is ~932px (iPhone 15 Pro Max
// landscape), and tablets in landscape are ~1024px but caught by Layer 2 UA.
// ─────────────────────────────────────────────────────────────────────────────
const isMobileOrTablet: boolean = (() => {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;

  // Any Android/iOS/mobile UA = phone or tablet, never a real laptop
  const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // FIX: Lowered from 1400 → 1024 so that common laptop/monitor widths
  // (1280px, 1366px) are treated as desktop, not mobile.
  const isWideScreen = window.innerWidth > 1024;

  // If it has a real mouse pointer — only desktop/laptop has this reliably
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  // It's a laptop/desktop if:
  //   - No mobile UA  AND  (wide screen OR has mouse)
  const isDesktop = !mobileUA && (isWideScreen || hasFinePointer);

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
