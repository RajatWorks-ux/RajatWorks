import { useState, useEffect } from "react";
import LoadingProvider from "./context/LoadingProvider"; // ← tera original path
import MainContainer from "./components/MainContainer"; // ← tera original path
import CharacterModel from "./components/Character";    // ← tera original path

function App() {
  // ✅ ANDAR hai — function ke curly brace ke baad
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LoadingProvider>
      <div className="main-body">
        {!isMobile && <CharacterModel />}
        <MainContainer />
      </div>
    </LoadingProvider>
  );
}

export default App;
