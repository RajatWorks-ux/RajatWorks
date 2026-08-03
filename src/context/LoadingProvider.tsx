import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

// ─── FIX: was `window.innerWidth <= 1024` — wrong on a laptop resized below
//     1024px.  That made LoadingProvider skip the loading screen entirely on
//     what it thought was a mobile device, so the desktop 3D character never
//     drove isLoading to false and all intro animations never fired.
//     Now uses the same 3-layer UA + pointer check as App.tsx / main.tsx.
const _ua = typeof window !== "undefined" ? navigator.userAgent : "";
const _mobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(_ua);
const _hasFinePointer = typeof window !== "undefined"
  ? window.matchMedia("(pointer: fine)").matches
  : false;
const _isVeryWide = typeof window !== "undefined" ? window.innerWidth > 1400 : false;
const isRealDesktop = !_mobileUA && (_isVeryWide || _hasFinePointer);
const isMobile = !isRealDesktop;

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(!isMobile);
  const [loading, setLoading]     = useState(0);

  useEffect(() => {
    if (!isMobile) return;

    // Body dark + scroll enable — seedha, koi lenis dependency nahi
    document.body.style.backgroundColor = "#0b080c";
    document.body.style.overflow        = "auto";
    document.body.style.overflowX       = "hidden";

    // Thoda wait karo taaki Navbar mount ho aur lenis ready ho
    const timer = setTimeout(() => {
      // Header visible karo
      const header = document.querySelector(".header") as HTMLElement;
      if (header) header.style.opacity = "1";

      // Lenis import karke start karo
      import("../components/Navbar").then(({ lenis }) => {
        if (lenis) lenis.start();
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const value = { isLoading, setIsLoading, setLoading };

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within a LoadingProvider");
  return context;
};
