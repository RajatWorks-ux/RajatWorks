import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []); // ✅ dependency array empty — resize handler baar baar re-subscribe nahi hoga

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />

      {/* 
        ✅ FIX: Desktop pe sirf character render hoga (fixed position)
        Mobile pe bilkul nahi — video storytelling handle karegi 
      */}
      {isDesktopView && children}

      <div className="container-main">
        {/* 
          ✅ FIX: Landing ko koi children nahi dene — 
          Mobile pe video apna kaam kar rahi hai
          Desktop pe character upar wale {isDesktopView && children} se aa raha hai
        */}
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <Suspense fallback={<div>Loading....</div>}>
          <TechStack />
        </Suspense>
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;

