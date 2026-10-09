import type { SceneId } from "./config";
import type { Track } from "./keyframes";
import { ease, type Vec3 } from "./math";
import { TIMELINE, at } from "./timeline";
import { WORLD } from "./world";

/** Keyframe position expressed relative to a scene, so retiming a scene moves its keys with it. */
const t = (id: SceneId, local = 0) => at(TIMELINE, id, local);

/* ── Camera ─────────────────────────────────────────────────────────────── */

export const CAMERA_POSITION: Track<Vec3> = [
  { at: t("prologue"), value: [0, 1.7, 12.5] },
  { at: t("watering", 0.5), value: [0.8, 1.8, 8.6] },
  { at: t("growth", 0.9), value: [3.4, 2.9, 7.4] },
  { at: t("ripening", 0.8), value: [1.9, 2.7, 5.1] },
  { at: t("picking", 0.7), value: [2.3, 2.2, 4.4] },
  { at: t("float", 1), value: [WORLD.studio[0], WORLD.studio[1], WORLD.studio[2] + 2.3], ease: ease.smoother },
  { at: t("rotate", 1), value: [WORLD.studio[0], WORLD.studio[1] + 0.05, WORLD.studio[2] + 1.85] },
  { at: t("split", 1), value: [WORLD.studio[0], WORLD.studio[1] + 0.3, WORLD.studio[2] + 2.2] },
  { at: t("reveal", 0.8), value: [WORLD.studio[0], WORLD.studio[1] + 0.95, WORLD.studio[2] + 1.6] },
];

export const CAMERA_TARGET: Track<Vec3> = [
  { at: t("prologue"), value: [0, 1.3, 0] },
  { at: t("watering", 0.5), value: [0, 0.8, 0.7] },
  { at: t("growth", 0.9), value: [0, 1.8, 0] },
  { at: t("ripening", 0.8), value: [0.35, 2.3, 0.4] },
  { at: t("picking", 0.7), value: [0.55, 1.75, 1.2] },
  { at: t("float", 1), value: WORLD.studio, ease: ease.smoother },
  { at: t("reveal", 1), value: WORLD.studio },
];

/** Vertical field of view in degrees, for a landscape viewport (see `fitFov`). */
export const CAMERA_FOV: Track<number> = [
  { at: t("prologue"), value: 32 },
  { at: t("growth", 1), value: 36 },
  { at: t("picking", 1), value: 34 },
  { at: t("float", 1), value: 30 },
  { at: t("reveal", 1), value: 28 },
];

/* ── Lighting ───────────────────────────────────────────────────────────── */

export const BACKGROUND: Track<string> = [
  { at: t("prologue"), value: "#F7F3EA" },
  { at: t("watering", 1), value: "#F5EEE0" },
  { at: t("ripening", 1), value: "#F0DFC4" },
  { at: t("picking", 1), value: "#E9D3B1" },
  { at: t("float", 0.85), value: "#181818", ease: ease.inOutCubic },
  { at: t("split", 1), value: "#181818" },
  { at: t("reveal", 0.8), value: "#22170F" },
];

/** Fog shares the background colour; pulling it in is how the garden dissolves away. */
export const FOG_NEAR: Track<number> = [
  { at: t("prologue"), value: 16 },
  { at: t("picking", 1), value: 10 },
  { at: t("float", 0.8), value: 3.0, ease: ease.inCubic },
];

export const FOG_FAR: Track<number> = [
  { at: t("prologue"), value: 42 },
  { at: t("picking", 1), value: 30 },
  { at: t("float", 0.8), value: 4.2, ease: ease.inCubic },
];

/** The sun in the garden; it becomes the key light in the studio. */
export const SUN_POSITION: Track<Vec3> = [
  { at: t("prologue"), value: [-4, 7, 5] },
  { at: t("growth", 1), value: [-1, 8, 4] },
  { at: t("picking", 1), value: [5, 4.5, 4] },
  { at: t("float", 1), value: [3, 5, 6] },
  { at: t("reveal", 1), value: [1, 6, 5] },
];

export const SUN_COLOR: Track<string> = [
  { at: t("prologue"), value: "#FFF4E2" },
  { at: t("growth", 1), value: "#FFE7C2" },
  { at: t("picking", 1), value: "#FFCF94" },
  { at: t("float", 1), value: "#FFF1E0" },
];

export const SUN_INTENSITY: Track<number> = [
  { at: t("prologue"), value: 2.4 },
  { at: t("ripening", 1), value: 2.9 },
  { at: t("float", 1), value: 3.2 },
  { at: t("reveal", 1), value: 3.6 },
];

export const AMBIENT_INTENSITY: Track<number> = [
  { at: t("prologue"), value: 0.85 },
  { at: t("picking", 1), value: 0.7 },
  { at: t("float", 1), value: 0.25 },
  { at: t("reveal", 1), value: 0.35 },
];

/** Warm rim light from behind the fruit; off in the garden. */
export const RIM_INTENSITY: Track<number> = [
  { at: t("picking", 0.8), value: 0 },
  { at: t("float", 1), value: 6 },
  { at: t("split", 1), value: 8 },
  { at: t("reveal", 1), value: 10 },
];
