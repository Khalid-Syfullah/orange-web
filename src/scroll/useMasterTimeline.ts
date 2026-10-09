"use client";

import { useLayoutEffect, type RefObject } from "react";
import { storyStore } from "@/story/store";
import { TIMELINE } from "@/story/timeline";
import { gsap, ScrollTrigger } from "./gsap";
import { setMasterTrigger } from "./navigation";

/**
 * The master scroll timeline. One GSAP timeline, one second long, scrubbed by one
 * ScrollTrigger spanning the story track: timeline time *is* story progress (0..1).
 *
 * Each scene is a labelled interval on it. The timeline holds a single linear tween that
 * publishes progress to the story store; every visual (camera, lights, actors, captions)
 * is a pure function of that value, so nothing can drift out of sync or animate
 * independently, and scrolling back up replays the exact same frames in reverse.
 */
export function useMasterTimeline(track: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;

    const proxy = { progress: storyStore.getProgress() };
    const timeline = gsap.timeline({ paused: true, defaults: { ease: "none" } });

    for (const scene of TIMELINE.scenes) timeline.addLabel(scene.id, scene.start);
    timeline.fromTo(
      proxy,
      { progress: 0 },
      { progress: 1, duration: 1, onUpdate: () => storyStore.setProgress(proxy.progress) },
      0,
    );

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      animation: timeline,
      // Lenis already smooths the input; scrubbing on top of it would add lag, not polish.
      scrub: true,
      invalidateOnRefresh: true,
    });

    // Land on the right frame immediately, e.g. after a reload halfway down the page.
    timeline.progress(trigger.progress);
    storyStore.setProgress(trigger.progress);
    setMasterTrigger(trigger);

    return () => {
      setMasterTrigger(null);
      trigger.kill();
      timeline.kill();
    };
  }, [track]);
}
