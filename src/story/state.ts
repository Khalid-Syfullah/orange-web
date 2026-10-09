import type { SceneId } from "./config";
import { sampleColor, sampleNumber, sampleVec3 } from "./keyframes";
import { clamp, luminance, type Vec3 } from "./math";
import { TIMELINE, localProgressAll, sceneIndexAt, stillProgress } from "./timeline";
import * as tracks from "./tracks";

export interface CameraState {
  position: Vec3;
  target: Vec3;
  /** Landscape vertical FOV in degrees; the rig widens it for portrait screens. */
  fov: number;
}

export interface LightingState {
  background: string;
  fogNear: number;
  fogFar: number;
  sunPosition: Vec3;
  sunColor: string;
  sunIntensity: number;
  ambient: number;
  rim: number;
}

export interface StoryState {
  /** Scroll progress, 0..1. */
  raw: number;
  /** Progress the scene is rendered at (equals `raw` unless motion is reduced). */
  progress: number;
  /** Scene-local progress for every scene, each 0..1. */
  scenes: Record<SceneId, number>;
  /** The scene the reader is in (always taken from `raw`). */
  activeIndex: number;
  active: SceneId;
  camera: CameraState;
  lighting: LightingState;
  /** Which text colour reads on the current background. */
  ink: "dark" | "light";
}

/**
 * The whole frame, as a pure function of scroll progress. Same input, same output,
 * in either scroll direction: nothing here depends on time or on the previous frame.
 */
export function resolveStory(raw: number, { reducedMotion = false } = {}): StoryState {
  const r = clamp(raw);
  const progress = reducedMotion ? stillProgress(TIMELINE, r) : r;
  const activeIndex = sceneIndexAt(TIMELINE, r);
  const background = sampleColor(tracks.BACKGROUND, progress);

  return {
    raw: r,
    progress,
    scenes: localProgressAll(TIMELINE, progress),
    activeIndex,
    active: TIMELINE.scenes[activeIndex].id,
    camera: {
      position: sampleVec3(tracks.CAMERA_POSITION, progress),
      target: sampleVec3(tracks.CAMERA_TARGET, progress),
      fov: sampleNumber(tracks.CAMERA_FOV, progress),
    },
    lighting: {
      background,
      fogNear: sampleNumber(tracks.FOG_NEAR, progress),
      fogFar: sampleNumber(tracks.FOG_FAR, progress),
      sunPosition: sampleVec3(tracks.SUN_POSITION, progress),
      sunColor: sampleColor(tracks.SUN_COLOR, progress),
      sunIntensity: sampleNumber(tracks.SUN_INTENSITY, progress),
      ambient: sampleNumber(tracks.AMBIENT_INTENSITY, progress),
      rim: sampleNumber(tracks.RIM_INTENSITY, progress),
    },
    ink: luminance(background) > 0.18 ? "dark" : "light",
  };
}

/**
 * Portrait screens see less width, so open the lens up to keep the subject framed.
 * Converts the landscape vertical FOV into the vertical FOV that preserves its width.
 */
export function fitFov(fov: number, aspect: number, reference = 16 / 9): number {
  if (aspect >= reference) return fov;
  const half = (fov * Math.PI) / 360;
  const widened = 2 * Math.atan((Math.tan(half) * reference) / aspect);
  // Don't fully preserve width on tall phones; it would push the subject too far away.
  const blended = half * 2 + (widened - half * 2) * 0.7;
  return Math.min((blended * 180) / Math.PI, 70);
}
