/** Small, dependency-free math helpers. Everything here is pure. */

export type Vec3 = readonly [number, number, number];

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where `v` sits between `a` and `b`, clamped to 0..1. */
export const invLerp = (a: number, b: number, v: number) => (a === b ? (v >= b ? 1 : 0) : clamp((v - a) / (b - a)));

/** Maps `v` from [inA, inB] to [outA, outB], clamped. */
export const remap = (v: number, inA: number, inB: number, outA: number, outB: number) =>
  lerp(outA, outB, invLerp(inA, inB, v));

export const lerpVec3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Fractional part, always positive. */
export const fract = (v: number) => v - Math.floor(v);

/* Easing. Each maps 0..1 -> 0..1 and is safe to call with out-of-range input. */
export type Ease = (t: number) => number;

export const ease = {
  linear: (t) => clamp(t),
  smooth: (t) => {
    const x = clamp(t);
    return x * x * (3 - 2 * x);
  },
  smoother: (t) => {
    const x = clamp(t);
    return x * x * x * (x * (x * 6 - 15) + 10);
  },
  inCubic: (t) => clamp(t) ** 3,
  outCubic: (t) => 1 - (1 - clamp(t)) ** 3,
  inOutCubic: (t) => {
    const x = clamp(t);
    return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
  },
  outExpo: (t) => {
    const x = clamp(t);
    return x === 1 ? 1 : 1 - 2 ** (-10 * x);
  },
} satisfies Record<string, Ease>;

/** 0..1 within the sub-window [from, to] of a 0..1 value, eased. Handy for staging inside a scene. */
export const segment = (t: number, from: number, to: number, fn: Ease = ease.linear) => fn(invLerp(from, to, t));

/* Colour: hex <-> rgb, interpolated in linear light so mid-tones don't turn muddy. */
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToRgb(hex: string): Vec3 {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function rgbToHex([r, g, b]: Vec3): string {
  const to = (v: number) => Math.round(clamp(v) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function lerpColor(a: string, b: string, t: number): string {
  const ca = hexToRgb(a).map(toLinear);
  const cb = hexToRgb(b).map(toLinear);
  return rgbToHex([toSrgb(lerp(ca[0], cb[0], t)), toSrgb(lerp(ca[1], cb[1], t)), toSrgb(lerp(ca[2], cb[2], t))]);
}

/** WCAG relative luminance of a hex colour (0 = black, 1 = white). */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
