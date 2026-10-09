"use client";

import { useFrame, type RootState } from "@react-three/fiber";
import type { StoryState } from "@/story/state";
import { storyStore } from "@/story/store";

/**
 * Per-frame hook for anything in the 3D scene. The callback receives the resolved story
 * state for the current scroll position and should only *apply* it to refs — never
 * accumulate values across frames — so every frame is reproducible from progress alone.
 */
export function useStoryFrame(apply: (story: StoryState, three: RootState) => void, priority = 0) {
  useFrame((three) => apply(storyStore.getState(), three), priority);
}
