"use client";

import { useSyncExternalStore } from "react";
import type { StoryState } from "@/story/state";
import { storyStore } from "@/story/store";

/**
 * Subscribe a component to one *primitive* slice of the story (an index, a flag).
 * It only re-renders when that slice changes — never once per scroll frame.
 * For per-frame visuals, subscribe with `storyStore.subscribe` and write to the DOM directly.
 */
export function useStorySlice<T extends string | number | boolean>(select: (state: StoryState) => T, serverValue: T): T {
  return useSyncExternalStore(
    storyStore.subscribe,
    () => select(storyStore.getState()),
    () => serverValue,
  );
}

export const useActiveSceneIndex = () => useStorySlice((s) => s.activeIndex, 0);
