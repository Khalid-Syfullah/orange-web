"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations";

const INTERACTIVE = "a[href], button:not(:disabled), summary, label[for], select, [role='button']";
const TEXT_ENTRY = "input:not([type='submit']):not([type='button']), textarea, [contenteditable='true']";

/**
 * Desktop-only cursor accent: a precise dot plus a trailing ring that swells over interactive
 * elements and steps aside over text fields. Additive — the native cursor is never hidden.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50, opacity: 0 });
      const dx = gsap.quickTo(dotEl, "x", { duration: 0.1, ease: "power3" });
      const dy = gsap.quickTo(dotEl, "y", { duration: 0.1, ease: "power3" });
      const rx = gsap.quickTo(ringEl, "x", { duration: 0.55, ease: "power3" });
      const ry = gsap.quickTo(ringEl, "y", { duration: 0.55, ease: "power3" });

      let visible = false;
      let mode: "idle" | "link" | "text" = "idle";

      const setMode = (next: typeof mode) => {
        if (next === mode) return;
        mode = next;
        gsap.to(ringEl, {
          scale: next === "link" ? 1.9 : next === "text" ? 0.4 : 1,
          opacity: next === "text" ? 0 : 1,
          duration: 0.45,
          ease: "expo.out",
          overwrite: "auto",
        });
        gsap.to(dotEl, { scale: next === "link" ? 0 : 1, opacity: next === "text" ? 0 : 1, duration: 0.3, overwrite: "auto" });
        ringEl.dataset.mode = next;
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!visible) {
          visible = true;
          // Start at the pointer instead of sweeping in from the corner.
          gsap.set([dotEl, ringEl], { x: e.clientX, y: e.clientY });
          gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.4 });
        }
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);

        const target = e.target instanceof Element ? e.target : null;
        const tone = target?.closest("[data-tone]")?.getAttribute("data-tone") ?? "light";
        dotEl.dataset.tone = ringEl.dataset.tone = tone;
        setMode(target?.closest(TEXT_ENTRY) ? "text" : target?.closest(INTERACTIVE) ? "link" : "idle");
      };
      const onDown = () => gsap.to(ringEl, { scale: mode === "link" ? 1.5 : 0.8, duration: 0.2, overwrite: "auto" });
      const onUp = () => gsap.to(ringEl, { scale: mode === "link" ? 1.9 : mode === "text" ? 0.4 : 1, duration: 0.4, ease: "expo.out", overwrite: "auto" });
      const onLeave = () => {
        visible = false;
        gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.3 });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      document.documentElement.addEventListener("pointerleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div
        ref={ring}
        data-mode="idle"
        className="absolute left-0 top-0 size-10 rounded-full border border-ink opacity-0 transition-[background-color,border-color] duration-300 data-[mode=link]:border-orange data-[mode=link]:bg-orange/20 data-[tone=dark]:border-paper"
      />
      <div ref={dot} className="absolute left-0 top-0 size-1.5 rounded-full bg-orange opacity-0" />
    </div>
  );
}
