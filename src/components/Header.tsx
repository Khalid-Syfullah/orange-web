"use client";

import { useEffect, useRef } from "react";
import { useActiveSceneIndex } from "@/hooks/useStory";
import { storyStore } from "@/story/store";
import { TIMELINE } from "@/story/timeline";

/**
 * Wordmark, current chapter and the story progress line. The progress line and ink colour
 * are written from the store per frame; the chapter label re-renders only on chapter change.
 */
export default function Header() {
  const bar = useRef<HTMLDivElement>(null);
  const active = TIMELINE.scenes[useActiveSceneIndex()];

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const state = storyStore.getState();
      root.dataset.ink = state.ink;
      if (bar.current) bar.current.style.transform = `scaleX(${state.raw})`;
    };
    apply();
    return storyStore.subscribe(apply);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 text-[var(--stage-ink)] transition-colors duration-500">
      <div className="flex items-center justify-between px-gutter py-5 md:px-[max(var(--gutter),2vw)] md:py-6">
        <a href="#top" className="font-display text-2xl leading-none tracking-[-0.02em]" aria-label="Orange.io, back to the start">
          Orange<span className="text-orange">.</span>io
        </a>
        <p className="eyebrow flex items-center gap-3" aria-hidden="true">
          {active.chapter === null ? (
            "Scroll to begin"
          ) : (
            <>
              <span className="tabular-nums">{String(active.chapter).padStart(2, "0")}</span>
              <span className="inline-block h-px w-6 bg-current opacity-50" />
              <span>{active.title}</span>
            </>
          )}
        </p>
      </div>
      <div aria-hidden="true" className="h-px w-full bg-current/15">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-orange" />
      </div>
    </header>
  );
}
