import { SCENES, type SceneConfig, type SceneId } from "./config";
import { clamp, invLerp } from "./math";

/** A scene placed on the master timeline: it owns the interval [start, end) of 0..1. */
export interface SceneInterval<Id extends string = SceneId> extends Omit<SceneConfig, "id"> {
  id: Id;
  index: number;
  start: number;
  end: number;
  span: number;
}

export interface Timeline<Id extends string = SceneId> {
  scenes: readonly SceneInterval<Id>[];
  byId: Readonly<Record<Id, SceneInterval<Id>>>;
  /** Total scroll length of the story, in screen heights. */
  length: number;
}

/** Lays scenes end to end on 0..1, each sized by its weight. Pure and deterministic. */
export function buildTimeline<Id extends string>(scenes: readonly (SceneConfig & { id: Id })[]): Timeline<Id> {
  if (scenes.length === 0) throw new Error("A timeline needs at least one scene");
  const total = scenes.reduce((sum, s) => sum + s.weight, 0);
  if (!(total > 0)) throw new Error("Scene weights must add up to more than zero");

  let cursor = 0;
  const placed = scenes.map((scene, index) => {
    const start = cursor / total;
    cursor += scene.weight;
    // Pin the final edge to exactly 1 so float error never leaves a gap at the end.
    const end = index === scenes.length - 1 ? 1 : cursor / total;
    return { ...scene, index, start, end, span: end - start };
  });

  const byId = Object.fromEntries(placed.map((s) => [s.id, s])) as Record<Id, SceneInterval<Id>>;
  return { scenes: placed, byId, length: total };
}

export const TIMELINE = buildTimeline(SCENES);

/** Scene-local progress: 0 before the scene, 1 after it, linear in between. */
export const localProgress = <Id extends string>(scene: SceneInterval<Id>, progress: number) =>
  invLerp(scene.start, scene.end, progress);

/** Index of the scene that owns `progress`. */
export function sceneIndexAt<Id extends string>(timeline: Timeline<Id>, progress: number): number {
  const p = clamp(progress);
  const { scenes } = timeline;
  for (let i = scenes.length - 1; i > 0; i--) if (p >= scenes[i].start) return i;
  return 0;
}

/** Local progress for every scene at once. */
export function localProgressAll<Id extends string>(timeline: Timeline<Id>, progress: number): Record<Id, number> {
  const out = {} as Record<Id, number>;
  for (const scene of timeline.scenes) out[scene.id] = localProgress(scene, progress);
  return out;
}

/** Master progress for a scene-local position. Used to place keyframes relative to scenes. */
export function at<Id extends string>(timeline: Timeline<Id>, id: Id, local = 0): number {
  const scene = timeline.byId[id];
  return scene.start + scene.span * clamp(local);
}

/** Where chapter navigation should land for a scene. */
export const anchorOf = <Id extends string>(timeline: Timeline<Id>, id: Id) => at(timeline, id, timeline.byId[id].anchor);

/**
 * Reduced motion: hold each scene on a single still instead of moving through it.
 * Scrolling still advances (and reverses) the story, but as cuts between composed frames.
 */
export function stillProgress<Id extends string>(timeline: Timeline<Id>, progress: number): number {
  const scene = timeline.scenes[sceneIndexAt(timeline, progress)];
  return at(timeline, scene.id, scene.still);
}
