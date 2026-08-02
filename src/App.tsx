import { useEffect, useState } from "react";
import LoadingProvider from "./context/LoadingProvider";
import MainContainer from "./components/MainContainer";
import CharacterModel from "./components/Character";

// ✅ FIX #1: Reactive isMobile detection (was frozen constant)
function App() {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LoadingProvider>
      <div className="main-body">
        {/* Desktop 3D character model — only show on desktop */}
        {!isMobile && <CharacterModel />}
        
        {/* Main content — responsive to screen size */}
        <MainContainer />
      </div>
    </LoadingProvider>
  );
}

export default App;
