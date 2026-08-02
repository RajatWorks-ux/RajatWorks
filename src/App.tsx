import { lazy, Suspense } from "react";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";

// Desktop only — 3D character
const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer  = lazy(() => import("./components/MainContainer"));

// ✅ STATIC constant — computed ONCE at page load, never changes on resize.
// Any screen width > 1024px at load time = desktop. Period.
// This prevents the bug where minimizing a laptop window switches to phone layout.
const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            {/* 
              ✅ Desktop: 3D CharacterModel renders (arrow-key face tracking)
              ✅ Mobile/Tablet: CharacterModel NOT rendered (can't handle 3D)
              This is checked ONCE at page load — resize won't change it.
            */}
            {!isMobile && (
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
