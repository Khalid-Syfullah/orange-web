"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useMasterTimeline } from "@/scroll/useMasterTimeline";
import { storyStore } from "@/story/store";
import { TIMELINE } from "@/story/timeline";
import ChapterTargets from "./ChapterTargets";
import Stage from "./Stage";

/**
 * The scroll track. Its height is the story's length; the stage inside is CSS-sticky,
 * so the page scrolls natively the whole way (no pinning, no hijacking) while the
 * master timeline maps the track's scroll range onto story progress 0..1.
 */
export default function Story() {
  const track = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => storyStore.setReducedMotion(reducedMotion), [reducedMotion]);
  useMasterTimeline(track);

  return (
    <section
      ref={track}
      id="story"
      aria-label="The story of an orange"
      className="relative"
      // One screen of track per unit of scene weight, plus the screen the stage occupies.
      style={{ height: `${(TIMELINE.length + 1) * 100}svh` }}
    >
      <Stage />
      <ChapterTargets />
    </section>
  );
}
