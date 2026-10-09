import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Signature easing — fast out, long settle. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const NO_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

let registered = false;

/** Registers GSAP plugins once, client side only. */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
