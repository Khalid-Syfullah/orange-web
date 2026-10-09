let cached: boolean | undefined;

/**
 * Whether this device should get the live WebGL sphere.
 * False for save-data, very low core/memory devices, and browsers without WebGL.
 */
export function canRender3D(): boolean {
  if (cached !== undefined) return cached;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  let ok = true;
  if (nav.connection?.saveData) ok = false;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) ok = false;
  if (nav.deviceMemory && nav.deviceMemory <= 2) ok = false;
  if (ok) {
    try {
      const gl = document.createElement("canvas").getContext("webgl2") ?? document.createElement("canvas").getContext("webgl");
      ok = !!gl;
    } catch {
      ok = false;
    }
  }
  cached = ok;
  return ok;
}
