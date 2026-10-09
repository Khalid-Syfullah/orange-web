/** Minimal damped spring (semi-implicit Euler). Slightly under-damped for a soft settle. */
export class Spring {
  value: number;
  private velocity = 0;

  constructor(
    initial = 0,
    private stiffness = 70,
    private damping = 13,
  ) {
    this.value = initial;
  }

  step(target: number, dt: number): number {
    const h = Math.min(dt, 1 / 30);
    this.velocity += (this.stiffness * (target - this.value) - this.damping * this.velocity) * h;
    this.value += this.velocity * h;
    return this.value;
  }
}

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
