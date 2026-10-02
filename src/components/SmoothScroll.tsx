"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import Lenis from "lenis";

type LenisContextType = {
  getLenis: () => Lenis | null;
};

const LenisContext = createContext<LenisContextType>({
  getLenis: () => null,
});

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,

      // Normal mouse scroll hissi.
      lerp: 0.085,

      smoothWheel: true,

      wheelMultiplier: 0.9,

      touchMultiplier: 1,

      syncTouch: false,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const getLenis = () => {
    return lenisRef.current;
  };

  return (
    <LenisContext.Provider
      value={{
        getLenis,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
}
