import { resolveStory, type StoryState } from "./state";

type Listener = () => void;

/**
 * The one piece of mutable state in the story: scroll progress, written by the master
 * timeline and read by everything else. It lives outside React so a scroll frame never
 * re-renders components; subscribers decide for themselves what to do with it.
 */
let raw = 0;
let reducedMotion = false;
let cache: StoryState | null = null;
const listeners = new Set<Listener>();

function emit() {
  cache = null;
  listeners.forEach((fn) => fn());
}

export const storyStore = {
  getProgress: () => raw,

  setProgress(value: number) {
    if (value === raw) return;
    raw = value;
    emit();
  },

  isReducedMotion: () => reducedMotion,

  setReducedMotion(value: boolean) {
    if (value === reducedMotion) return;
    reducedMotion = value;
    emit();
  },

  /** The resolved frame. Computed at most once per progress change, however many readers. */
  getState(): StoryState {
    cache ??= resolveStory(raw, { reducedMotion });
    return cache;
  },

  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
