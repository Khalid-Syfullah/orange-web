"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/animations";
import { setLenis } from "@/lib/scroll";

/** Mounts Lenis and keeps GSAP ScrollTrigger in lockstep with it. */
export default function SmoothScroll() {
  useEffect(() => {
    registerGsap();

    // Late-arriving fonts and lazy chunks shift layout; re-measure so triggers stay accurate.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("load", refresh);
    }

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
