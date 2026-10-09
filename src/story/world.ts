import type { Vec3 } from "./math";

/**
 * Fixed world-space marks shared by the camera tracks and the actors, in metres.
 * The tree stands at the origin; +z points toward the opening camera.
 */
export const WORLD = {
  tree: [0, 0, 0] as Vec3,
  /** Height of the fully grown canopy centre. */
  canopy: [0, 2.55, 0] as Vec3,
  /** Where the chosen orange hangs. */
  branch: [0.55, 1.9, 1.2] as Vec3,
  woman: [-1.45, 0, 1.15] as Vec3,
  man: [1.55, 0, 1.0] as Vec3,
  /** Where the woman stands to pick. */
  pickSpot: [0.4, 0, 1.9] as Vec3,
  /**
   * The empty, lit space the orange drifts into once the garden falls away. It sits well
   * in front of the garden, toward the camera, so the fog can swallow the garden while the
   * orange stays inside the clear zone.
   */
  studio: [0.2, 2.0, 5.6] as Vec3,
} as const;
