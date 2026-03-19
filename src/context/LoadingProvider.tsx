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

// Mobile pe character load nahi hota — loading skip karo
const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  // Mobile pe isLoading seedha false — no loading screen
  const [isLoading, setIsLoading] = useState(!isMobile);
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    if (isMobile) {
      // Mobile pe koi loading nahi — seedha site dikhao
      setIsLoading(false);
    }
  }, []);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

