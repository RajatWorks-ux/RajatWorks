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

// ✅ FIX: Reactive isMobile (was frozen constant)
export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth <= 1024
  );
  const [isLoading, setIsLoading] = useState(!isMobile);
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    document.body.style.backgroundColor = "#0b080c";
    document.body.style.overflow        = "auto";
    document.body.style.overflowX       = "hidden";

    const timer = setTimeout(() => {
      const header = document.querySelector(".header") as HTMLElement;
      if (header) header.style.opacity = "1";

      import("../components/Navbar").then(({ lenis }) => {
        if (lenis) lenis.start();
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [isMobile]);

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

