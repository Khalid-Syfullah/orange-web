import type { SceneId } from "./config";
import { ease, fract, lerp, lerpVec3, segment, type Vec3 } from "./math";
import { WORLD } from "./world";

/**
 * What every actor is doing, as pure functions of the story state.
 * Actors only *render* these poses; they never keep animation state of their own,
 * which is what makes scrubbing in either direction land on the same frame.
 */
export interface Beat {
  /** Master progress 0..1. */
  progress: number;
  /** Scene-local progress for every scene. */
  scenes: Readonly<Record<SceneId, number>>;
}

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];

/* ── Tree ───────────────────────────────────────────────────────────────── */

export interface TreePose {
  /** Trunk height factor, 0..1. */
  trunk: number;
  /** Canopy size factor, 0..1. */
  canopy: number;
  /** Leaf sway in radians; derived from progress so it is deterministic. */
  sway: number;
}

export function treePose({ progress, scenes }: Beat): TreePose {
  const watered = segment(scenes.watering, 0.3, 1, ease.smooth) * 0.06;
  const trunk = lerp(0.26 + watered, 1, segment(scenes.growth, 0, 0.85, ease.smoother));
  const canopy = lerp(0.2 + watered, 1, segment(scenes.growth, 0.1, 1, ease.smoother));
  const sway = Math.sin(progress * Math.PI * 18) * 0.035 * canopy;
  return { trunk, canopy, sway };
}

/* ── Fruit on the tree ──────────────────────────────────────────────────── */

export interface FruitPose {
  /** Size factor, 0..1 (0 = not yet set). */
  size: number;
  /** 0 = green, 1 = fully ripe. */
  ripeness: number;
}

/** Fruit set in a staggered wave; `order` 0..1 is the fruit's place in that wave. */
export function fruitPose({ scenes }: Beat, order: number): FruitPose {
  const delay = order * 0.25;
  return {
    size: segment(scenes.ripening, 0.02 + delay, 0.4 + delay, ease.outCubic),
    ripeness: segment(scenes.ripening, 0.4 + delay * 0.6, 0.95, ease.smooth),
  };
}

/* ── People ─────────────────────────────────────────────────────────────── */

export interface PersonPose {
  position: Vec3;
  /** Rotation about y, radians. 0 faces +z. */
  yaw: number;
  /** Working shoulder, world space. */
  shoulder: Vec3;
  /** Working hand, world space. */
  hand: Vec3;
  /** Watering-can tilt, 0..1. */
  pour: number;
  /** Walk cycle phase, 0..1, for the stride; 0 when standing. */
  stride: number;
  /** Watering can: 0 = in hand, 1 = set down on the ground. */
  canDown: number;
}

const SHOULDER_HEIGHT = 1.38;

function facing(from: Vec3, to: Vec3) {
  return Math.atan2(to[0] - from[0], to[2] - from[2]);
}

function frame(position: Vec3, yaw: number) {
  const forward: Vec3 = [Math.sin(yaw), 0, Math.cos(yaw)];
  const right: Vec3 = [Math.cos(yaw), 0, -Math.sin(yaw)];
  const shoulder = add(add(position, [0, SHOULDER_HEIGHT, 0]), scale(right, -0.2));
  return { forward, right, shoulder };
}

/** Hand holding a can out in front, raised a little while pouring. */
function wateringHand(shoulder: Vec3, forward: Vec3, pour: number): Vec3 {
  return add(add(shoulder, scale(forward, 0.36 + pour * 0.08)), [0, -0.42 + pour * 0.12, 0]);
}

const pourWindow = (local: number, from: number, to: number) =>
  Math.min(segment(local, from, from + 0.12, ease.smooth), 1 - segment(local, to - 0.12, to, ease.smooth));

export function womanPose({ scenes }: Beat): PersonPose {
  const walk = segment(scenes.picking, 0.02, 0.34, ease.inOutCubic);
  const position = lerpVec3(WORLD.woman, WORLD.pickSpot, walk);
  const yaw = facing(position, WORLD.tree);
  const { forward, shoulder } = frame(position, yaw);

  const pour = pourWindow(scenes.watering, 0.12, 0.72);
  const holding = wateringHand(shoulder, forward, pour);
  const rest = add(add(shoulder, scale(forward, 0.12)), [0, -0.6, 0]);
  const hold = add(add(shoulder, scale(forward, 0.42)), [0, -0.22, 0]);

  // Before the walk she holds the can; she sets it down, reaches, plucks and draws the fruit in.
  const setDown = segment(scenes.picking, 0, 0.1, ease.smooth);
  const reach = segment(scenes.picking, 0.36, 0.6, ease.inOutCubic);
  const draw = segment(scenes.picking, 0.66, 0.95, ease.inOutCubic);

  let hand = lerpVec3(holding, rest, setDown);
  hand = lerpVec3(hand, WORLD.branch, reach);
  hand = lerpVec3(hand, hold, draw);

  return { position, yaw, shoulder, hand, pour, stride: walk > 0 && walk < 1 ? fract(walk * 3) : 0, canDown: setDown };
}

export function manPose({ scenes }: Beat): PersonPose {
  const position = WORLD.man;
  // He turns from the tree toward her as she goes to pick.
  const turn = segment(scenes.picking, 0.2, 0.6, ease.inOutCubic);
  const yaw = lerp(facing(position, WORLD.tree), facing(position, WORLD.pickSpot), turn * 0.6);
  const { forward, shoulder } = frame(position, yaw);

  const pour = pourWindow(scenes.watering, 0.3, 0.92);
  const holding = wateringHand(shoulder, forward, pour);
  const rest = add(add(shoulder, scale(forward, 0.1)), [0, -0.6, 0]);
  const setDown = segment(scenes.picking, 0, 0.12, ease.smooth);
  const hand = lerpVec3(holding, rest, setDown);

  return { position, yaw, shoulder, hand, pour, stride: 0, canDown: setDown };
}

/* ── The orange ─────────────────────────────────────────────────────────── */

export interface HeroOrangePose {
  position: Vec3;
  /** Euler rotation, radians. */
  rotation: Vec3;
  /** Uniform scale. 1 = life size on the tree; it grows as it comes toward the camera. */
  scale: number;
  ripeness: number;
  /** Halves pulling apart, 0..1. */
  split: number;
  /** Halves turning their cut faces to the camera, 0..1. */
  open: number;
}

/** The chosen orange's place in the fruit-set wave. */
export const HERO_ORDER = 0.15;

export function heroOrangePose(beat: Beat): HeroOrangePose {
  const { scenes, progress } = beat;
  const grown = fruitPose(beat, HERO_ORDER);

  // On the branch until it is plucked, then it is wherever her hand is.
  const plucked = scenes.picking >= 0.6;
  const inHand = plucked ? womanPose(beat).hand : WORLD.branch;
  // It sways on its stem, settling as her hand closes around it so the pluck has no pop.
  const dangle = Math.sin(progress * Math.PI * 22) * 0.06 * (1 - segment(scenes.picking, 0.4, 0.6, ease.smooth));

  const lift = ease.inOutCubic(scenes.float);
  const arc: Vec3 = [0, Math.sin(Math.PI * lift) * 0.3, 0];
  const position = add(lerpVec3(inHand, WORLD.studio, lift), arc);

  // Six-tenths of a turn while drifting, then one full slow turn so the cut lands face-on.
  const turn = ease.inOutCubic(scenes.rotate);
  const yaw = lerp(-0.6, 0, lift) + turn * Math.PI * 2;
  const tilt = Math.sin(turn * Math.PI) * 0.28 + lerp(0, 0.25, ease.smooth(scenes.reveal));

  const open = segment(scenes.split, 0.45, 1, ease.inOutCubic) * 0.8 + segment(scenes.reveal, 0, 0.7, ease.smoother) * 0.2;

  return {
    position,
    rotation: [tilt, yaw, dangle],
    scale: lerp(grown.size, 3, lift),
    ripeness: grown.ripeness,
    split: segment(scenes.split, 0.1, 0.65, ease.inOutCubic) + segment(scenes.reveal, 0, 0.8, ease.smooth) * 0.35,
    open,
  };
}
