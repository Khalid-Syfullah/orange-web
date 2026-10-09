"use client";

import { useScroll, useSpring } from "motion/react";

/** Smoothed 0 → 1 progress of the whole page. */
export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  return useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
}
