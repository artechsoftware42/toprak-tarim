"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import BrandReveal from "./BrandReveal";

const LoadingContext = createContext({ opening: true, done: true });
export const useInitialLoading = () => useContext(LoadingContext);

/** Mounted once in the persistent root layout, never reset by client navigation.
 * Percentage = ready resources / observed resources, not bytes downloaded.
 * Failed/timed-out resources release the screen without fabricating 100%.
 */
export default function InitialLoading({ children }: { children: ReactNode }) {
  const [opening, setOpening] = useState(false);
  const [done, setDone] = useState(false);
  const [resources, setResources] = useState({ progress: 0, settled: false });
  const onExitStart = useCallback(() => setOpening(true), []);
  const onComplete = useCallback(() => setDone(true), []);

  useEffect(() => {
    let active = true;
    const cleanups: (() => void)[] = [];
    const frame = requestAnimationFrame(() => {
      const images = Array.from(document.images).filter(image => {
        const rect = image.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.top < innerHeight && rect.bottom > 0 && image.loading !== "lazy";
      });
      const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video[data-loading-resource]"));
      const total = images.length + videos.length + 1; // document fonts
      let ready = 0, settled = 0;
      const report = (success: boolean) => {
        if (!active) return;
        if (success) ready++;
        settled++;
        setResources({ progress: Math.floor(ready / total * 100), settled: settled === total });
      };
      function observe(element: HTMLImageElement | HTMLVideoElement) {
        let finished = false;
        const event = element instanceof HTMLVideoElement ? "loadeddata" : "load";
        const finish = (success: boolean) => {
          if (finished) return;
          finished = true;
          cleanup();
          report(success);
        };
        const ok = () => finish(true), fail = () => finish(false);
        const timer = window.setTimeout(fail, 4500);
        const cleanup = () => {
          clearTimeout(timer);
          element.removeEventListener(event, ok);
          element.removeEventListener("error", fail);
        };
        cleanups.push(cleanup);
        element.addEventListener(event, ok);
        element.addEventListener("error", fail);
        if (element instanceof HTMLImageElement && element.complete) finish(element.naturalWidth > 0);
        if (element instanceof HTMLVideoElement && element.readyState >= 2) finish(true);
        if (element instanceof HTMLVideoElement && element.error) finish(false);
      }
      images.forEach(observe);
      videos.forEach(observe);
      let fontsFinished = false;
      const finishFonts = (success: boolean) => {
        if (fontsFinished) return;
        fontsFinished = true;
        report(success);
      };
      const fontTimer = window.setTimeout(() => finishFonts(false), 4500);
      cleanups.push(() => clearTimeout(fontTimer));
      document.fonts.ready.then(() => finishFonts(true), () => finishFonts(false));
    });
    return () => { active = false; cancelAnimationFrame(frame); cleanups.forEach(cleanup => cleanup()); };
  }, []);

  return <LoadingContext.Provider value={{ opening, done }}>
    {children}
    {!done && <BrandReveal mediaReady={resources.settled} loadingProgress={resources.progress} onExitStart={onExitStart} onComplete={onComplete} />}
  </LoadingContext.Provider>;
}
