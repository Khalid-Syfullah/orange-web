# Orange.io

A cinematic, scroll-driven story in eight movements: two people water a young orange
tree, it grows and ripens, one orange is picked, floats toward the camera, turns in slow
motion, splits, and reveals its interior. Scrolling down plays the story and scrolling
up plays it in reverse, frame for frame.

**Status: architecture and blockout.** The whole timeline runs end to end with placeholder
geometry. The detailed scenes (photoreal models, materials, water and juice effects)
come next.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger ·
Lenis · Three.js · React Three Fiber · Drei · Vitest

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm test           # timeline unit tests
npm run lint && npm run typecheck
```

## How it works

```
scroll ─▶ Lenis (smoothing) ─▶ ScrollTrigger ─▶ master GSAP timeline ─▶ progress 0..1
                                                                          │
                                                       storyStore (one number)
                                                                          │
                                                  resolveStory(progress)  ← pure function
                                                                          │
                    ┌───────────────┬──────────────┬──────────────┬───────┴─────┐
                 camera          lighting        actors        captions     chapter UI
```

1. **One master timeline** (`src/scroll/useMasterTimeline.ts`). A single GSAP timeline,
   one second long, is scrubbed by a single ScrollTrigger spanning the story track.
   Timeline time *is* story progress. Each scene is a labelled interval on it.
2. **One piece of state** (`src/story/store.ts`). The timeline publishes progress to a
   tiny store outside React. Nothing re-renders per scroll frame.
3. **Everything else is a pure function of progress** (`src/story/state.ts`,
   `choreography.ts`, `tracks.ts`). Camera, lights, actor poses, fruit growth, water,
   the orange's rotation and split, and caption reveals are all computed from progress
   alone, with no time-based or self-running animations. That makes every frame
   deterministic and reversible, and lets the tests check that.
4. **Render on demand** (`src/components/canvas/StoryCanvas.tsx`). The canvas uses
   `frameloop="demand"`, so the GPU only draws when progress changes.

### Scenes and timing

`src/story/config.ts` is the single source for copy, order and pacing. Each scene has a
`weight` (how much scroll it gets). `buildTimeline` normalises the weights into 0..1
intervals, and the scroll track's height follows from the total weight.

| # | Scene | What happens |
|---|---|---|
| — | prologue | Title over the garden at dawn |
| 1 | watering | A man and a woman water the sapling |
| 2 | growth | The tree grows into full canopy |
| 3 | ripening | Fruit sets and turns from green to orange |
| 4 | picking | She walks to the tree and plucks one orange |
| 5 | float | The garden dissolves; the orange drifts toward the camera |
| 6 | rotate | One slow, full turn in studio light |
| 7 | split | The orange separates into two halves |
| 8 | reveal | The halves open to face the camera |

Keyframes in `src/story/tracks.ts` are placed *relative to scenes*
(`t("growth", 0.9)`), so retiming a scene moves its camera and lighting keys with it.

### Project layout

```
src/
  app/                       layout (fonts, metadata), page, global styles
  story/                     pure, framework-free story logic (unit tested)
    config.ts                scenes: copy, weights, nav anchors, reduced-motion stills
    timeline.ts              master timeline maths: intervals, local progress, anchors
    keyframes.ts             keyframe tracks (number / vec3 / colour) with easing
    tracks.ts                camera + lighting keyframes
    world.ts                 fixed world-space marks (tree, people, studio)
    choreography.ts          actor poses as functions of progress
    captions.ts              caption reveal envelope
    state.ts                 resolveStory(progress) → the whole frame
    store.ts                 progress store (outside React)
  scroll/                    Lenis, GSAP registration, master timeline, navigation
  hooks/                     media queries / reduced motion, store slices
  components/
    Story.tsx                scroll track; sticky stage inside, no pinning
    Stage.tsx                sticky viewport: lazy canvas + captions
    Captions.tsx             on-stage typography, scrubbed from the store
    ChapterTargets.tsx       the story as real, screen-reader-readable sections
    ChapterNav.tsx, Header.tsx, Epilogue.tsx
    canvas/
      StoryCanvas.tsx        R3F canvas (on-demand rendering, adaptive DPR)
      CameraRig.tsx          camera from the timeline, FOV fitted to aspect ratio
      Lighting.tsx           sun/sky → studio key + rim; fog dissolves the garden
      SceneGroup.tsx         reusable: draws children only inside a scene range
      useStoryFrame.ts       per-frame hook that hands actors the resolved state
      scenes/                GardenScene (movements 1–5), OrangeScene (3–8)
      actors/                OrangeTree, Gardener, HeroOrange, Ground (blockouts)
```

### Adding or replacing a scene's content

* An actor reads `useStoryFrame((story) => …)` and applies a pose from a pure function in
  `choreography.ts`. It never keeps animation state of its own.
* Wrap the parts of the world that are only needed for some movements in
  `<SceneGroup from="…" to="…">`.
* Rigged models: drive `AnimationMixer.setTime(clipDuration * localProgress)` from the
  same pose functions instead of playing clips, so they stay scrubbable and reversible.

## Accessibility and motion

* **No scroll hijacking.** The page keeps its native scroll height; the stage is
  `position: sticky`. Keyboard, scrollbar, find-in-page and anchor links all work.
* **Reduced motion.** Lenis is off and the story cuts between composed stills (one per
  scene, `still` in `config.ts`) instead of moving through them. Captions switch without
  transitions.
* **Screen readers** get the full story as headed sections (`ChapterTargets`). The canvas
  and on-stage captions are `aria-hidden`.
* **Chapter navigation** is a list of real `#chapter-…` links. They work without
  JavaScript, smooth-scroll with it, and move focus to the chapter.
* Caption colour flips between ink and cream based on the backdrop's luminance.

## Deployment

CI/CD is unchanged: see `deploy/README.md`. Pushes to `main` run lint, typecheck and build,
then deploy to EC2.
