"use client";

import type { MouseEvent } from "react";
import { useActiveSceneIndex } from "@/hooks/useStory";
import { scrollToScene } from "@/scroll/navigation";
import type { SceneId } from "@/story/config";
import { storyStore } from "@/story/store";
import { TIMELINE } from "@/story/timeline";

const CHAPTERS = TIMELINE.scenes.filter((s) => s.chapter !== null);

/** Smooth-scroll to a chapter and hand keyboard focus to its section. */
export function goToChapter(event: MouseEvent<HTMLAnchorElement>, id: SceneId) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  if (!scrollToScene(id, { immediate: storyStore.isReducedMotion() })) return; // fall back to the native anchor jump
  event.preventDefault();
  document.getElementById(`chapter-${id}`)?.focus({ preventScroll: true });
  history.replaceState(null, "", `#chapter-${id}`);
}

/**
 * Chapter rail. A real list of links: it works without JavaScript (anchor jumps) and
 * with it (smooth scroll through the timeline). Hidden on small screens until focused.
 */
export default function ChapterNav() {
  const active = useActiveSceneIndex();

  return (
    <nav
      aria-label="Chapters"
      className="fixed right-[max(var(--gutter),2vw)] top-1/2 z-30 -translate-y-1/2 text-[var(--stage-ink)] transition-colors duration-500 max-md:sr-only max-md:focus-within:not-sr-only max-md:focus-within:rounded-sm max-md:focus-within:bg-[var(--stage-paper)] max-md:focus-within:p-4"
    >
      <ol className="flex flex-col gap-1">
        {CHAPTERS.map((scene) => {
          const current = scene.index === active;
          return (
            <li key={scene.id}>
              <a
                href={`#chapter-${scene.id}`}
                onClick={(e) => goToChapter(e, scene.id)}
                aria-current={current ? "step" : undefined}
                className="group flex min-h-8 items-center justify-end gap-3 py-1 text-[11px] uppercase tracking-[0.18em]"
              >
                <span
                  className={`transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
                    current ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  }`}
                >
                  {scene.title}
                </span>
                <span className="tabular-nums opacity-60">{String(scene.chapter).padStart(2, "0")}</span>
                <span
                  aria-hidden="true"
                  className={`block h-px bg-current transition-[width,opacity] duration-500 ease-[var(--ease-out)] ${
                    current ? "w-8 opacity-100" : "w-3 opacity-40 group-hover:w-5"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
