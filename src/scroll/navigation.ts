import type Lenis from "lenis";
import type { SceneId } from "@/story/config";
import { TIMELINE, anchorOf } from "@/story/timeline";
import type { ScrollTrigger } from "./gsap";

/**
 * Shared handles to the smooth scroller and the master ScrollTrigger, so navigation can
 * move through the story without either one being threaded through React.
 */
let lenis: Lenis | null = null;
let master: ScrollTrigger | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const setMasterTrigger = (trigger: ScrollTrigger | null) => {
  master = trigger;
};

/** Scroll position (px) of a master-timeline progress value, or null before the timeline exists. */
export function scrollForProgress(progress: number): number | null {
  if (!master) return null;
  return master.start + (master.end - master.start) * progress;
}

export function scrollToY(y: number, { immediate = false } = {}) {
  if (lenis && !immediate) {
    // Long jumps are capped so crossing several chapters still feels like one movement.
    const distance = Math.abs(window.scrollY - y);
    lenis.scrollTo(y, { duration: Math.min(2.4, 0.9 + distance / 4000) });
  } else {
    window.scrollTo({ top: y, behavior: "auto" });
  }
}

/** Scroll to the point where a scene reads best. Returns false if the timeline isn't ready. */
export function scrollToScene(id: SceneId, options?: { immediate?: boolean }): boolean {
  const y = scrollForProgress(anchorOf(TIMELINE, id));
  if (y === null) return false;
  scrollToY(y, options);
  return true;
}
