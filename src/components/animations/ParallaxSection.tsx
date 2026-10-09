"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, NO_MOTION_QUERY, registerGsap } from "@/lib/animations";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  /** Travel as a fraction of the element's height. Negative moves against the scroll. */
  speed?: number;
}

/** Subtle scrubbed parallax, driven by the parent's journey through the viewport. */
export default function ParallaxSection({ children, className, speed = 0.15 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_QUERY, () => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
    return () => mm.revert();
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className ?? ""}`}>
      {children}
    </div>
  );
}
