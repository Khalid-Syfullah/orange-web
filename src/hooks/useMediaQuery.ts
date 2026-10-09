"use client";

import { useSyncExternalStore } from "react";

/** Live result of a CSS media query. `serverValue` is used for SSR and the first hydration pass. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);
