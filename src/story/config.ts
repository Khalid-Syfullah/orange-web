/**
 * The story, scene by scene. This is the single place to edit copy, pacing and order.
 *
 * - `weight` is how much scroll a scene gets relative to the others (1 ≈ one screen).
 *   The master timeline normalises the weights into 0..1 intervals.
 * - `anchor` is the scene-local point (0..1) where chapter navigation lands — where
 *   the scene reads best, with its caption fully in view.
 * - `still` is the scene-local pose shown in the reduced-motion version, which cuts
 *   between scenes instead of moving through them.
 */
export interface SceneConfig {
  id: string;
  /** Chapter number shown in the UI, or null for unnumbered scenes. */
  chapter: number | null;
  title: string;
  kicker: string;
  body: string;
  weight: number;
  anchor: number;
  still: number;
}

export const SCENES = [
  {
    id: "prologue",
    chapter: null,
    title: "Orange.io",
    kicker: "A story in eight movements",
    body: "From the first drop of water to the first bright slice. Scroll to begin.",
    weight: 0.8,
    anchor: 0,
    still: 0,
  },
  {
    id: "watering",
    chapter: 1,
    title: "Tending",
    kicker: "Morning, in the garden",
    body: "Every harvest starts the same way: two people, a young tree and a little patience.",
    weight: 1.4,
    anchor: 0.4,
    still: 0.55,
  },
  {
    id: "growth",
    chapter: 2,
    title: "Growth",
    kicker: "Seasons, compressed",
    body: "Roots take hold. The trunk thickens and the branches reach for the light.",
    weight: 1.4,
    anchor: 0.35,
    still: 1,
  },
  {
    id: "ripening",
    chapter: 3,
    title: "Ripening",
    kicker: "Green, then gold",
    body: "Blossom becomes fruit, and fruit turns slowly to the colour of late afternoon.",
    weight: 1.3,
    anchor: 0.35,
    still: 1,
  },
  {
    id: "picking",
    chapter: 4,
    title: "The pick",
    kicker: "Exactly the right one",
    body: "One orange, chosen by hand at the moment it is ready to let go.",
    weight: 1.3,
    anchor: 0.35,
    still: 0.62,
  },
  {
    id: "float",
    chapter: 5,
    title: "Lift",
    kicker: "Leaving the garden",
    body: "The world falls away until there is only the fruit, drifting into the light.",
    weight: 1.1,
    anchor: 0.35,
    still: 1,
  },
  {
    id: "rotate",
    chapter: 6,
    title: "Study",
    kicker: "In slow motion",
    body: "Turn it once, slowly. Every pore of the peel holds a little of the sun.",
    weight: 1.2,
    anchor: 0.35,
    still: 0.5,
  },
  {
    id: "split",
    chapter: 7,
    title: "Open",
    kicker: "One clean line",
    body: "A single cut, and the orange gives way into two perfect halves.",
    weight: 1.1,
    anchor: 0.35,
    still: 1,
  },
  {
    id: "reveal",
    chapter: 8,
    title: "Inside",
    kicker: "Worth every season",
    body: "Bright, bursting and sweet. This is what all that patience was for.",
    weight: 1.3,
    anchor: 0.45,
    still: 1,
  },
] as const satisfies readonly SceneConfig[];

export type SceneId = (typeof SCENES)[number]["id"];
