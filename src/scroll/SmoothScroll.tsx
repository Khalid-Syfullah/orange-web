"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { gsap, ScrollTrigger } from "./gsap";
import { setLenis } from "./navigation";

/**
 * Lenis smooths native scrolling (no hijacking: the page keeps its real scroll height,
 * keyboard, scrollbar and find-in-page all still work). GSAP's ticker drives it so the
 * smoothed position and ScrollTrigger update on the same frame.
 * With reduced motion, Lenis is never created and the browser scrolls natively.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, touchMultiplier: 1.2, smoothWheel: true });
    const raf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    return () => {
      setLenis(null);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return children;
}
