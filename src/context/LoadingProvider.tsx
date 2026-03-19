import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";
import Loading from "../components/Loading";
import { initialFX } from "../components/utils/initialFX";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  // Mobile pe seedha false — loading screen nahi dikhega
  const [isLoading, setIsLoading] = useState(!isMobile);
  const [loading, setLoading]     = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    // Mobile pe: body dark karo + lenis start karo seedha
    document.body.style.backgroundColor = "#0b080c";
    document.body.style.overflowY = "auto";
    initialFX();
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
