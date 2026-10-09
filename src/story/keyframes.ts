import { clamp, ease as easing, lerp, lerpColor, lerpVec3, type Ease, type Vec3 } from "./math";

/**
 * A keyframe track samples a value at any point of the master progress (0..1).
 * Keys must be sorted by `at`. Values hold before the first key and after the last,
 * and the `ease` of a key shapes the segment that arrives at it.
 */
export interface Key<T> {
  at: number;
  value: T;
  ease?: Ease;
}

export type Track<T> = readonly Key<T>[];

type Mix<T> = (a: T, b: T, t: number) => T;

export function sample<T>(track: Track<T>, t: number, mix: Mix<T>): T {
  if (track.length === 0) throw new Error("Cannot sample an empty track");
  const p = clamp(t);
  if (p <= track[0].at) return track[0].value;
  const last = track[track.length - 1];
  if (p >= last.at) return last.value;

  // Tracks are short (a handful of keys), so a linear scan beats a binary search here.
  let i = 1;
  while (track[i].at < p) i++;
  const from = track[i - 1];
  const to = track[i];
  const local = (p - from.at) / (to.at - from.at);
  return mix(from.value, to.value, (to.ease ?? easing.inOutCubic)(local));
}

export const sampleNumber = (track: Track<number>, t: number) => sample(track, t, lerp);
export const sampleVec3 = (track: Track<Vec3>, t: number) => sample(track, t, lerpVec3);
export const sampleColor = (track: Track<string>, t: number) => sample(track, t, lerpColor);
