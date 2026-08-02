import { useState, useEffect } from "react";
import { LoadingProvider } from "./context/LoadingProvider"; // ✅ FIX: Named import (curly braces)
import MainContainer from "./components/MainContainer";
import CharacterModel from "./components/Character";

function App() {
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
      {!isMobile && <CharacterModel />}
      <MainContainer />
    </LoadingProvider>
  );
}

export default App;
