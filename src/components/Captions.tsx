"use client";

import { useEffect, useRef } from "react";
import { captionStyle } from "@/story/captions";
import { storyStore } from "@/story/store";
import { TIMELINE } from "@/story/timeline";

const formatChapter = (n: number) => String(n).padStart(2, "0");
const CHAPTERS = TIMELINE.scenes.filter((s) => s.chapter !== null).length;
const LAST = TIMELINE.scenes.length - 1;

/** Initial styles straight from the timeline at progress 0, so server HTML matches frame one. */
function styleAt(index: number, local: number) {
  const { opacity, shift } = captionStyle(local, { first: index === 0, last: index === LAST });
  return { opacity, transform: `translate3d(0, ${shift * 28}px, 0)`, visibility: opacity > 0 ? "visible" : "hidden" } as const;
}

/**
 * On-stage typography. Purely visual (aria-hidden): the same copy is exposed to assistive
 * tech as real sections in the scroll track (see ChapterTargets). Styles are written
 * straight to the DOM from the story store, so captions scrub with the scene and never
 * cause React renders while scrolling.
 */
export default function Captions() {
  const items = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const apply = () => {
      const state = storyStore.getState();
      const reduced = storyStore.isReducedMotion();
      TIMELINE.scenes.forEach((scene, i) => {
        const el = items.current[i];
        if (!el) return;
        const s = reduced
          ? { opacity: i === state.activeIndex ? 1 : 0, transform: "none", visibility: i === state.activeIndex ? "visible" : "hidden" }
          : styleAt(i, state.scenes[scene.id]);
        el.style.opacity = String(s.opacity);
        el.style.transform = s.transform;
        el.style.visibility = s.visibility;
      });
    };
    apply();
    return storyStore.subscribe(apply);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-[var(--stage-ink)]">
      {TIMELINE.scenes.map((scene, i) => {
        const initial = styleAt(i, 0);
        if (scene.chapter === null) {
          return (
            <div
              key={scene.id}
              ref={(el) => {
                items.current[i] = el;
              }}
              style={initial}
              className="absolute inset-x-0 top-[16svh] flex flex-col items-center px-gutter text-center will-change-transform md:top-[14svh]"
            >
              <p className="eyebrow">{scene.kicker}</p>
              <p className="mt-4 font-display text-[clamp(64px,15vw,220px)] leading-[0.85] tracking-[-0.03em]">
                Orange<span className="text-orange">.</span>io
              </p>
              <p className="mt-6 max-w-[34ch] text-[clamp(16px,1.4vw,19px)] leading-relaxed opacity-80">{scene.body}</p>
            </div>
          );
        }
        return (
          <div
            key={scene.id}
            ref={(el) => {
              items.current[i] = el;
            }}
            style={initial}
            className="absolute bottom-[9svh] left-0 w-full px-gutter will-change-transform md:bottom-[11svh] md:w-auto md:max-w-[min(46rem,60vw)] md:pl-[max(var(--gutter),5vw)]"
          >
            <p className="eyebrow">
              <span className="tabular-nums">
                {formatChapter(scene.chapter)} / {formatChapter(CHAPTERS)}
              </span>
              <span className="mx-3 inline-block h-px w-8 bg-current align-middle opacity-50" />
              {scene.kicker}
            </p>
            <p className="mt-3 font-display text-[clamp(52px,9vw,140px)] leading-[0.9] tracking-[-0.025em]">{scene.title}</p>
            <p className="mt-4 max-w-[38ch] text-[clamp(16px,1.35vw,19px)] leading-relaxed opacity-85">{scene.body}</p>
          </div>
        );
      })}
    </div>
  );
}
