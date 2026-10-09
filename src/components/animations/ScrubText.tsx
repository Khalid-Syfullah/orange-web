"use client";

import { useEffect, useRef } from "react";
import { gsap, NO_MOTION_QUERY, registerGsap } from "@/lib/animations";

interface ScrubTextProps {
  text: string;
  className?: string;
}

/** Words light up one by one as the paragraph travels through the viewport. */
export default function ScrubText({ text, className }: ScrubTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_QUERY, () => {
      gsap.fromTo(
        el.querySelectorAll("[data-w]"),
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 55%", scrub: 0.6 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w aria-hidden="true">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
