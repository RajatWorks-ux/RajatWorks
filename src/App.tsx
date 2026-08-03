import { lazy, Suspense } from "react";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";

// Desktop only — 3D character
const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer  = lazy(() => import("./components/MainContainer"));

// ─────────────────────────────────────────────────────────────────────────────
// TRUE DEVICE DETECTION — based on User Agent + pointer capability
// WHY NOT window.innerWidth:
//   A laptop can be resized to 600px wide — width alone doesn't mean "mobile".
//   A real phone has a mobile User Agent AND no fine pointer (mouse/trackpad).
//   This check is computed ONCE at page load and never changes on resize.
//   Result: minimising a laptop window will NEVER switch to phone layout.
// ─────────────────────────────────────────────────────────────────────────────
const isTruePhone: boolean = (() => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  // Match only real phone/tablet UA strings
  const mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  // pointer: fine  = mouse/trackpad present → definitely desktop/laptop
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  // Both conditions must be true: mobile UA AND no mouse
  return mobileUA && !hasFinePointer;
})();

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            {/*
              ✅ Desktop/Laptop: 3D CharacterModel renders (arrow-key face tracking)
              ✅ Real Phone/Tablet: CharacterModel NOT rendered (can't handle 3D)
              This is checked ONCE at page load — resize won't ever change it.
              Laptop at 600px width? Still shows 3D model. Correct behaviour.
            */}
            {!isTruePhone && (
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

// Export for use in other components
export { isTruePhone };

