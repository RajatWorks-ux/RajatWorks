import { lazy, Suspense } from "react";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";

// Desktop only — 3D character
const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer  = lazy(() => import("./components/MainContainer"));

const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            {/* 
              ✅ Mobile pe CharacterModel bilkul render nahi hoga
              Desktop pe same as before
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
