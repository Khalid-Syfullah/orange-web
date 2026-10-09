import { describe, expect, it } from "vitest";
import { heroOrangePose, manPose, womanPose } from "./choreography";
import { captionStyle } from "./captions";
import { SCENES } from "./config";
import { sampleNumber, type Track } from "./keyframes";
import { lerpColor } from "./math";
import { fitFov, resolveStory } from "./state";
import { TIMELINE, anchorOf, at, buildTimeline, localProgress, sceneIndexAt, stillProgress } from "./timeline";
import * as tracks from "./tracks";
import { WORLD } from "./world";

const steps = (n: number) => Array.from({ length: n + 1 }, (_, i) => i / n);

describe("master timeline", () => {
  it("covers 0..1 with contiguous, ordered scene intervals", () => {
    const { scenes } = TIMELINE;
    expect(scenes[0].start).toBe(0);
    expect(scenes.at(-1)!.end).toBe(1);
    scenes.forEach((s, i) => {
      expect(s.span).toBeGreaterThan(0);
      if (i > 0) expect(s.start).toBeCloseTo(scenes[i - 1].end, 12);
    });
    expect(scenes.map((s) => s.id)).toEqual(SCENES.map((s) => s.id));
  });

  it("sizes scenes by weight", () => {
    const tl = buildTimeline([
      { id: "a", chapter: null, title: "", kicker: "", body: "", weight: 1, anchor: 0, still: 0 },
      { id: "b", chapter: 1, title: "", kicker: "", body: "", weight: 3, anchor: 0, still: 0 },
    ]);
    expect(tl.byId.a.end).toBeCloseTo(0.25);
    expect(tl.length).toBe(4);
  });

  it("finds the owning scene at every boundary", () => {
    TIMELINE.scenes.forEach((s, i) => {
      expect(sceneIndexAt(TIMELINE, s.start)).toBe(i);
      expect(sceneIndexAt(TIMELINE, at(TIMELINE, s.id, 0.5))).toBe(i);
    });
    expect(sceneIndexAt(TIMELINE, 1)).toBe(TIMELINE.scenes.length - 1);
    expect(sceneIndexAt(TIMELINE, -1)).toBe(0);
  });

  it("clamps scene-local progress", () => {
    const s = TIMELINE.byId.growth;
    expect(localProgress(s, 0)).toBe(0);
    expect(localProgress(s, 1)).toBe(1);
    expect(localProgress(s, s.start + s.span / 2)).toBeCloseTo(0.5);
  });

  it("anchors chapter navigation inside its own scene", () => {
    TIMELINE.scenes.forEach((s, i) => expect(sceneIndexAt(TIMELINE, anchorOf(TIMELINE, s.id))).toBe(i));
  });
});

describe("keyframe tracks", () => {
  const track: Track<number> = [
    { at: 0.2, value: 10 },
    { at: 0.6, value: 20 },
  ];

  it("holds outside the keys and hits keys exactly", () => {
    expect(sampleNumber(track, 0)).toBe(10);
    expect(sampleNumber(track, 0.2)).toBe(10);
    expect(sampleNumber(track, 0.6)).toBe(20);
    expect(sampleNumber(track, 1)).toBe(20);
  });

  it("has keys in ascending order on every story track", () => {
    for (const [name, tr] of Object.entries(tracks)) {
      const keys = tr as Track<unknown>;
      keys.forEach((k, i) => i > 0 && expect(k.at, name).toBeGreaterThan(keys[i - 1].at));
    }
  });

  it("interpolates colours at the endpoints exactly", () => {
    expect(lerpColor("#ff7800", "#181818", 0)).toBe("#ff7800");
    expect(lerpColor("#ff7800", "#181818", 1)).toBe("#181818");
  });
});

describe("resolved story", () => {
  it("is deterministic: same progress, same frame, regardless of direction", () => {
    const forward = steps(400).map((p) => resolveStory(p));
    const backward = steps(400)
      .reverse()
      .map((p) => resolveStory(p))
      .reverse();
    expect(backward).toEqual(forward);
  });

  it("is continuous: no jumps in camera or hero orange between neighbouring frames", () => {
    let prev = resolveStory(0);
    let prevOrange = heroOrangePose(prev);
    for (const p of steps(2000).slice(1)) {
      const s = resolveStory(p);
      const o = heroOrangePose(s);
      const camJump = Math.hypot(...s.camera.position.map((v, i) => v - prev.camera.position[i]));
      const orangeJump = Math.hypot(...o.position.map((v, i) => v - prevOrange.position[i]));
      expect(camJump, `camera at ${p}`).toBeLessThan(0.08);
      expect(orangeJump, `orange at ${p}`).toBeLessThan(0.08);
      prev = s;
      prevOrange = o;
    }
  });

  it("hands the orange from branch to hand without a jump", () => {
    const pluck = at(TIMELINE, "picking", 0.6);
    const before = heroOrangePose(resolveStory(pluck - 1e-6));
    const after = heroOrangePose(resolveStory(pluck + 1e-6));
    const hand = womanPose(resolveStory(pluck)).hand;
    after.position.forEach((v, i) => expect(v).toBeCloseTo(before.position[i], 3));
    after.position.forEach((v, i) => expect(v).toBeCloseTo(hand[i], 3));
  });

  it("keeps the reader's chapter while reduced motion shows stills", () => {
    for (const p of steps(300)) {
      const s = resolveStory(p, { reducedMotion: true });
      expect(s.activeIndex).toBe(sceneIndexAt(TIMELINE, p));
      expect(s.progress).toBe(stillProgress(TIMELINE, p));
    }
  });

  it("has the garden fully fogged out before it stops rendering, and never fogs the orange", () => {
    const end = resolveStory(at(TIMELINE, "float", 1));
    const dist = (a: readonly number[], b: readonly number[]) => Math.hypot(...a.map((v, i) => v - b[i]));
    const cam = end.camera.position;
    const garden = [WORLD.woman, WORLD.man, WORLD.pickSpot, WORLD.branch, WORLD.canopy, womanPose(end).hand, manPose(end).hand];
    for (const mark of garden) expect(dist(mark, cam)).toBeGreaterThan(end.lighting.fogFar + 0.5);

    for (const p of steps(400).filter((p) => p >= at(TIMELINE, "float", 0))) {
      const s = resolveStory(p);
      const orange = heroOrangePose(s);
      // Front of the scaled orange must stay nearer than the fog's start.
      expect(dist(orange.position, s.camera.position) - 0.075 * orange.scale, `at ${p}`).toBeLessThan(s.lighting.fogNear);
    }
  });

  it("switches caption ink to light text once the stage goes dark", () => {
    expect(resolveStory(0).ink).toBe("dark");
    expect(resolveStory(at(TIMELINE, "rotate", 0.5)).ink).toBe("light");
  });
});

describe("captions", () => {
  it("are hidden outside their scene and fully shown in the middle", () => {
    expect(captionStyle(0).opacity).toBe(0);
    expect(captionStyle(1).opacity).toBe(0);
    expect(captionStyle(0.5).opacity).toBe(1);
    expect(captionStyle(0, { first: true }).opacity).toBe(1);
    expect(captionStyle(1, { last: true }).opacity).toBe(1);
  });
});

describe("fitFov", () => {
  it("leaves landscape alone and widens portrait within limits", () => {
    expect(fitFov(32, 16 / 9)).toBe(32);
    expect(fitFov(32, 0.5)).toBeGreaterThan(32);
    expect(fitFov(32, 0.2)).toBeLessThanOrEqual(70);
  });
});
