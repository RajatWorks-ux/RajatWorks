import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import "./components/styles/DesktopOnly.css";
import { LoadingProvider } from "./context/LoadingProvider";

// Desktop only — 3D character
const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer  = lazy(() => import("./components/MainContainer"));

// Phone + Tablet — redirect to the dedicated cinematic portfolio. Narrow laptop windows remain on this desktop experience.
const MOBILE_PORTFOLIO_URL = "https://rajatworks01.vercel.app/";

// ─────────────────────────────────────────────────────────────────────────────
// DEVICE DETECTION — hardware/input based, NOT viewport-width based:
// Phones/tablets use the cinematic portfolio even when the tablet is large.
// Laptops keep the 3D desktop portfolio even when their browser is narrow/minimized.
// ─────────────────────────────────────────────────────────────────────────────

/** True on ALL phones and tablets — shows the orange cinematic experience */
const isMobileOrTablet: boolean = (() => {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;

  // Phones and Android/iOS tablets should always use the separate mobile portfolio.
  const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // iPadOS can present a desktop-style Macintosh UA; multiple touch points catches it.
  const touchTablet = navigator.maxTouchPoints > 1 &&
    (window.matchMedia("(pointer: coarse)").matches || /Macintosh/i.test(ua));

  // Do not route by viewport width: a narrow/minimized laptop must keep the
  // desktop design and rely on its responsive CSS instead.
  return mobileUA || touchTablet;
})();

const App = () => {
  // Direct visits to the desktop URL on a phone/tablet must reach the dedicated
  // mobile portfolio. Narrow laptop windows intentionally stay on desktop.
  useEffect(() => {
    if (isMobileOrTablet) {
      window.location.replace(MOBILE_PORTFOLIO_URL);
    }
  }, []);

  if (isMobileOrTablet) {
    return <div aria-live="polite" role="status">Opening the RajatWorks phone and tablet portfolio…</div>;
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
