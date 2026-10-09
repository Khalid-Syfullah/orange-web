import { ease, invLerp } from "./math";

/** Caption timing inside a scene (scene-local 0..1). */
const IN = [0.04, 0.2] as const;
const OUT = [0.8, 0.96] as const;

export interface CaptionStyle {
  opacity: number;
  /** -1 (entering from below) .. 0 (settled) .. 1 (leaving upward). */
  shift: number;
}

/**
 * Caption visibility as a pure function of scene-local progress, so typography reveals
 * scrub and reverse with everything else. The first scene starts visible and the last
 * one never leaves.
 */
export function captionStyle(local: number, { first = false, last = false } = {}): CaptionStyle {
  const enter = first ? 1 : ease.outCubic(invLerp(IN[0], IN[1], local));
  const leave = last ? 0 : ease.inCubic(invLerp(OUT[0], OUT[1], local));
  return { opacity: Math.min(enter, 1 - leave), shift: leave > 0 ? leave : enter - 1 };
}
