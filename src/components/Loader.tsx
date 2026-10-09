"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations";
import { lockScroll } from "@/lib/scroll";
import { SITE } from "@/lib/constants";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * First-visit loading sequence: a counter climbs while fonts and assets settle, then the
 * curtain lifts and the page's own entrance animations take over (they wait for `orange:ready`).
 * Skipped for reduced motion and for repeat visits within a session (decided in the head script).
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el || html.dataset.loader === "done") return;

    let cancelled = false;
    const main = document.getElementById("main");
    lockScroll(true);
    main?.setAttribute("inert", "");

    const state = { v: 0 };
    const paint = () => {
      const n = Math.round(state.v);
      if (count.current) count.current.textContent = String(n).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${state.v / 100})`;
    };

    const settled = Promise.race([
      Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        document.readyState === "complete"
          ? Promise.resolve()
          : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true })),
      ]),
      wait(4000), // never hold the page hostage
    ]);

    const run = async () => {
      await gsap.to(state, { v: 88, duration: 1.3, ease: "power2.out", onUpdate: paint });
      await settled;
      if (cancelled) return;
      await gsap.to(state, { v: 100, duration: 0.45, ease: "power1.inOut", onUpdate: paint });
      if (cancelled) return;
      await wait(120);

      // Curtain lifts; the page's entrance sequence starts as it clears the headline area.
      const exit = gsap.timeline({ defaults: { ease: "expo.inOut" } });
      exit
        .to(el.querySelectorAll("[data-loader-fade]"), { opacity: 0, y: -16, duration: 0.5, ease: "power2.in" })
        .to(el, { yPercent: -100, duration: 1.1 }, "-=0.2")
        .add(() => {
          html.dataset.ready = "1";
          window.dispatchEvent(new Event("orange:ready"));
        }, "-=0.6");
      await exit;
      if (cancelled) return;

      html.dataset.loader = "done";
      try {
        sessionStorage.setItem("orange-loaded", "1");
      } catch {}
      main?.removeAttribute("inert");
      lockScroll(false);
    };
    run();

    return () => {
      cancelled = true;
      gsap.killTweensOf(state);
      main?.removeAttribute("inert");
      lockScroll(false);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-lenis-prevent
      className="loader fixed inset-0 z-[100] flex-col justify-between bg-ink px-[clamp(16px,4vw,64px)] py-6 text-paper will-change-transform md:py-8"
    >
      <div data-loader-fade className="flex items-center justify-between">
        <span className="flex items-center gap-2.5 font-display text-xl font-bold uppercase tracking-[0.08em]">
          <span className="size-3.5 rounded-full bg-orange" />
          {SITE.name}
        </span>
        <span className="label hidden text-paper/60 md:block">{SITE.secondary}</span>
      </div>

      <div data-loader-fade>
        <div className="flex items-end justify-between">
          <span className="font-display text-[clamp(96px,24vw,380px)] font-bold leading-[0.78] tracking-[-0.06em] tabular-nums">
            <span ref={count}>000</span>
          </span>
          <span className="label mb-2 text-paper/60">Loading</span>
        </div>
        <div className="mt-6 h-px bg-paper/20">
          <span ref={bar} className="block h-px origin-left bg-orange" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
